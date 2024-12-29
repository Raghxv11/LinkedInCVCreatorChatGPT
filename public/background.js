/*global chrome*/

console.log("Background working");
// Declaring constants to store LinkedIn URLs.
const linkedInListViewURL = "https://www.linkedin.com/jobs/collections";
const linkedInDetailView = "https://www.linkedin.com/jobs/view";

// This function returns an array of possible selectors to try
function getJobDescriptionSelectors(url) {
  if (url.startsWith(linkedInListViewURL)) {
    return [
      '.jobs-search__job-details--container',
      '.jobs-search__job-details',
      '.jobs-description__container',
      '.jobs-description__content'
    ];
  } else {
    return [
      '.jobs-description-content__text',
      '.jobs-description',
      '.jobs-description-content',
      '[data-job-description]',
      '.job-view-layout jobs-details'
    ];
  }
}

// This function grabs the job description text from the web page.
function grabJobDescription(selectors) {
  try {
    console.log("Trying to find job description with selectors:", selectors);
    
    let jobDetailsContainer = null;
    
    // Try each selector until we find one that works
    for (const selector of selectors) {
      jobDetailsContainer = document.querySelector(selector);
      if (jobDetailsContainer) {
        console.log("Found container with selector:", selector);
        break;
      }
    }

    if (!jobDetailsContainer) {
      console.log("Job details container not found. Available elements:", document.body.innerHTML);
      return null;
    }

    const jobDetails = jobDetailsContainer.textContent;
    const cleanedJobDetails = jobDetails.replace(/\s\s+/g, " ").trim();
    console.log("Job details found:", cleanedJobDetails.substring(0, 100) + "..."); // Log first 100 chars
    return cleanedJobDetails;
  } catch (error) {
    console.error("Error grabbing job description:", error);
    return null;
  }
}

// This is an event listener that runs when a tab is updated in Chrome.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("Event listener triggered", tab.url);
  
  // Check if the tab is fully loaded
  if (changeInfo.status === "complete") {
    // Check if the URL of the tab matches the LinkedIn list or detail view URL.
    if (
      tab.url?.startsWith(linkedInListViewURL) ||
      tab.url?.startsWith(linkedInDetailView)
    ) {
      console.log("LinkedIn job page detected");
      
      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            func: grabJobDescription,
            args: [getJobDescriptionSelectors(tab.url)],
          })
          .then((queryResult) => {
            console.log("Script execution result:", queryResult);
            if (queryResult[0].result) {
              console.log("Saving job description to storage");
              chrome.storage.local.set({ 
                jobDescription: queryResult[0].result 
              });
            } else {
              console.log("No job description found");
            }
          })
          .catch((error) => {
            console.error("Script execution error:", error);
          });
      }, 2000); // Increased delay to 2 seconds
    }
  }
});
