/** Native and embedded players share one audio owner. Muting never pauses video. */
const players = new Set<() => void>();

export function registerAudioPlayer(mute: () => void) {
  players.add(mute);
  return {
    claim() {
      if (!players.has(mute)) return;
      players.forEach((muteOther) => {
        if (muteOther !== mute) muteOther();
      });
    },
    dispose() {
      players.delete(mute);
    },
  };
}

export function registerNativeAudio(video: HTMLVideoElement) {
  const audio = registerAudioPlayer(() => {
    video.muted = true;
  });
  const claim = () => {
    if (!video.muted && video.volume > 0) audio.claim();
  };
  video.addEventListener("volumechange", claim);
  video.addEventListener("play", claim);
  return () => {
    video.removeEventListener("volumechange", claim);
    video.removeEventListener("play", claim);
    audio.dispose();
  };
}
