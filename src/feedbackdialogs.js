import { $ } from "./utils";

const feedbackDialog = $("#feedback-dialog");

$("#feedback-dialog").addEventListener("click", (e) => {
  hideFeedbackDialog();
  e.stopPropagation();
});
$("#feedback-dialog__container").addEventListener("click", (e) => {
  e.stopPropagation();
});

$("#feedback-dialog__close-btn").addEventListener("click", () => {
  hideFeedbackDialog();
});

export function hideFeedbackDialog() {
  feedbackDialog.classList.add("hidden");
}
export function showFeedbackDialog(message, koalaFeedback) {
  $("#feedback-dialog__message .content").innerText = message;
  $("#feedback-dialog__feedback .content").innerText = koalaFeedback;
  feedbackDialog.classList.remove("hidden");   
}
