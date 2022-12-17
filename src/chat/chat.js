import { showFeedbackDialog } from './feedbackdialogs';
import { conversationWithKoala } from './main';
import { getKoalaFeedback, sendToKoala } from '../openai';
import { $, log, scrollToBottom, getKoalaReactionEmoteURL } from '../utils';
import { isSpeechSupported, speechSentence } from '../speech';

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

  async addMessage(content, from) {
    this.messages.push(new Message(content, from));
    await appendMessageElement(content, from);
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
//
// Koala:
//  <div class="chat-message koala">
//    <img src="/koala.png" width="40" height="40">
//    <div class="chat-message__globe">
//      <button class="speech-btn">🔊</button>
//      <div class="content">Hello</div>
//    </div>
//  </div>
//
// User:
//  <div class="chat-message user">
//     <div class="chat-message__globe">
//        <div class="content">Hello</div>
//    </div>
//    <button class="see-feedback-btn">50/100</button>
//  </div>
//
export async function chatMessageElement(messageInput, from) {
  const messageElement = document.createElement("div");
  const messagContentElement = document.createElement("div");
  const messageGlobeElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messagContentElement.classList.add("content");
  messageGlobeElement.classList.add("chat-message__globe");
  messageElement.classList.add(from);
  messagContentElement.textContent = messageInput;

  if (from === "koala") {
    const image = document.createElement("img");
    image.src = `/koala.png`;
    image.width = 40;
    image.height = 40;
    messageElement.appendChild(image);

    const speechAPISupported = await isSpeechSupported();
    if (speechAPISupported) {
      const speechButton = document.createElement("button");
      speechButton.classList.add("speech-btn");
      speechButton.textContent = "🔊";
      speechButton.addEventListener("click", () => {
        speechSentence(messageInput);
      });
      messageGlobeElement.appendChild(speechButton);
    }
  }
  if (from === "user") {
    const seeFeedbackButton = document.createElement("button");
    getKoalaFeedback(messageInput).then((feedback) => {
      messageElement.appendChild(seeFeedbackButton);
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
  messageGlobeElement.appendChild(messagContentElement);
  messageElement.appendChild(messageGlobeElement);
  return messageElement;
}

async function appendMessageElement(messageInput, from) {
  chatContainer.appendChild(
    await chatMessageElement(messageInput, from)
  );
}
