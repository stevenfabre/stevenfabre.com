"use client";

import Link from "next/link";
import { captureProjectTransition } from "../utils/projectTransition";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

type Transition = {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};
type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => Transition;
};
const Navigation = createContext<
  ((href: string, source?: HTMLElement | null) => boolean) | null
>(null);

export function SiteNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<{ destination: URL; finish: () => void } | null>(null);
  const active = useRef<Transition | null>(null);
  const sequence = useRef(0);
  const fallback = useRef<ReturnType<typeof captureProjectTransition> | null>(
    null
  );

  // A pathname can commit before a streamed route leaves its loading boundary.
  // Capture the destination only once its actual visual exists.
  useLayoutEffect(() => {
    const navigation = pending.current;
    if (!navigation || navigation.destination.pathname !== pathname) return;
    const { destination } = navigation;
    const settle = () => {
      if (pending.current !== navigation) return true;
      if (destination.pathname.startsWith("/work/")) {
        const project = document.querySelector<HTMLElement>(
          "[data-project-slug]"
        );
        if (project?.dataset.projectSlug !== destination.pathname.split("/")[2])
          return false;
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (destination.hash) {
        const target = document.getElementById(
          decodeURIComponent(destination.hash.slice(1))
        );
        if (!target) return false;
        target.scrollIntoView({ block: "nearest", behavior: "instant" });
      }
      navigation.finish();
      if (pending.current === navigation) pending.current = null;
      return true;
    };
    if (settle()) return;
    const observer = new MutationObserver(() => {
      if (settle()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(
    () => () => {
      pending.current?.finish();
      active.current?.skipTransition();
      fallback.current?.cancel();
    },
    []
  );

  const navigate = useCallback(
    (href: string, source?: HTMLElement | null) => {
      const doc = document as TransitionDocument;
      const destination = new URL(href, location.href);
      if (
        destination.origin !== location.origin ||
        destination.pathname === pathname ||
        (pathname.startsWith("/work/") &&
          destination.pathname.startsWith("/work/")) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return false;

      const request = ++sequence.current;
      active.current?.skipTransition();
      pending.current?.finish();
      fallback.current?.cancel();
      const update = () =>
        new Promise<void>((resolve) => {
          if (request !== sequence.current) {
            resolve();
            return;
          }
          // A failed or interrupted route must never leave a frozen snapshot up.
          const timeout = window.setTimeout(() => {
            if (request === sequence.current) pending.current = null;
            resolve();
          }, 2000);
          pending.current = {
            destination,
            finish: () => {
              window.clearTimeout(timeout);
              resolve();
            },
          };
          router.push(href, { scroll: false });
        });
      if (!doc.startViewTransition) {
        const animation = captureProjectTransition(source);
        fallback.current = animation;
        void update().then(() => {
          if (fallback.current === animation) animation.play();
        });
        return true;
      }
      const transition = doc.startViewTransition(update);
      active.current = transition;
      void transition.ready.catch(() => {});
      void transition.updateCallbackDone.catch(() => {});
      void transition.finished
        .catch(() => {})
        .then(() => {
          if (active.current === transition) active.current = null;
        });
      return true;
    },
    [pathname, router]
  );

  return <Navigation.Provider value={navigate}>{children}</Navigation.Provider>;
}

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const SiteLink = forwardRef<HTMLAnchorElement, SiteLinkProps>(
  function SiteLink({ href, onClick, ...props }, ref) {
    const navigate = useContext(Navigation);
    return (
      <Link
        {...props}
        ref={ref}
        href={href}
        scroll={false}
        onClick={(event) => {
          onClick?.(event);
          if (
            event.defaultPrevented ||
            event.detail === 0 ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            (props.target && props.target !== "_self") ||
            props.download != null
          )
            return;
          const source =
            event.currentTarget.closest<HTMLElement>("[data-work-visual]") ||
            document.querySelector<HTMLElement>(
              '[data-project-slug] [data-work-visual], [data-work-visual][style*="film-"]'
            );
          if (navigate?.(href, source)) event.preventDefault();
        }}
      />
    );
  }
);
