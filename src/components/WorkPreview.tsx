"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import CompanyLink from "./CompanyLink";
import {
  isPlainNavigation,
  rememberProjectNavigation,
} from "../utils/projectNavigation";
import { afterPageLoad, preloadMedia } from "../utils/preloadMedia";
import styles from "./WorkPreview.module.css";

type Preview = {
  file: string;
  title: string;
  href: string;
  image: string;
  video?: string;
};
type Selection = { company: string; open: boolean; keyboard: boolean };
type Playback = { index: number; cycle: number };
type PreviewContext = {
  previews: Record<string, Preview[]>;
  playback: Record<string, Playback>;
  open: (company: string, x: number, y: number, keyboard?: boolean) => void;
  move: (x: number, y: number) => void;
  close: () => void;
  savePlayback: (file: string) => void;
};
const Context = createContext<PreviewContext | null>(null);

export function WorkPreviewProvider({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const position = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [previews, setPreviews] = useState<Record<string, Preview[]>>({});
  const [nearby, setNearby] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [playback, setPlayback] = useState<Record<string, Playback>>({});
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/work/preview", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : {}))
      .then(setPreviews)
      .catch(() => {});
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motion.matches);
    syncMotion();
    motion.addEventListener("change", syncMotion);
    const cancelReady = afterPageLoad(() => setNearby(true));
    return () => {
      controller.abort();
      cancelReady();
      motion.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => {
    if (!nearby) return;
    Object.values(previews).forEach((projects) => {
      if (projects[0]) preloadMedia(projects[0]);
    });
  }, [nearby, previews]);

  const close = useCallback(() => {
    setSelection((current) =>
      current?.open ? { ...current, open: false } : current
    );
  }, []);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const hidden = () => {
      if (document.hidden) close();
    };
    window.addEventListener("keydown", escape);
    window.addEventListener("blur", close);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("blur", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [close]);

  const move = useCallback((x: number, y: number) => {
    pointer.current = { x, y };
    const element = position.current;
    if (!element) return;
    // Position follows the pointer 1:1. Only the nested card has an entrance transition.
    const width = Math.min(280, window.innerWidth - 24);
    const height = ((width - 12) * 2) / 3 + 12;
    const left = Math.max(
      12,
      Math.min(x - width / 2, window.innerWidth - width - 12)
    );
    const above = y - height - 24 >= 12;
    const top = above
      ? y - height - 24
      : Math.min(y + 24, window.innerHeight - height - 12);
    element.style.transform = `translate3d(${left}px, ${Math.max(
      12,
      top
    )}px, 0)`;
    element.dataset.side = above ? "top" : "bottom";
    const card = element.firstElementChild as HTMLElement | null;
    if (card)
      card.style.transformOrigin = `${x - left}px ${above ? "100%" : "0%"}`;
  }, []);

  const open = useCallback(
    (company: string, x: number, y: number, keyboard = false) => {
      move(x, y);
      setNearby(true);
      setSelection({ company, open: true, keyboard });
    },
    [move]
  );

  useLayoutEffect(() => {
    move(pointer.current.x, pointer.current.y);
  }, [nearby, selection?.company, move]);

  const advance = useCallback(
    (company: string) => {
      setPlayback((current) => {
        const previous = current[company] || { index: 0, cycle: 0 };
        return {
          ...current,
          [company]: {
            index: (previous.index + 1) % previews[company].length,
            cycle: previous.cycle + 1,
          },
        };
      });
    },
    [previews]
  );

  const savePlayback = useCallback((file: string) => {
    const video = position.current?.querySelector<HTMLVideoElement>(
      `video[data-file="${file}"]`
    );
    if (!video) return;
    try {
      sessionStorage.setItem(
        "work-playback",
        JSON.stringify({
          file,
          time: video.currentTime,
          playing: !video.paused,
          savedAt: Date.now(),
        })
      );
    } catch {
      /* The link still works without storage. */
    }
  }, []);

  return (
    <Context.Provider
      value={{ previews, playback, open, move, close, savePlayback }}
    >
      <div className={className}>{children}</div>
      {nearby &&
        createPortal(
          <div ref={position} className={styles.position} aria-hidden="true">
            <div
              className={styles.card}
              data-open={selection?.open || false}
              data-keyboard={selection?.keyboard || false}
            >
              <div className={styles.screen}>
                {Object.entries(previews).map(([company, projects]) => {
                  const current = playback[company] || { index: 0, cycle: 0 };
                  const visible = selection?.company === company;
                  const playing =
                    visible &&
                    selection.open &&
                    !selection.keyboard &&
                    !reducedMotion;
                  return projects.map(
                    (project, index) =>
                      (index === 0 ||
                        (visible &&
                          selection.open &&
                          (index === current.index ||
                            index ===
                              (current.index + 1) % projects.length))) && (
                        <PreviewFrame
                          key={project.file}
                          project={project}
                          active={!!playing && current.index === index}
                          visible={visible && current.index === index}
                          shared={
                            !!(
                              visible &&
                              selection.open &&
                              current.index === index
                            )
                          }
                          cycle={current.cycle}
                          preload={
                            playing &&
                            (index === current.index ||
                              index === (current.index + 1) % projects.length)
                              ? "auto"
                              : index === 0
                              ? "metadata"
                              : "none"
                          }
                          advance={() => advance(company)}
                        />
                      )
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </Context.Provider>
  );
}

function PreviewFrame({
  project,
  active,
  visible,
  shared,
  cycle,
  preload,
  advance,
}: {
  project: Preview;
  active: boolean;
  visible: boolean;
  shared: boolean;
  cycle: number;
  preload: "auto" | "metadata" | "none";
  advance: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const next = useRef(advance);
  next.current = advance;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!active) {
      element?.pause();
      return;
    }
    // A static image (or failed video poster) gets exactly five seconds.
    if (!element || failed) {
      const timer = window.setTimeout(() => next.current(), 5000);
      return () => window.clearTimeout(timer);
    }
    if (element.ended) element.currentTime = 0;
    let cancelled = false;
    void element.play().catch((error) => {
      if (!cancelled && error.name !== "AbortError") setFailed(true);
    });
    return () => {
      cancelled = true;
      element.pause();
    };
  }, [active, cycle, failed]);

  return (
    <div
      className={styles.frame}
      data-visible={visible}
      data-work-visual
      style={
        {
          viewTransitionName: shared ? `film-${project.file}` : undefined,
        } as CSSProperties
      }
    >
      {/* Posters paint immediately while videos prepare. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={
          active && (!project.video || failed) ? styles.drifting : undefined
        }
        src={project.image}
        alt=""
        width={280}
        height={187}
        decoding="async"
      />
      {project.video && !failed && (
        <video
          ref={video}
          data-file={project.file}
          src={project.video}
          poster={project.image}
          muted
          playsInline
          preload={preload}
          onEnded={() => {
            if (active) next.current();
          }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function WorkPreviewLink({
  company,
  children,
  className,
}: {
  company: string;
  children: ReactNode;
  className?: string;
}) {
  const preview = useContext(Context);
  const projects = preview?.previews[company];
  if (!preview || !projects?.length) return <>{children}</>;
  const project = projects[preview.playback[company]?.index || 0];
  return (
    <CompanyLink
      className={className}
      href={project.href}
      clientNavigation
      aria-label={`View ${company} work`}
      onPointerEnter={(event) => {
        if (
          event.pointerType !== "mouse" ||
          !matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        preview.open(company, event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse")
          preview.move(event.clientX, event.clientY);
      }}
      onPointerLeave={preview.close}
      onFocus={(event) => {
        if (!event.currentTarget.matches(":focus-visible")) return;
        const rect = event.currentTarget.getBoundingClientRect();
        preview.open(company, rect.left + rect.width / 2, rect.top, true);
      }}
      onBlur={preview.close}
      onClick={(event) => {
        if (!isPlainNavigation(event)) return;
        rememberProjectNavigation(event, true);
        preview.savePlayback(project.file);
        // Keep the shared visual mounted until the old snapshot is captured.
      }}
    >
      {company}
    </CompanyLink>
  );
}
