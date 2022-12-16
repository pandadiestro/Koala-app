import confetti from 'canvas-confetti';
import { $ } from './utils';

export function throwConfetti() {
  confetti.create($('#confetti-canvas'), {
    resize: true,
    useWorker: true,
  })({
    particleCount: 100,
    disableForReducedMotion: true,
    spread: 70,
  });
}
