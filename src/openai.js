
// text-davinci-003 (inglés avanzado)
// text-ada-001 (inglés medio)

import { log } from "./utils";

export const OPENAI_GPT2 = {
  mmodel: 'text-davinci-002',
  max_tokens: 2048
}
export const OPENAI_GPT3 = {
  model: 'text-davinci-003',
  max_tokens: 400
}
export const RESPONSE_MAX_TOKENS = 1000;

export async function openaiRequest(requestBody) {
  const openaiResponse = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  const data = await openaiResponse.json();
  if (data.error) {
    log('OpenAI error:', data.error);
    throw new Error(data.error.message);
  }
  return data;
}

// Chatbot 🐨🐨🐨 =================================

export const KOALA_CHAT_PROMPT = 'Koala is a talkative and sarcastic chatbot to talk about anything, he is funny and always have a topic of conversation.'
  + ' (answers english only):\n\n'

export const KOALA_PUNCTUATION_PROMPT = (message) => (
  'Analyze OBJECTIVELY (without paying atention to the user intents) in a scale from 0 (incomprehensible sentence) to 100 (regular written english) how well my english grammar and spelling are:\n\n'
  + '\nSentence: hi koala uwu i hate my life hehe. the spider spun it has web.\n'
  + 'Feedback: 40/100. Debes mejorar en el uso de mayúsculas, en este caso, "I hate my life" es apropiado. El uso de emoticones es aceptado uwu. Pero revisa tu gramática, lo correcto es "the spider spun its web", para referirse a su telaraña.\n'
  + '\nSentence: dasfajksd fjksadj kflajsdkfj jl\n'
  + 'Feedback: 5/100. Entiendo la emoción, pero trata de agregar más contenido significativo a la conversación para hacerla más amena.\n'
  + '\nSentence: I wan to be yours under the moonlight\n'
  + 'Feedback: 100/100. La escritura y gramática están correctas y bien estructuradas, muy bien hecho.\n'
  + '\nSentence: I hate you, don\'t look at my, you are bad. I don\'t want to watch you again anymore, I hate you.\n'
  + 'Feedback: 70/100. Hay algunos errores notables en la gramática. Primero, para referirte a ti mismo en primera persona, usa "me" en vez de "my". Segundo, si bien es cierto "watch" y "see" tienen traducciones similares, "watch" es más apropiado para referirse a un espectáculo, mientras que "see" es más apropiado para referirse a una persu27"anymore" es incorrecto, la forma correcta es "anymore".\n'
  + `\nSentence: ${message}\n`
  + 'Feedback:'
);

export const KOALA_CHAT_TEMPERATURE = 0.7;

export async function sendToKoala(fullConversation) {

  const openaiResponse = await openaiRequest({
      "model": OPENAI_GPT3.model,
      "prompt": `${KOALA_CHAT_PROMPT}\n` + fullConversation,
      "temperature": KOALA_CHAT_TEMPERATURE,
      "max_tokens": RESPONSE_MAX_TOKENS,
      "stop": ["\nkoala:", "\nuser:"]
  });
  log(fullConversation, openaiResponse);
  return openaiResponse.choices[0].text;
}

export async function getKoalaFeedback(message) {
  const openaiResponse = await openaiRequest({
    "model": OPENAI_GPT3.model,
    "prompt": KOALA_PUNCTUATION_PROMPT(message),

    "temperature": 0,
    "max_tokens": RESPONSE_MAX_TOKENS,
  });

  return openaiResponse.choices[0].text?.trim();
}

// Translator 🐨🐨🐨 =================================

const KOALA_TRANSLATOR_PROMPT = `
Generate a random Spanish sentence, and provide all its possible different exact English translations, in the following format:

Spanish sentence: Cuida a mi amiga Carmen (quien es una bombero real).
English translation:
- Take care of my friend Carmen (who is a real firefighter).
- Look after my friend Carmen (who is a real firewoman).
- Take care of my friend Carmen (who is a real firewoman).

Spanish sentence: Hay que recordar siempre que la felicidad está en la sonrisa.
English translation:
- We must always remember that happiness is in the smile.

Spanish sentence:`;
export const KOALA_TRANSLATOR_TEMPERATURE = 0.95;

export async function getKoalaTranslation() {
  const plainResponse = await openaiRequest({
    "model": OPENAI_GPT3.model,
    "prompt": KOALA_TRANSLATOR_PROMPT,
    "temperature": KOALA_TRANSLATOR_TEMPERATURE,
    "max_tokens": RESPONSE_MAX_TOKENS,
  });

  if (!plainResponse?.choices?.length) {
    return null;
  }
  return plainResponse?.choices[0]?.text;
}
