
// text-davinci-003 (inglés avanzado)
// text-ada-001 (inglés medio)

export async function sendToKoala(fullConversation) {

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer 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',
      'OpenAI-Organization': 'org-XZM5MYZC4FwAmxLSIybbs9kH',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "model": "text-davinci-003",
      "prompt": `Koala is a talkative and sarcastic chatbot to talk about everything, he is funny and always have a topic of conversation. Also koala cant repeat the same message twice\n`
        + fullConversation,
      "temperature": 0.7,
      "max_tokens": 1000,
    })
  });
  const data = await response.json();
  console.log({ prompt: fullConversation }, { data });
  return data.choices[0].text;
}
