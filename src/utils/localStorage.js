/*global chrome*/

export const saveResume = (key, data) => {
  if (isChromeExtension()) {
      try {
          return chrome.storage.local.set({ [key]: data });
      } catch (error) {
          console.error('Error saving resume:', error);
      }
  } else {
      return Promise.resolve(localStorage.setItem(key, JSON.stringify(data)));
  }
}

export const loadData = (key) => {
  if (isChromeExtension()) {
      try {
          return chrome.storage.local.get(key).then((data) => data[key]);
      } catch (error) {
          console.error('Error loading resume:', error);
      }
  } else {
      return Promise.resolve(JSON.parse(localStorage.getItem(key)));
  }
}

const isChromeExtension = () => {
  return !!chrome?.storage;
}