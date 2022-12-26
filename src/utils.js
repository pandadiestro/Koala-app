
// Scroll to the top of an HTML container
export function scrollToBottom(element) {
  element.scrollTo({
    top: element.scrollHeight,
    behavior: 'smooth',
  })
}

/**
 * Alias for document.querySelector
 * @param  {string} query 
 */
export function $(query) {
  return document.querySelector(query)
}
/**
 * Alias for document.querySelectorAll
 * @param {string} query 
 */
export function $$(query) {
  return document.querySelectorAll(query)
}

// Log only in development
export function log(...args) {
  if (!import.meta.env.DEV) return;
  console.log(...args);
}

// score from 0 to 100
export function getKoalaReactionEmoteURL(score) {
  const endpoint = `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322`;
  if (score === 0 ) return `${endpoint}/neutral-face_1f610.png`; // 😐
  if (score <= 20 ) return `${endpoint}/fearful-face_1f628.png`; // 😨
  if (score <= 30 ) return `${endpoint}/anguished-face_1f627.png`; // 😧
  if (score <= 50 ) return `${endpoint}/hushed-face_1f62f.png`; // 😯
  if (score <= 60 ) return `${endpoint}/thumbs-up_1f44d.png`; // 👍
  if (score <= 70 ) return `${endpoint}/grinning-face_1f600.png`; // 😀
  if (score <= 90 ) return `${endpoint}/weary-cat_1f640.png`; // 🙀
  if (score <= 100) return `${endpoint}/star_2b50.png`; // ⭐
}
