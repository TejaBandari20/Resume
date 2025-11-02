
export interface ParsedResume {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  workExperience: Array<{
    title: string;
    company: string;
    dates: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    dates: string;
  }>;
  skills: string[];
}

export interface SkillAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
}

export interface AtsScore {
  score: number;
  reasoning: string;
  suggestions: string;
}

export interface AnalysisResult {
  atsScore: AtsScore;
  skillAnalysis: SkillAnalysis;
  parsedResume: ParsedResume;
}
