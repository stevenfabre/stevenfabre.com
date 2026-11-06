"use client";

import { useEffect, useRef, useState } from "react";
import { registerAudioPlayer } from "../../src/utils/mediaAudio";
import { loadYouTubeAPI, type YouTubePlayer } from "../../src/utils/youtube";

export default function ProjectYouTube({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    setFailed(false);
    let disposed = false;
    let player: YouTubePlayer | undefined;
    let audio: ReturnType<typeof registerAudioPlayer> | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    let playing = false;
    let audible = false;
    let awaitingMute = false;
    const checkAudio = (current: YouTubePlayer) => {
      const next = !current.isMuted() && current.getVolume() > 0;
      // YouTube applies mute asynchronously; don't immediately reclaim audio.
      if (awaitingMute) {
        if (!next) awaitingMute = false;
        audible = next;
        if (!awaitingMute && !playing) stopMonitoring();
        return;
      }
      if (playing && next && !audible) audio?.claim();
      audible = next;
    };
    const stopMonitoring = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const monitor = (current: YouTubePlayer) => {
      if (timer) return;
      // The API has no volume event. Observe playback and pending mute acknowledgments.
      timer = setInterval(() => checkAudio(current), 200);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const iframe = document.createElement("iframe");
        iframe.className = "size-full rounded-lg border-0";
        iframe.title = title;
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&playsinline=1&origin=${encodeURIComponent(
          location.origin
        )}`;
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        void loadYouTubeAPI()
          .then((api) => {
            if (disposed) return;
            element.append(iframe);
            player = new api.Player(iframe, {
              events: {
                onReady: ({ target }) => {
                  if (disposed) return;
                  audio = registerAudioPlayer(() => {
                    awaitingMute = true;
                    target.mute();
                    monitor(target);
                  });
                  playing = target.getPlayerState() === 1;
                  if (playing) {
                    checkAudio(target);
                    monitor(target);
                  }
                },
                onStateChange: ({ target, data }) => {
                  if (disposed) return;
                  if (data === 1) {
                    playing = true;
                    checkAudio(target);
                    monitor(target);
                  } else if (data !== 3) {
                    playing = false;
                    audible = false;
                    if (!awaitingMute) stopMonitoring();
                  }
                },
              },
            });
          })
          .catch(() => {
            if (disposed) return;
            // Offer the external link instead of an uncoordinated audible embed.
            iframe.remove();
            setFailed(true);
          });
      },
      { rootMargin: "300px" }
    );
    observer.observe(element);
    return () => {
      disposed = true;
      observer.disconnect();
      clearInterval(timer);
      audio?.dispose();
      player?.destroy();
      element.replaceChildren();
    };
  }, [id, title]);

  return (
    <div className="relative aspect-video w-full" data-no-project-swipe>
      <div ref={container} className="size-full" />
      {failed && (
        <p
          role="status"
          className="absolute inset-0 grid place-content-center p-4 text-center text-sm text-[var(--muted)]"
        >
          Video couldn’t load. Use the link below to watch on YouTube.
        </p>
      )}
    </div>
  );
}
