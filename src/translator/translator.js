import { $, log } from '../utils';
import { getKoalaTranslation} from '../openai';
import { throwConfetti } from '../confetti';

export class KoalaTranslator {
  constructor() {
    this.generating = false;
    this.spanishSentence = '';
    this.englishTranslations = [];
    this.writableInput = $('#translator-input-writable');
    this.startButton = $('#start-translator-btn');
    this.nextButton = $('#translator-feedback-content__buttons__next');
    this.textToTranslateGlobe = $('#text-to-translate-container__text');
    this.sendInputButton = $('#send-translator-input-btn');
    this.sendInputButton.disabled = true;
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
    $('#translator-feedback-content__buttons__next').classList.remove('hidden');
    this.nextButton.focus({
      preventScroll: true,
    });
  }
  hideNextButton() {
    $('#translator-feedback-content__buttons__next').classList.add('hidden');
  }

  showSendButton() {
    this.sendInputButton.classList.remove('hidden');
  }

  hideStartButton() {
    $("#start-translator-btn-container").remove();
    this.writableInput.textContent = '';
    this.writableInput.focus();
  }

  async startTranslator() {
    this.hideNextButton();
    const existStartButton = Boolean($("#start-translator-btn"));
    if (existStartButton) {
      this.startButton.textContent = 'Loading...';
      this.startButton.disabled = true;
    }
    const plainResponse = await getKoalaTranslation();
    
    log(this);

    if (existStartButton) {
      this.hideStartButton();
    }
    this.showSendButton();
  
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
  
    // log(this.englishTranslations);
  }

  checkTranslatedUserInput() {
    this.sendInputButton.disabled = true;
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
          log('comparing', word, translation.split(" ")[i]);
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
      // TODO: update this
      // show possible translations
      $('#translator-feedback-content__text p').innerHTML = '<strong>Posibles traducciones:</strong>\n\n'
      $('#translator-feedback-content__text p').innerHTML += this.englishTranslations.join('\n');
      this.showNextButton();
      $('#translator-feedback-content').classList.remove('hidden');

      if (matched) {
        throwConfetti();
      }
    }, 300 * userInputWords.length); // total time of animation

    log({userInput});

  }
}
