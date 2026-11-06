export type YouTubePlayer = {
  mute(): void;
  isMuted(): boolean;
  getVolume(): number;
  getPlayerState(): number;
  destroy(): void;
};
type PlayerEvent = { target: YouTubePlayer };
type YouTubeAPI = {
  Player: new (
    iframe: HTMLIFrameElement,
    options: {
      events: {
        onReady(event: PlayerEvent): void;
        onStateChange(event: PlayerEvent & { data: number }): void;
      };
    }
  ) => YouTubePlayer;
};
type YouTubeWindow = Window & {
  YT?: YouTubeAPI;
  onYouTubeIframeAPIReady?: () => void;
};

let loading: Promise<YouTubeAPI> | undefined;

/** Load once across route changes, with retry after a network failure. */
export function loadYouTubeAPI(): Promise<YouTubeAPI> {
  const host = window as YouTubeWindow;
  if (host.YT?.Player) return Promise.resolve(host.YT);
  if (loading) return loading;
  loading = new Promise<YouTubeAPI>((resolve, reject) => {
    const script = document.createElement("script");
    const previousReady = host.onYouTubeIframeAPIReady;
    const restoreCallback = () => {
      if (host.onYouTubeIframeAPIReady === ready)
        host.onYouTubeIframeAPIReady = previousReady;
      clearTimeout(timeout);
      script.onerror = null;
    };
    const ready = () => {
      restoreCallback();
      if (host.YT?.Player) resolve(host.YT);
      else reject(new Error("YouTube player API unavailable"));
      previousReady?.();
    };
    const fail = () => {
      restoreCallback();
      script.remove();
      reject(new Error("YouTube player API could not load"));
    };
    const timeout = window.setTimeout(fail, 15000);
    host.onYouTubeIframeAPIReady = ready;
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = fail;
    document.head.append(script);
  }).catch((error) => {
    loading = undefined;
    throw error;
  });
  return loading;
}
