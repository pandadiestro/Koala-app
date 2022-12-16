import { KoalaTranslator } from "./translator";
import { $ } from "../utils";

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
    console.log('setting to false');
    koalaTranslator.sendInputButton.disabled = false;
  }
  else {
    console.log('setting to true');
    koalaTranslator.sendInputButton.disabled = true;
  }
});

$('#send-translator-input-btn').addEventListener('click', (e) => {
  if (koalaTranslator.writableInput.textContent.trim() !== '') {
    koalaTranslator.checkTranslatedUserInput();
  }
});

// https://stackoverflow.com/a/12028136/18114046
$('#translator-input-writable').addEventListener("paste", function(e) {
  // cancel paste
  e.preventDefault();

  // get text representation of clipboard
  const text = (e.originalEvent || e).clipboardData.getData('text/plain');

  // insert text manually
  document.execCommand("insertText", false, text);
});
