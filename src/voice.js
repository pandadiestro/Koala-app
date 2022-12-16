import annyang from 'annyang';
import { chatInput } from './chat';
import { $, log } from './utils';

export let chatMicListening = false;

export const micButton = $('#toggle-mic');

if (annyang) {
  micButton.addEventListener("click", () => {
    chatMicListening = !chatMicListening;
    if (chatMicListening) annyang.start();
    else annyang.abort();
  });

  annyang.addCallback("start", () => {
    log("Ha iniciado");
  });

  annyang.addCallback("end", () => {
    log("HA TERMINADO");
    chatMicListening = false;
  });

  annyang.addCallback("result", (input) => {
    chatInput.value = input[0];
    annyang.abort();
  });

  window.setInterval(() => {
    annyang.isListening()
      ? log("chatMicListening")
      : log("not chatMicListening");
  }, 100);
}
else {
  log("no funciona");
  micButton.disabled = true;
  micButton.title = "Tu navegador no soporta esta funcionalidad 😿";
}
