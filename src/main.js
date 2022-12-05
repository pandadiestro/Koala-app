import { chatContainer, chatInput, Conversation } from './chat';
import { $ } from './utils';
import './voice';
import './feedbackdialogs';

export const conversationWithKoala = new Conversation();

const hideTutorial = () => {
  const tutorial = $('#chat-tutorial');
  chatContainer.removeChild(tutorial);
};

// Tutorial screen has two buttons
$('#chat-tutorial__start-talking-btn').addEventListener('click', () => {
  chatInput.focus();
});
$('#chat-tutorial__make-koala-start-btn').addEventListener('click', async () => {
  hideTutorial();
  const koalaResponse = await conversationWithKoala.getKoalaResponse();
  conversationWithKoala.addMessage(koalaResponse, "koala");
});

// Messages submitted by the user
$("#message-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let userInput = chatInput.value;
  if (userInput.trim() === '') {
    return;
  }
  if (conversationWithKoala.messages.length === 0) {
    hideTutorial();
  }
  chatInput.value = "";
  conversationWithKoala.addMessage(userInput, "user");
 
  const koalaResponse = await conversationWithKoala.getKoalaResponse();
  conversationWithKoala.addMessage(koalaResponse, "koala");
});
