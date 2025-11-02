
import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeResume } from './services/geminiService';
import AtsScoreGauge from './components/AtsScoreGauge';
import SkillList from './components/SkillList';

const App: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setResumeFile(file);
        setError(null);
      } else {
        setError('Please upload a valid PDF or image file.');
        setResumeFile(null);
      }
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile || !jobDescription) {
      setError('Please provide both a resume file and a job description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeResume(resumeFile, jobDescription);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeFile, jobDescription]);
  
  const handleDownloadJson = () => {
    if (result) {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(result.parsedResume, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "parsed_resume.json";
      link.click();
    }
  };

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const XIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm5 1a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            AI Resume Screener
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Get instant insights into resume-job description alignment with Gemini.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Inputs</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Upload Resume (PDF or Image)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                     <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
                {resumeFile && <div className="mt-3 flex items-center text-sm text-gray-700 dark:text-gray-300"><FileIcon />{resumeFile.name}</div>}
              </div>

              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Paste Job Description</label>
                <textarea
                  id="job-description"
                  rows={10}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-sm"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!resumeFile || !jobDescription || isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Analysis Results</h2>
             {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex flex-col items-center justify-center rounded-2xl z-10">
                    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg font-semibold">Gemini is thinking...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
                </div>
            )}
            {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">{error}</div>}
            
            {!isLoading && !error && !result && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                <p>Your analysis results will appear here.</p>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-fade-in">
                {/* ATS Score Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    <AtsScoreGauge score={result.atsScore.score} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Score Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{result.atsScore.reasoning}</p>
                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mt-3">Suggestions:</h4>
                     <p className="text-sm text-gray-600 dark:text-gray-400 italic">{result.atsScore.suggestions}</p>
                  </div>
                </div>

                {/* Skill Analysis */}
                <div className="space-y-6">
                   <SkillList title="Matched Skills" skills={result.skillAnalysis.matchedSkills} icon={<CheckIcon />} />
                   <SkillList title="Missing Skills" skills={result.skillAnalysis.missingSkills} icon={<XIcon />} />
                </div>
                
                {/* Parsed Resume & Download */}
                <div>
                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Parsed Resume Data</h3>
                   <div className="max-h-60 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-900 rounded-md text-xs">
                     <pre><code>{JSON.stringify(result.parsedResume, null, 2)}</code></pre>
                   </div>
                   <button
                    onClick={handleDownloadJson}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Download Parsed JSON
                  </button>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
