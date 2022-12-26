import EasySpeech from 'easy-speech';
import { log } from './utils';

const detectResult = EasySpeech.detect();
log({ detectResult });
let speechSupported = Boolean(detectResult.speechSynthesis && detectResult.speechSynthesisUtterance);
export let speechAPIUsable = new Promise((resolve, _reject) => {
  EasySpeech.init({ maxTimeout: 4000, interval: 200 })
    .then(() => {
      log('speech supported');
      resolve(true);
    })
    .catch(e => {
      log('speech not supported:', e);
      resolve(false);
    })
});

export async function isSpeechSupported() {
  return speechSupported && (await speechAPIUsable);
}

export async function speechSentence(sentence) {
  if (!(await isSpeechSupported())) return;
  const voiceTofind = voice => voice.voiceURI === 'Google US English'
  EasySpeech.speak({
    text: sentence,
    voice: detectResult.speechSynthesis.getVoices().find(voiceTofind) || undefined,
    pitch: 1,
    rate: 1,
    volume: 1,
    // there are more events, see the API for supported events
    boundary: e => log('boundary reached', { event: e })
  });
}
