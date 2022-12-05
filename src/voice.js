import annyang from 'annyang';
import { $ } from './utils';

export let chatMicListening = false;

export const micButton = $('#toggle-mic');

if (annyang) {
  micButton.addEventListener("click", () => {
    chatMicListening = !chatMicListening;
    if (chatMicListening) annyang.start();
    else annyang.abort();
  });

  annyang.addCallback("start", () => {
    console.log("Ha iniciado");
  });

  annyang.addCallback("end", () => {
    console.log("HA TERMINADO");
    chatMicListening = false;
  });

  annyang.addCallback("result", (input) => {
    $("#message-input").value = input[0];
    annyang.abort();
  });

  window.setInterval(() => {
    annyang.isListening()
      ? console.log("chatMicListening")
      : console.log("not chatMicListening");
  }, 100);
}
else {
  console.log("no funciona");
  micButton.disabled = true;
}
