import { showFeedbackDialog } from './feedbackdialogs';
import { conversationWithKoala } from './main';
import { getKoalaFeedback, sendToKoala } from '../openai';
import { $, log, scrollToBottom, getKoalaReactionEmoteURL } from '../utils';

export const chatInput = $("#message-input");
export const chatContainer = $("#messages-container");

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
    log( { score } );
    this.scores.push(score);
    const averageScore = this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
    $("#chat-dashboard__fluency").textContent = Math.round(averageScore);
  }

  async getKoalaResponse() {
    return sendToKoala(
      this.allMessages() + '\nkoala:'
    );
  }
}

// HTML element that represents a chat message
//  it has an image if it's from Koala
export function chatMessageElement(messageInput, from) {
  const chatElement = document.createElement("div");
  chatElement.classList.add("chat-message");
  chatElement.classList.add(from);

  if (from === "koala") {
    const image = document.createElement("img");
    image.src = `/koala.png`;
    image.width = 40;
    image.height = 40;
    chatElement.appendChild(image);
  }
  if (from === "user") {
    const seeFeedbackButton = document.createElement("button");
    getKoalaFeedback(messageInput).then((feedback) => {
      chatElement.appendChild(seeFeedbackButton);
      let score = 0;
      if (feedback.includes("/") && !feedback.includes("(")) {
        score = Number(feedback.split("/")[0]);
        if (!Number.isNaN(score)) {
          conversationWithKoala.updateScores(score);
        }
      }
      else {
        score = Number(feedback.slice(1, -1).split("/")[0]);
        if (!Number.isNaN(score)) {
          conversationWithKoala.updateScores(score);
        }
      }
      seeFeedbackButton.textContent = `${score}/100`;
      seeFeedbackButton.classList.add("see-feedback-btn");
      seeFeedbackButton.style.backgroundImage = `url(${getKoalaReactionEmoteURL(score)}`;
      seeFeedbackButton.addEventListener("click", () => {
        showFeedbackDialog(messageInput, feedback);
      });
    });
  }
  const messagContent = document.createElement("div");
  messagContent.classList.add("content");
  messagContent.textContent = messageInput;
  chatElement.appendChild(messagContent);
  return chatElement;
}

function appendMessageElement(messageInput, from) {
  chatContainer.appendChild(
    chatMessageElement(messageInput, from)
  );
}
