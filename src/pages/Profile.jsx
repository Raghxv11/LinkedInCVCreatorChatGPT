import React, { useRef } from 'react'
import { ArrowLeft, Upload } from 'lucide-react'
import { routes } from "../utils/routes";
import { saveResume } from "../utils/localStorage";

function Profile({ setPage, resume, setResume }) {
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedResume = formData.get('resume');
    setResume(updatedResume);
    saveResume('resume', updatedResume);
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      setResume(text);
      saveResume('resume', text);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        className="flex items-center gap-2 mb-6" 
        onClick={() => setPage(routes.GENERATOR)}
      >
        <ArrowLeft className="w-6 h-6" />
        <span>Back</span>
      </button>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="resume" 
            className="block text-lg font-medium mb-2"
          >
            Your Resume
          </label>
          <div className="space-y-4">
            {/* <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop your resume
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Supported formats: TXT, PDF, DOCX
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.pdf,.docx"
                onChange={handleFileUpload}
              />
            </div> */}
            <div className="relative">
              <textarea 
                name="resume" 
                id="resume" 
                rows={8} 
                placeholder='Or paste your resume here...'
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  resize-none outline-none transition-all"
              />
            </div>
          </div>
        </div>
        <div>
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold 
              rounded-lg px-6 py-2.5 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile
