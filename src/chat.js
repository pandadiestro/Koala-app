import { showFeedbackDialog } from './feedbackdialogs';
import { getKoalaPunctuation, sendToKoala } from './openai';
import { $, scrollToBottom } from './utils';

export const chatInput = $("#message-input");
export const chatContainer = $("#messages-container");

/*
  <div class="chat-message koala">
    <img src="/koala.png" height="40px" />
    <div class="content">Hola</div>
  </div>
*/

export class Message {
  constructor(message, from) {
    this.message = message;
    this.from = from;
  }
}

export class Conversation {
  constructor() {
    this.messages = [];
  }

  addMessage(content, from) {
    this.messages.push(new Message(content, from));
    appendMessageElement(content, from);
    scrollToBottom(chatContainer);
  }

  allMessages() {
    return this.messages.map((message) => {
      return `${message.from}: ${message.message}`;
    }).join('\n');
  }

  async getKoalaResponse() {
    return sendToKoala(
      this.allMessages() + '\nkoala: '
    );
  }
}

// function feedBackDialog(messageInput, from) {
//   const dialog = document.createElement('div');
//   dialog.classList.add('feedback-dialog');
//   dialog.innerHTML = `
//     <div class="feedback-dialog__content">
//       <div class="feedback-dialog__message">
//         ${messageInput}
//       </div>
//       <div class="feedback-dialog__buttons">
//         <button class="feedback-dialog__button feedback-dialog__button--bad">👎</button>
//         <button class="feedback-dialog__button feedback-dialog__button--good">👍</button>
//       </div>
//     </div>
//   `;
//   return dialog;
// }

// HTML element that represents a chat message
//  it has an image if it's from Koala
export function chatMessageElement(messageInput, from) {
  const element = document.createElement("div");
  element.classList.add("chat-message");
  element.classList.add(from);

  if (from === "koala") {
    const image = document.createElement("img");
    image.src = `/koala.png`;
    image.width = 40;
    image.height = 40;
    element.appendChild(image);
  }
  if (from === "user") {
    const seeFeedbackButton = document.createElement("button");
    getKoalaPunctuation(messageInput).then((punctuation) => {
      seeFeedbackButton.textContent = "👀";
      seeFeedbackButton.classList.add("see-feedback-btn");
      seeFeedbackButton.addEventListener("click", () => {
        showFeedbackDialog(messageInput, punctuation);
      });
      element.appendChild(seeFeedbackButton);
    });
  }
  const messagContent = document.createElement("div");
  messagContent.classList.add("content");
  messagContent.textContent = messageInput;
  element.appendChild(messagContent);
  return element;
}

function appendMessageElement(messageInput, from) {
  chatContainer.appendChild(
    chatMessageElement(messageInput, from)
  );
}
