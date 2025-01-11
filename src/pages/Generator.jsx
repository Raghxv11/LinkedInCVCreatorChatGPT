import React, { useState, useEffect, useRef } from "react";
import { CiSettings } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import { Document, Packer, Paragraph, TextRun } from "docx";
// import { jsPDF } from "jspdf";
import { routes } from "../utils/routes";
import { loadData } from "../utils/localStorage";
import { generateCoverLetter } from "../utils/gemini";

function Generator({ setPage, resume }) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showJobDescInput, setShowJobDescInput] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getJobDescription = async () => {
      try {
        const description = await loadData("jobDescription");
        if (description) {
          setJobDescription(description);
          setShowJobDescInput(true);
        }
      } catch (error) {
        console.error("Error while fetching job description", error);
      }
    };

    getJobDescription();
  }, []);

  const createDocx = async (text) => {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: text.split('\n').map(line => 
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 24, // 12pt font
                font: "Times New Roman"
              })
            ],
            spacing: {
              after: 240, // 12pt spacing
              line: 240, // 1 line spacing
              lineRule: "auto"
            }
          })
        )
      }]
    });
    
    return await Packer.toBlob(doc);
  };

  // const createPDF = (text) => {
  //   const pdf = new jsPDF();
  //   const splitText = pdf.splitTextToSize(text, 180);
  //   pdf.text(splitText, 15, 15);
  //   return pdf.output('blob');
  // };

  const handleDownload = async () => {
    if (!coverLetter) return;

    try {
      const options = {
        suggestedName: 'cover-letter.docx',
        types: [
          {
            description: 'Word Document',
            accept: {
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
            }
          },
          // {
          //   description: 'PDF Document',
          //   accept: {
          //     'application/pdf': ['.pdf']
          //   }
          // },
          {
            description: 'Text Document',
            accept: {
              'text/plain': ['.txt']
            }
          }
        ]
      };

      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();

      let blob;
      if (handle.name.endsWith('.docx')) {
        blob = await createDocx(coverLetter);
      } 
      // else if (handle.name.endsWith('.pdf')) {
      //   blob = createPDF(coverLetter);
      // } 
      else {
        // Default to txt
        blob = new Blob([coverLetter], { type: 'text/plain' });
      }

      await writable.write(blob);
      await writable.close();
    } catch (err) {
      // User cancelled or error occurred
      console.error('Failed to save file:', err);
    }
  };

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

        {!showJobDescInput ? (
          <p
            onClick={() => setShowJobDescInput(true)}
            className="w-full pt-2 text-gray-400 hover:text-white
             hover:underline 
            transition-all duration-200 text-sm text-center"
          >
            Click here to manually paste the job description
          </p>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700">
            <div className="flex justify-between items-center p-2 border-b border-gray-700">
              <span className="text-sm text-gray-400 px-2">Job Description</span>
              <button
                onClick={() => {
                  setShowJobDescInput(false);
                  setJobDescription("");
                }}
                className="text-gray-500 hover:text-white text-sm px-2 py-1 
                rounded hover:bg-gray-700 transition-colors"
              >
                Hide
              </button>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-[200px] p-4 rounded-b-lg bg-transparent
              focus:ring-0 border-none outline-none resize-none
              text-gray-300 text-sm placeholder-gray-500"
              placeholder="Paste job description here..."
            />
          </div>
        )}
        
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
            text-white font-medium rounded-lg px-4 py-2.5 transition-all duration-200 
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

          {coverLetter && (
            <button
              onClick={handleDownload}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg
              transition-all duration-200 flex items-center gap-2 border border-gray-700"
            >
              <FiDownload className="w-4 h-4" />
              <span>Save As</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Generator;
