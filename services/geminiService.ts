
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            resolve(''); // Or handle error appropriately
        }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

export const analyzeResume = async (resumeFile: File, jobDescription: string): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";
  const resumePart = await fileToGenerativePart(resumeFile);

  const prompt = `
    You are an expert ATS (Applicant Tracking System) and professional resume reviewer.
    Your task is to analyze the provided resume and job description.
    Perform the following actions and provide the output in a single, valid JSON object. Do not include any text outside of the JSON object.

    1.  **Parse the Resume**: Extract all relevant information from the resume document into a structured JSON format. Include contact info, professional summary, work experience, education, and a comprehensive list of skills.
    2.  **Analyze Job Description**: Identify key requirements, responsibilities, and skills from the job description.
    3.  **Calculate ATS Score**: Compare the resume to the job description and calculate a matching score from 0 to 100. Provide a brief reasoning for the score and constructive suggestions for improvement.
    4.  **Skill Gap Analysis**: Compare the skills listed in the resume against those required in the job description. Create two lists: "matchedSkills" and "missingSkills".

    Job Description:
    ---
    ${jobDescription}
    ---
  `;
  
  const responseSchema = {
      type: Type.OBJECT,
      properties: {
        atsScore: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "A score from 0-100." },
            reasoning: { type: Type.STRING, description: "Brief reasoning for the score." },
            suggestions: { type: Type.STRING, description: "Constructive suggestions for improvement." }
          },
        },
        skillAnalysis: {
          type: Type.OBJECT,
          properties: {
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        parsedResume: {
          type: Type.OBJECT,
          properties: {
            contactInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                portfolio: { type: Type.STRING }
              },
            },
            summary: { type: Type.STRING },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  dates: { type: Type.STRING },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  dates: { type: Type.STRING },
                },
              },
            },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [resumePart, { text: prompt }] },
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    }
  });

  const responseText = response.text.trim();
  try {
    const result: AnalysisResult = JSON.parse(responseText);
    return result;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", responseText);
    throw new Error("An error occurred while analyzing the resume. The response format was invalid.");
  }
};
