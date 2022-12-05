import { sendToKoala } from './openai';
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

// HTML element that represents a chat message
//  it has an image if it's from Koala
export function chatMessageElement(message, from) {
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
  const messagContent = document.createElement("div");
  messagContent.classList.add("content");
  messagContent.textContent = message;
  element.appendChild(messagContent);
  return element;
}

function appendMessageElement(message, from) {
  chatContainer.appendChild(
    chatMessageElement(message, from)
  );
}
