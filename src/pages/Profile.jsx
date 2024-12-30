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
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center px-4 py-3 border-b border-gray-700">
        <button 
          className="mr-3 text-gray-400 hover:text-white transition-colors" 
          onClick={() => setPage(routes.GENERATOR)}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <p className="text-sm text-gray-400">Manage your resume</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-4">
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4">
          <label 
            htmlFor="resume" 
            className="block text-sm font-medium text-white mb-2"
          >
            Your Resume
          </label>
          <textarea 
            name="resume" 
            id="resume" 
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full h-[400px] p-3 rounded-lg bg-gray-900 
            border border-gray-700 text-sm
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            resize-none outline-none transition-all
            text-gray-300 placeholder-gray-500"
            placeholder="Paste your resume here..."
          />
        </div>
        
        <button 
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
          text-white font-medium rounded-lg px-4 py-2.5 transition-all duration-200 
          shadow-md hover:shadow-lg text-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default Profile
