
// text-davinci-003 (inglés avanzado)
// text-ada-001 (inglés medio)

export const OPENAI_MODEL = 'text-davinci-003';
export const OPEN_AI_MAX_TOKENS = 1000;
export const KOALA_DESCRIPTION = 'Koala is a talkative and sarcastic chatbot to talk about everything, he is funny and always have a topic of conversation. Also koala cant repeat the same message twice';
export const KOALA_TEMPERATURE = 0.7;

export async function sendToKoala(fullConversation) {

  const openaiResponse = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'OpenAI-Organization': 'org-XZM5MYZC4FwAmxLSIybbs9kH',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "model": OPENAI_MODEL,
      "prompt": `${KOALA_DESCRIPTION}\n` + fullConversation,
      "temperature": KOALA_TEMPERATURE,
      "max_tokens": OPEN_AI_MAX_TOKENS,
    })
  });
  const data = await openaiResponse.json();
  console.log(fullConversation, data);
  return data.choices[0].text;
}
