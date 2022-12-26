import { chatContainer, chatInput, Conversation } from './chat';
import './feedbackdialogs';
import { $ } from '../utils';
import '../voice';

export const conversationWithKoala = new Conversation();

const hideTutorial = () => {
  const tutorial = $('#chat-tutorial');
  chatContainer.removeChild(tutorial);
};

// Tutorial screen has two buttons:
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
  let userInput = chatInput.value.trim();
  if (userInput === '') {
    return;
  }
  // Is the first message?
  if (conversationWithKoala.messages.length === 0) {
    hideTutorial();
  }
  chatInput.value = "";
  conversationWithKoala.addMessage(userInput, "user");
  chatInput.disabled = true;
 
  try {
    const koalaResponse = await conversationWithKoala.getKoalaResponse();
    conversationWithKoala.addMessage(koalaResponse, "koala");
  }
  catch (e) {
    conversationWithKoala.addMessage("There was an error, please try again :D", "koala");
  }
  finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
});
