export type MediaAsset = { image: string; video?: string };

// Bound retained media: browsing the portfolio must not keep every video alive.
const warmed = new Map<string, HTMLImageElement | HTMLVideoElement>();
const maxWarmAssets = 12;

function retain(url: string, media: HTMLImageElement | HTMLVideoElement) {
  warmed.set(url, media);
  while (warmed.size > maxWarmAssets) {
    const oldest = warmed.keys().next().value as string;
    const previous = warmed.get(oldest);
    if (previous instanceof HTMLVideoElement) {
      previous.removeAttribute("src");
      previous.load();
    }
    warmed.delete(oldest);
  }
}

export function preloadMedia(asset: MediaAsset) {
  if (!warmed.has(asset.image)) {
    const image = new Image();
    image.src = asset.image;
    retain(asset.image, image);
  }
  if (asset.video && !warmed.has(asset.video)) {
    const video = document.createElement("video");
    video.muted = true;
    // Posters are enough for transitions; don't download entire adjacent clips.
    video.preload = "metadata";
    video.src = asset.video;
    retain(asset.video, video);
  }
}

export function afterPageLoad(callback: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    timer = setTimeout(callback, 100);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    clearTimeout(timer);
  };
}
