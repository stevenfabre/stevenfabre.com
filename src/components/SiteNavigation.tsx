"use client";

import Link from "next/link";
import {
  isPlainNavigation,
  rememberProjectHref,
} from "../utils/projectNavigation";
import {
  decodeVisibleImages,
  prepareProjectImages,
} from "../utils/transitionImages";
import { captureProjectTransition } from "../utils/projectTransition";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
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
type Navigate = (
  href: string,
  options?: { source?: HTMLElement | null; animate?: boolean }
) => boolean;
const Navigation = createContext<{
  navigate: Navigate;
  ready: (href: string) => void;
} | null>(null);

export function useSiteNavigation() {
  const context = useContext(Navigation);
  if (!context)
    throw new Error("Site navigation requires SiteNavigationProvider");
  return context.navigate;
}

// Render in page content, never in a loading boundary: a pathname alone does
// not tell us whether the streamed destination is ready for its snapshot.
export function RouteReady({ href }: { href: string }) {
  const context = useContext(Navigation);
  const ready = context?.ready;
  useLayoutEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) ready?.(href);
    });
    return () => {
      cancelled = true;
    };
  }, [href, ready]);
  return null;
}

export function SiteNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<{
    destination: URL;
    scroll?: { pane: number; window: number };
    finish: () => void;
  } | null>(null);
  const active = useRef<Transition | null>(null);
  const images = useRef<ReturnType<typeof prepareProjectImages> | null>(null);
  const sequence = useRef(0);
  const fallback = useRef<ReturnType<typeof captureProjectTransition> | null>(
    null
  );

  const ready = useCallback(async (href: string) => {
    const navigation = pending.current;
    if (!navigation) {
      // Initial deep links may target the independently scrolling overview pane.
      if (
        location.pathname === href &&
        location.hash &&
        history.state?.portfolioScroll?.pathname !== href
      ) {
        try {
          document
            .getElementById(decodeURIComponent(location.hash.slice(1)))
            ?.scrollIntoView({ block: "nearest", behavior: "instant" });
        } catch {
          /* Ignore malformed fragments. */
        }
      }
      return;
    }
    if (navigation.destination.pathname !== href) return;
    const { destination, scroll } = navigation;
    if (scroll) {
      const pane = document.querySelector<HTMLElement>("[data-site-content]");
      if (pane) pane.scrollTop = scroll.pane;
      window.scrollTo({ top: scroll.window, behavior: "instant" });
    }
    if (destination.hash) {
      try {
        const target = document.getElementById(
          decodeURIComponent(destination.hash.slice(1))
        );
        const bounds = target?.getBoundingClientRect();
        if (
          !scroll ||
          !bounds ||
          bounds.top < 0 ||
          bounds.bottom > innerHeight
        ) {
          target?.scrollIntoView({ block: "nearest", behavior: "instant" });
        }
      } catch {
        /* Ignore malformed fragments. */
      }
    } else if (destination.pathname.startsWith("/work/")) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    images.current?.selectDestination();
    fallback.current?.prepareDestination();
    if (images.current || fallback.current) await decodeVisibleImages();
    if (pending.current !== navigation) return;
    navigation.finish();
    pending.current = null;
  }, []);

  useEffect(
    () => () => {
      ++sequence.current;
      pending.current?.finish();
      active.current?.skipTransition();
      fallback.current?.cancel();
      images.current?.cancel();
    },
    []
  );

  const navigate = useCallback<Navigate>(
    (href, { source, animate = true } = {}) => {
      const doc = document as TransitionDocument;
      const destination = new URL(href, location.href);
      if (destination.origin !== location.origin) return false;
      const request = ++sequence.current;
      active.current?.skipTransition();
      pending.current?.finish();
      fallback.current?.cancel();
      active.current = null;
      pending.current = null;
      fallback.current = null;
      images.current?.cancel();
      images.current = null;
      rememberProjectHref(href);
      if (destination.pathname === pathname) {
        router.push(href);
        return true;
      }
      const shouldAnimate =
        animate &&
        !(
          pathname.startsWith("/work/") &&
          destination.pathname.startsWith("/work/")
        ) &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const savedScroll =
        pathname.startsWith("/work/") && destination.pathname === "/work"
          ? history.state?.portfolioReturn?.scroll
          : undefined;
      const scroll =
        savedScroll &&
        Number.isFinite(savedScroll.pane) &&
        Number.isFinite(savedScroll.window)
          ? {
              pane: Math.max(0, savedScroll.pane),
              window: Math.max(0, savedScroll.window),
            }
          : undefined;
      const update = () =>
        new Promise<void>((resolve) => {
          if (request !== sequence.current) {
            resolve();
            return;
          }
          // A failed or interrupted route must never leave a frozen snapshot up.
          const timeout = window.setTimeout(() => {
            if (request === sequence.current) {
              // Keep the destination pending so a slow route still restores
              // its scroll position when it eventually commits.
              active.current?.skipTransition();
              fallback.current?.cancel();
              fallback.current = null;
              images.current?.cancel();
              images.current = null;
            }
            resolve();
          }, 2000);
          pending.current = {
            destination,
            scroll,
            finish: () => {
              window.clearTimeout(timeout);
              resolve();
            },
          };
          router.push(href, { scroll: false });
        });
      if (!shouldAnimate) {
        void update();
        return true;
      }
      const projectChange =
        !!source &&
        ((pathname.startsWith("/work/") && destination.pathname === "/work") ||
          (pathname === "/work" && destination.pathname.startsWith("/work/")));
      const run = async () => {
        if (projectChange) await decodeVisibleImages();
        if (request !== sequence.current) return;
        const prepared = projectChange ? prepareProjectImages(source!) : null;
        images.current = prepared;
        const release = () => {
          if (images.current === prepared) {
            prepared?.cancel();
            images.current = null;
          }
        };
        if (!doc.startViewTransition) {
          const animation = captureProjectTransition(source);
          fallback.current = animation;
          await update();
          if (fallback.current === animation) await animation.play();
          release();
          return;
        }
        const transition = doc.startViewTransition(update);
        active.current = transition;
        void transition.ready.catch(() => {});
        void transition.updateCallbackDone.catch(() => {});
        void transition.finished
          .catch(() => {})
          .then(() => {
            if (active.current === transition) active.current = null;
            release();
          });
      };
      void run();
      return true;
    },
    [pathname, router]
  );

  const value = useMemo(() => ({ navigate, ready }), [navigate, ready]);
  return <Navigation.Provider value={value}>{children}</Navigation.Provider>;
}

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const SiteLink = forwardRef<HTMLAnchorElement, SiteLinkProps>(
  function SiteLink({ href, onClick, ...props }, ref) {
    const navigate = useSiteNavigation();
    return (
      <Link
        {...props}
        ref={ref}
        href={href}
        scroll={false}
        onClick={(event) => {
          onClick?.(event);
          if (!isPlainNavigation(event)) return;
          const source =
            event.currentTarget.closest<HTMLElement>("[data-work-visual]") ||
            document.querySelector<HTMLElement>(
              '[data-project-slug] [data-work-visual], [data-work-visual][style*="film-"]'
            );
          if (navigate(href, { source, animate: event.detail !== 0 }))
            event.preventDefault();
        }}
      />
    );
  }
);
