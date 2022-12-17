import EasySpeech from 'easy-speech';
import { log } from './utils';

const detectResult = EasySpeech.detect();
export const speechSupported = Boolean(detectResult.speechSynthesis && detectResult.speechSynthesisUtterance);

if (speechSupported) {
  EasySpeech.init({ maxTimeout: 5000, interval: 250 })
    .then(() => log('Speech load complete'))
    .catch(e => log(e));
}

export async function speechSentence(sentence) {
  EasySpeech.speak({
    text: sentence,
    // voice: voice, // optional, will use a default or fallback
    pitch: 1,
    rate: 1,
    volume: 1,
    // there are more events, see the API for supported events
    boundary: e => log('boundary reached', { event: e })
  });
}
