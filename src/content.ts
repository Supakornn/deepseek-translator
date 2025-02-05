let originalTexts = new Map<Element, string>();

async function translatePage() {
  const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a'));
  
  for (const element of elements) {
    const text = element.textContent?.trim();
    if (text && text.length > 0) {
      originalTexts.set(element, text);
      
      chrome.runtime.sendMessage(
        { action: 'translate', text: text },
        (response) => {
          if (response && response.translation) {
            element.textContent = response.translation;
          }
        }
      );
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'translatePage') {
    translatePage();
  } else if (message.action === 'restorePage') {
    originalTexts.forEach((text, element) => {
      element.textContent = text;
    });
  }
});

document.addEventListener('mouseup', (event: MouseEvent) => {
  const selectedText = window.getSelection()?.toString().trim();
  if (selectedText && selectedText.length > 0) {
    chrome.runtime.sendMessage(
      { action: 'translate', text: selectedText },
      (response) => {
        if (response && response.translation) {
          showTranslationPopup(response.translation, event);
        }
      }
    );
  }
});

function showTranslationPopup(translation: string, event: MouseEvent) {
  let popup = document.getElementById('translation-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'translation-popup';
    document.body.appendChild(popup);
  }
  
  popup.textContent = translation;
  popup.style.cssText = `
    position: fixed;
    top: ${event.clientY}px;
    left: ${event.clientX}px;
    background: white;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 10000;
  `;
  
  document.addEventListener('mousedown', function hidePopup() {
    popup?.remove();
    document.removeEventListener('mousedown', hidePopup);
  });
}
