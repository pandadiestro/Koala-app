
// text-davinci-003 (inglés avanzado)
// text-ada-001 (inglés medio)

export let OPENAI_MODEL_GPT2 = 'text-davinci-002';
export let OPENAI_MODEL_GPT3 = 'text-davinci-003';
export const OPEN_AI_MAX_TOKENS = 1000;
export const KOALA_DESCRIPTION = 'Koala is a talkative and sarcastic chatbot to talk about everything, he is funny and always have a topic of conversation. Also koala cant repeat the same message twice.';
export const KOALA_TEMPERATURE = 0.7;

async function openaiRequest(requestBody) {
  const openaiResponse = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'OpenAI-Organization': 'org-XZM5MYZC4FwAmxLSIybbs9kH',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  const data = await openaiResponse.json();
  return data;
}

export async function sendToKoala(fullConversation) {

  const openaiResponse = await openaiRequest({
      "model": OPENAI_MODEL_GPT3,
      "prompt": `${KOALA_DESCRIPTION}\n` + fullConversation,
      "temperature": KOALA_TEMPERATURE,
      "max_tokens": OPEN_AI_MAX_TOKENS,
  });
  console.log(fullConversation, openaiResponse);
  return openaiResponse.choices[0].text;
}

export async function getKoalaPunctuation(message) {
  const openaiResponse = await openaiRequest({
    "model": OPENAI_MODEL_GPT3,
    "prompt": "Koala is a friendly chatbot that is going to analyze OBJECTIVELY (without paying atention to the user intents) in a scale from"
      + " 0 (incomprehensible sentence) to 100 (regular written english)"
      + " how well my english grammar and spelling are after the following phrase: " + message
      + "\n\nscore (in the format n/100) and recommendations: ",

    "temperature": KOALA_TEMPERATURE,
    "max_tokens": OPEN_AI_MAX_TOKENS,
  });

  return openaiResponse.choices[0].text;
}
