
// text-davinci-003 (inglés avanzado)
// text-ada-001 (inglés medio)

import { log } from "./logger";

export const OPENAI_MODEL_GPT2 = 'text-davinci-002';
export const OPENAI_MODEL_GPT3 = 'text-davinci-003';
export const OPEN_AI_MAX_TOKENS = 1000;

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
  return data;
}

// Chatbot 🐨🐨🐨 =================================

export const KOALA_CHAT_PROMPT = 'Koala is a talkative and sarcastic chatbot to talk about anything, he is funny and always have a topic of conversation.'
  + ' (answers english only):\n\n'
export const KOALA_PUNCTUATION_PROMPT = (message) => (
  'Koala is a friendly chatbot that is going to analyze OBJECTIVELY (without paying atention to the user intents) in a scale from'
  + ' 0 (incomprehensible sentence) to 100 (regular written english)'
  + ` how well my english grammar and spelling are after the following phrase: ${message}`
  + '\n\nscore (in the format n/100) and recommendations: '
);

export const KOALA_CHAT_TEMPERATURE = 0.7;

export async function sendToKoala(fullConversation) {

  const openaiResponse = await openaiRequest({
      "model": OPENAI_MODEL_GPT3,
      "prompt": `${KOALA_CHAT_PROMPT}\n` + fullConversation,
      "temperature": KOALA_CHAT_TEMPERATURE,
      "max_tokens": OPEN_AI_MAX_TOKENS,
      "stop": ["\nkoala:", "\nuser:"]
  });
  log(fullConversation, openaiResponse);
  return openaiResponse.choices[0].text;
}

export async function getKoalaPunctuation(message) {
  const openaiResponse = await openaiRequest({
    "model": OPENAI_MODEL_GPT3,
    "prompt": KOALA_PUNCTUATION_PROMPT(message),

    "temperature": KOALA_CHAT_TEMPERATURE,
    "max_tokens": OPEN_AI_MAX_TOKENS,
  });

  return openaiResponse.choices[0].text;
}

// Translator 🐨🐨🐨 =================================

const KOALA_TRANSLATOR_PROMPT = `
Generate a random Spanish sentence, and provide all uts possible different exact English translations (in the following format):

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
    "model": OPENAI_MODEL_GPT3,
    "prompt": KOALA_TRANSLATOR_PROMPT,
    "temperature": KOALA_TRANSLATOR_TEMPERATURE,
    "max_tokens": OPEN_AI_MAX_TOKENS,
  });

  return plainResponse.choices[0].text;
}
