import { KoalaTranslator } from "./translator";
import { $, log } from "../utils";

const koalaTranslator = new KoalaTranslator();

koalaTranslator.nextButton.addEventListener('click', () => {
  koalaTranslator.clear();
  koalaTranslator.startTranslator();
});

koalaTranslator.startButton.addEventListener('click', () => {
  koalaTranslator.startTranslator();
});

koalaTranslator.writableInput.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    e.preventDefault(); // Prevents the addition of a new line
    // If is not empty and is not shift+enter
    if (e.target.textContent.trim() !== '' && !e.shiftKey) {
      koalaTranslator.checkTranslatedUserInput();
    }
  }
});
koalaTranslator.writableInput.addEventListener('input', () => {
  const inputContent = koalaTranslator.writableInput.textContent;
  if (inputContent.trim() !== '') {
    log('setting to false');
    koalaTranslator.sendInputButton.disabled = false;
  }
  else {
    log('setting to true');
    koalaTranslator.sendInputButton.disabled = true;
  }
});

koalaTranslator.sendInputButton.addEventListener('click', (e) => {
  if (koalaTranslator.writableInput.textContent.trim() !== '') {
    koalaTranslator.checkTranslatedUserInput();
  }
});

koalaTranslator.tryAgainButton.addEventListener('click', () => {
  koalaTranslator.clear('try-again');
  koalaTranslator.tryAgainButton.disabled = true;
});

// Handle paste in editable-content div
// https://stackoverflow.com/a/12028136/18114046
koalaTranslator.writableInput.addEventListener("paste", function(e) {
  // cancel paste
  e.preventDefault();

  // get text representation of clipboard
  const text = (e.originalEvent || e).clipboardData.getData('text/plain');

  // insert text manually
  document.execCommand("insertText", false, text);
});
