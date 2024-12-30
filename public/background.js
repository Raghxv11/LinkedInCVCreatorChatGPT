/*global chrome*/

console.log("Background working");
// Declaring constants to store LinkedIn URLs.
const linkedInListViewURL = "https://www.linkedin.com/jobs/collections";
const linkedInDetailView = "https://www.linkedin.com/jobs/view";
const joinHandshakeListViewURL = "https://app.joinhandshake.com/stu/postings";
const joinHandshakeDetailView = "https://app.joinhandshake.com/stu/jobs";
const asu = "https://www.myworkday.com/asu";

// This function returns an array of possible selectors to try
function getJobDescriptionSelectors(url) {
  if (url.startsWith(linkedInListViewURL)) {
    return [
      ".jobs-search__job-details--container",
      ".jobs-search__job-details",
      ".jobs-description__container",
      ".jobs-description__content",
    ];
  } else if (url.startsWith(linkedInDetailView)) {
    return [
      ".jobs-description-content__text",
      ".jobs-description",
      ".jobs-description-content",
      "[data-job-description]",
      ".job-view-layout jobs-details",
    ];
  } 
  // else if (url.startsWith(joinHandshakeListViewURL)) {
  //   return [
  //     ".style__details___zB6XF",
  //     ".style__description-container___1_dQK",
  //     "[data-testid='job-details-description']"
  //   ];
  // } else if (url.startsWith(joinHandshakeDetailView)) {
  //   return [
  //     ".style__description___2dvUH",
  //     ".style__container___cYZJJ",
  //     "[data-testid='description']",
  //     ".job-description"
  //   ];
  // } 
  else if (url.startsWith(asu)) {
    return [
      "[data-automation-id='jobPostingDescription']",
      ".WE0F",
      "[data-automation-id='jobPostingHeader']",
      ".WF2F"
    ];
  }
  return [];
}

// This function grabs the job description text from the web page.
function grabJobDescription(selectors) {
  try {
    console.log("Trying to find job description with selectors:", selectors);

    let jobDetailsContainer = null;
    let jobDetails = '';

    // Try each selector until we find one that works
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        console.log("Found container with selector:", selector);
        // Combine text from all matching elements
        elements.forEach(element => {
          jobDetails += element.textContent + '\n';
        });
        break;
      }
    }

    if (!jobDetails) {
      console.log("Job details not found");
      return null;
    }

    // Clean up the text
    const cleanedJobDetails = jobDetails
      .replace(/\s\s+/g, ' ')
      .replace(/[\n\r]+/g, '\n')
      .trim();

    console.log(
      "Job details found:",
      cleanedJobDetails.substring(0, 100) + "..."
    );
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
    // Check if the URL matches LinkedIn or Handshake URLs
    if (
      tab.url?.startsWith(linkedInListViewURL) ||
      tab.url?.startsWith(linkedInDetailView) ||
      // tab.url?.startsWith(joinHandshakeListViewURL) ||
      // tab.url?.startsWith(joinHandshakeDetailView) ||
      tab.url?.startsWith(asu)
    ) {
      console.log("Job page detected");

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
                jobDescription: queryResult[0].result,
              });
            } else {
              console.log("No job description found");
            }
          })
          .catch((error) => {
            console.error("Script execution error:", error);
          });
      }, 2000);
    }
  }
});
