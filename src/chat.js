import { showFeedbackDialog } from './feedbackdialogs';
import { conversationWithKoala } from './main';
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
    this.scores = [];
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

  updateScores(score) {
    console.log( { score } );
    this.scores.push(score);
    const averageScore = this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
    $("#chat-dashboard__fluency").textContent = Math.round(averageScore);
  }

  async getKoalaResponse() {
    return sendToKoala(
      this.allMessages() + '\nkoala: '
    );
  }
}

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
      if (punctuation.includes("/") && !punctuation.includes("(")) {
        const score = Number(punctuation.split("/")[0]);
        if (!Number.isNaN(score)) {
          conversationWithKoala.updateScores(score);
        }
      }
      else {
        const score = Number(punctuation.slice(1, -1).split("/")[0]);
        if (!Number.isNaN(score)) {
          conversationWithKoala.updateScores(score);
        }
      }
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
