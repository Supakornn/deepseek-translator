import { translate } from "./translator";

/// <reference types="chrome" />
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'translate') {
    translate(message.text, message.targetLang || 'th')
      .then(translation => {
        sendResponse({ translation });
      })
      .catch(error => {
        console.error('Translation error:', error);
        sendResponse({ error: 'Translation failed' });
      });
    return true; 
  }
});
