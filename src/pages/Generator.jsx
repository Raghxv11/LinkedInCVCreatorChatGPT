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

Write a compelling cover letter that highlights relevant experience and skills from the resume that match the job requirements using the information in the job description.`;
      
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cover Letter Generator</h2>
        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" onClick={()=>setPage(routes.PROFILE)}>
          <CiSettings className="w-6 h-6" />
        </button>
      </div>
      <div className="w-full">
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full min-h-[400px] p-4 rounded-lg border border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent
          resize-none outline-none transition-all"
          placeholder="Your generated cover letter will appear here..."
        />
        <button className="bg-blue-500 hover:bg-blue-600 w-fit mt-4 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors" onClick={generateLetter}>
          {isLoading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </div>
    </div>
  );
}

export default Generator;
