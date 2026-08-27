export const VIDEO_PLAYBACK_RATE = 1.08;

export const atTempo = (frames: number) =>
  Math.max(1, Math.ceil(frames / VIDEO_PLAYBACK_RATE));
