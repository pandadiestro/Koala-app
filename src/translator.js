import { $ } from './utils';
import { getKoalaTranslation} from './openai';
import confetti from 'canvas-confetti';

class KoalaTranslator {
  constructor() {
    this.generating = false;
    this.spanishSentence = '';
    this.englishTranslations = [];
    this.writableInput = $('#translator-input-writable');
    this.startButton = $('#start-translator-btn');
    this.nextButton = $('#translator-feedback-content__buttons__next');
    this.textToTranslateGlobe = $('#text-to-translate-container__text');

    this.nextButton.addEventListener('click', () => {
      this.clear();
      this.startTranslator();
    });

    this.startButton.addEventListener('click', () => {
      koalaTranslator.startTranslator();
    });
  }

  clear() {
    $('#translator-feedback-content').classList.add('hidden');
    this.textToTranslateGlobe.textContent = '...';
    this.writableInput.classList.remove('showing-result');
    this.writableInput.textContent = '';
    this.writableInput.focus();
    this.spanishSentence = '';
    this.englishTranslations = [];
  }

  showNextButton() {
    $('#translator-feedback-content').classList.remove('hidden');
    $('#translator-feedback-content__buttons').classList.remove('hidden');
    this.nextButton.focus({
      preventScroll: true,
    });
  }

  async startTranslator() {
    const existStartButton = Boolean($("#start-translator-btn"));
    console.log(this);
    if (existStartButton) {
      this.startButton.textContent = 'Loading...';
      this.startButton.disabled = true;
    }
    const plainResponse = await getKoalaTranslation();

    console.log({plainResponse});

    if (existStartButton) {
      // Hide start button
      $("#start-translator-btn-container").remove();
      this.writableInput.textContent = '';
      this.writableInput.focus();
    }
  
    const [randomSpanishSentence, translationsList] = plainResponse.trim().split(/\nEnglish translation:\s?\n/im);
    
    this.spanishSentence = randomSpanishSentence;
    this.textToTranslateGlobe.textContent = this.spanishSentence;
  
    this.englishTranslations = translationsList.split('\n')
      .map((line) => {
        if (!line.endsWith('.')) {
          return line.slice(1, line.length).trim();
        }
        return line.slice(1, line.length - 1).trim();
      });
  
    // console.log(this.englishTranslations);
  }

  checkTranslatedUserInput() {
    const userInput = this.writableInput.textContent.trim();
    
    const matched = this.englishTranslations.some((translation) => {
      return userInput.toLowerCase() === translation.toLowerCase();
    });
    
    this.writableInput.textContent = '';
    
    const userInputWords = userInput.split(" ");
    
    this.writableInput.classList.add('showing-result');
    userInputWords.forEach((word, i) => {
      if (!word) return;

      const wordElement = document.createElement('span');
      wordElement.textContent = word;
      wordElement.classList.add('word');
      wordElement.dataset.index = i;

      window.setTimeout(() => {
        if (this.englishTranslations.some((translation) => {
          console.log('comparing', word, translation.split(" ")[i]);
          return word.toLowerCase() === translation.split(" ")[i]?.toLowerCase();
        })) {
          wordElement.style.color = 'darkgreen';
        }
        else {
          wordElement.style.color = 'darkred';
        }
        wordElement.style.fontWeight = 'bold';
      }, 300 * (i + 1));

      this.writableInput.appendChild(wordElement);
    });

    // Fired when results animation is done
    window.setTimeout(() => {
      $('#translator-feedback-content__text p').textContent = this.englishTranslations.join('\n');
      this.showNextButton();
      if (matched) {
        throwConfetti();
        this.showNextButton();
      }
    }, 300 * userInputWords.length); // total time of animation

    console.log({userInput});

  }
}

const koalaTranslator = new KoalaTranslator();

$('#translator-input-writable').addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    e.preventDefault(); // Prevents the addition of a new line
    // If is not empty and is not shift+enter
    if (e.target.textContent.trim() !== '' && !e.shiftKey) {
      koalaTranslator.checkTranslatedUserInput();
    }
    return;
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

function throwConfetti() {
  confetti.create($('#confetti-canvas'), {
    resize: true,
    useWorker: true,
  })({
    particleCount: 100,
    disableForReducedMotion: true,
    spread: 70,
  });
}
