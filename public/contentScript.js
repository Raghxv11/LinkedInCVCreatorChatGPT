console.log("Content script loaded - Version 1.0");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  
  if (request.action === "grabJobDescription") {
    console.log("Attempting to grab job description");
    const className = request.className;
    console.log("Looking for element with class:", className);
    
    const jobDetailsContainer = document.querySelector(`.${className}`);
    
    if (jobDetailsContainer) {
      console.log("Found job details container");
      const jobDetails = jobDetailsContainer.textContent;
      const cleanedJobDetails = jobDetails.replace(/\s\s+/g, " ").trim();
      console.log("Job details length:", cleanedJobDetails.length);
      sendResponse({ jobDescription: cleanedJobDetails });
    } else {
      console.log("Job details container not found");
      sendResponse({ error: "Job description container not found" });
    }
  }
  return true;
});