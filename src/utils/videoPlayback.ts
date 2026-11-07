// Shared handoff from homepage/overview previews to the full player.
const playbackKey = "work-playback";
let capturedFrame: { file: string; image: string } | null = null;

export function readVideoFrame(file: string) {
  return capturedFrame?.file === file && readVideoPlayback(file)
    ? capturedFrame.image
    : undefined;
}
type PreviewPlayback = {
  file: string;
  time: number;
  playing: boolean;
  savedAt: number;
};

export function saveVideoPlayback(video: HTMLVideoElement) {
  if (!video.dataset.file) return;
  const playing = !video.paused && !video.ended;
  video.pause();
  capturedFrame = null;
  // Keep the exact clicked frame through the morph and destination decoding.
  // Retain only one frame in memory; never put image data in session storage.
  if (
    video.readyState >= 2 &&
    video.videoWidth &&
    (!video.hasAttribute("data-poster-video") ||
      video.dataset.videoReady === "true")
  ) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0);
        const image = canvas.toDataURL("image/jpeg", 0.95);
        capturedFrame = { file: video.dataset.file, image };
        const poster = video.parentElement?.querySelector<HTMLImageElement>(
          "[data-video-poster]"
        );
        if (poster) poster.src = image;
      }
    } catch {
      // Fall back to the ordinary poster if frame capture is unavailable.
    }
  }
  try {
    sessionStorage.setItem(
      playbackKey,
      JSON.stringify({
        file: video.dataset.file,
        time: video.currentTime,
        playing,
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
