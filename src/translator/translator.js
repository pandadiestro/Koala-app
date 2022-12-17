import { $, log } from '../utils';
import { getKoalaTranslation} from '../openai';
import { throwConfetti } from '../confetti';

export class KoalaTranslator {
  constructor() {
    this.generating = false;
    this.spanishSentence = '';
    this.englishTranslations = [];
    this.writableInput = $('#translator-input-writable');
    this.textToTranslateGlobe = $('#text-to-translate-container__text');
    // Buttons
    this.revealAnswerButton = $('#reveal-answer-btn');
    this.startButton = $('#start-translator-btn');
    this.nextButton = $('#translator-buttons__next');
    this.tryAgainButton = $('#translator-buttons__try-again');
    this.sendInputButton = $('#translator-buttons__send');
    this.sendInputButton.disabled = true;
  }

  clear(mode = 'reset') {
    if (mode === 'reset' || mode === 'try-again') {
      $('#translator-feedback-content').classList.add('hidden');
      this.hideNextButton();
      this.writableInput.classList.remove('showing-result');
      this.writableInput.focus();
      this.writableInput.textContent = '';
    }
    if (mode === 'try-again') {
      this.showSendButton();
      this.hideTryAgainButton();
    }
    if (mode === 'reset') {
      this.textToTranslateGlobe.textContent = '...';
      this.hideTryAgainButton();
      this.spanishSentence = '';
      this.englishTranslations = [];
    }
  }

  showNextButton() {
    $('#translator-buttons__next').classList.remove('hidden');
  }
  hideNextButton() {
    $('#translator-buttons__next').classList.add('hidden');
  }

  showSendButton() {
    this.sendInputButton.classList.remove('hidden');
    this.sendInputButton.disabled = Boolean(this.writableInput.textContent.trim() === '');
  }
  hideSendButton() {
    this.sendInputButton.classList.add('hidden');
  }

  showTryAgainButton() {
    this.tryAgainButton.classList.remove('hidden');
  }
  hideTryAgainButton() {
    this.tryAgainButton.classList.add('hidden');
  }

  showrevealAnswerButton() {
    this.revealAnswerButton.classList.remove('hidden');
    this.revealAnswerButton.textContent = 'Show answer';
  }
  hideRevealAnswerButton() {
    this.revealAnswerButton.classList.add('hidden');
  }

  hideStartButton() {
    $("#start-translator-btn-container").remove();
    this.writableInput.textContent = '';
    this.writableInput.focus({
      preventScroll: true,
    });
  }

  async startTranslator() {
    // Waiting for api response
    const existStartButton = Boolean($("#start-translator-btn"));
    if (existStartButton) {
      this.startButton.textContent = 'Loading...';
      this.startButton.disabled = true;
    }
    this.hideRevealAnswerButton();

    try {
      const plainResponse = await getKoalaTranslation();
      
      // API response received
      log(this);
      this.showSendButton();
      this.hideTryAgainButton();
      if (existStartButton) {
        this.hideStartButton();
      }
      this.showrevealAnswerButton();
      this.revealAnswerButton.disabled = false;
  
      // extract spanish sentence and english translations from API response
      const [randomSpanishSentence, translationsList] = (
        plainResponse.trim().split(/\nEnglish translation:\s?\n/im)
      );
      
      this.spanishSentence = randomSpanishSentence;
      this.textToTranslateGlobe.textContent = this.spanishSentence;
    
      this.englishTranslations = translationsList.split('\n')
        .map((line) => {
          if (!line.endsWith('.')) {
            return line.slice(1, line.length).trim();
          }
          return line.slice(1, line.length - 1).trim();
        });
    }
    catch (error) {
      this.startButton.textContent = 'Reintentar';
      console.error({error});
      this.textToTranslateGlobe.textContent = (
        'Vaya... ha habido un error con la API de OpenAI.\n\n' + error
      )
      this.startButton.disabled = false;
    }
  }

  showAnswers() {
    // TODO: update this
    // show possible translations
    $('#translator-feedback-content__text p').innerHTML = '<strong>Posibles traducciones:</strong>\n\n';
    $('#translator-feedback-content__text p').innerHTML += this.englishTranslations.join('\n');
    $('#translator-feedback-content').classList.remove('hidden');
    this.showNextButton();
    this.nextButton.focus({
      preventScroll: true,
    });
  }

  checkTranslatedUserInput() {
    this.hideSendButton();
    if (this.revealAnswerButton.textContent !== 'Revealed') {
      this.hideRevealAnswerButton();
    }
    let userInput = this.writableInput.textContent.trim();
    if (!userInput) return;
    if (userInput.endsWith('.')) {
      userInput = userInput.slice(0, -1);
    }
    
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

      // Animate each word
      window.setTimeout(() => {
        if (this.englishTranslations.some((translation) => {
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
      this.showAnswers();
      if (matched) {
        throwConfetti();
      }
      else {
        this.tryAgainButton.disabled = false;
        this.showTryAgainButton();
        this.tryAgainButton.focus({
          preventScroll: true,
        });
      }
    }, 300 * userInputWords.length); // total time of animation

    log({userInput});
  }
}
