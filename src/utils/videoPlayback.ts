// Shared handoff from homepage/overview previews to the full player.
const playbackKey = "work-playback";
type PreviewPlayback = {
  file: string;
  time: number;
  playing: boolean;
  savedAt: number;
};

export function saveVideoPlayback(video: HTMLVideoElement) {
  if (!video.dataset.file) return;
  try {
    sessionStorage.setItem(
      playbackKey,
      JSON.stringify({
        file: video.dataset.file,
        time: video.currentTime,
        playing: !video.paused,
        savedAt: Date.now(),
      } satisfies PreviewPlayback)
    );
  } catch {
    // Navigation still works when storage is unavailable.
  }
}

export function readVideoPlayback(file: string): PreviewPlayback | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(playbackKey) || "null");
    if (saved?.file !== file) return null;
    return Number.isFinite(saved.time) &&
      saved.time >= 0 &&
      typeof saved.playing === "boolean" &&
      Number.isFinite(saved.savedAt) &&
      Date.now() - saved.savedAt >= 0 &&
      Date.now() - saved.savedAt < 15000
      ? saved
      : null;
  } catch {
    return null;
  }
}

export function clearVideoPlayback() {
  try {
    sessionStorage.removeItem(playbackKey);
  } catch {
    /* Storage is optional. */
  }
}
