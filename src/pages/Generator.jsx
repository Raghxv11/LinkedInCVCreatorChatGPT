import React, { useState, useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { routes } from "../utils/routes";
import { loadData } from "../utils/localStorage";
import { generateCoverLetter } from "../utils/gemini";

function Generator({ setPage, resume }) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load job description from local storage on component mount
    const getJobDescription = async () => {
      try {
        const description = await loadData("jobDescription");
        setJobDescription(description);
      } catch (error) {
        console.error("Error while fetching job description", error);
      }
    };

    getJobDescription();
  }, []);



  const generateLetter = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate a professional cover letter based on the following resume and job description:

Resume:
${resume}

Job Description:
${jobDescription}

Make sure the letter:
- uses correct business format with date and addresses at the top, and a signature at the bottom
- is concise and grammatically correct
- has a strong introduction that:
  • clearly identifies the position you're applying for
  • explains how you heard about the opening
  • describes why you're interested in a compelling way
  • catches attention quickly
- has a focused middle section that:
  • highlights 1-2 of your strongest qualifications (from the resume)
  • specifically relates your skills to the job requirements
  • explains your interest in the position, company, and/or location
  • adds value beyond just restating your resume
- has a strong closing that:
  • refers to your resume and any other enclosed documents
  • thanks the reader for their time
  • describes how and when you will follow up
`;
      
      const letter = await generateCoverLetter(prompt);
      setCoverLetter(letter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      // Optionally show error to user
      setCoverLetter("An error occurred while generating the cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">Streamline your job application process</h2>
          <p className="text-sm text-gray-400">Create professional cover letters in seconds</p>
        </div>
        <button 
          className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200 group"
          onClick={() => setPage(routes.PROFILE)}
        >
          <CiSettings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-45 transition-all duration-200" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full h-[400px] p-4 rounded-lg bg-transparent
            focus:ring-0 border-none outline-none resize-none
            text-gray-300 text-sm placeholder-gray-500"
            placeholder="Your generated cover letter will appear here..."
          />
        </div>
        
        <button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
          w-full text-white font-medium rounded-lg px-4 py-2.5 transition-all duration-200 
          shadow-md hover:shadow-lg text-sm"
          onClick={generateLetter}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            "Generate Cover Letter"
          )}
        </button>
      </div>
    </div>
  );
}

export default Generator;
