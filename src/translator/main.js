import { KoalaTranslator } from "./translator";

const koalaTranslator = new KoalaTranslator();

// =================== Buttons ===================

koalaTranslator.nextButton.addEventListener('click', () => {
  koalaTranslator.clear('reset');
  koalaTranslator.startTranslator();
});

koalaTranslator.startButton.addEventListener('click', () => {
  koalaTranslator.startTranslator();
});

koalaTranslator.sendInputButton.addEventListener('click', (e) => {
  if (koalaTranslator.writableInput.textContent.trim() !== '') {
    koalaTranslator.checkTranslatedUserInput();
    koalaTranslator.revealAnswerButton.disabled = true;
  }
});

koalaTranslator.tryAgainButton.addEventListener('click', () => {
  koalaTranslator.clear('try-again');
  koalaTranslator.tryAgainButton.disabled = true;
});

koalaTranslator.revealAnswerButton.addEventListener('click', () => {
  koalaTranslator.revealAnswerButton.disabled = true;
  koalaTranslator.revealAnswerButton.textContent = 'Revealed';
  koalaTranslator.showAnswers();
});

// =================== Input ===================

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
    koalaTranslator.sendInputButton.disabled = false;
  }
  else {
    koalaTranslator.sendInputButton.disabled = true;
  }
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
