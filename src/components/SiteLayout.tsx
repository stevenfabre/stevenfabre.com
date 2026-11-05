"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import GameProvider from "./Game/GameProvider";
import profilePic from "../../public/steven-fabre.jpg";

// This subtree belongs to the persistent layout, not either page. Memoization
// also avoids rebuilding the room's initial storage on a content navigation.
const Portrait = memo(function Portrait() {
  return (
    <div
      data-site-portrait
      className="select-none h-[64vh] fixed w-full top-0 md:top-auto md:w-auto md:h-auto md:col-span-1 md:relative overflow-hidden"
    >
      <div className="absolute top-0 -bottom-[10vh] inset-0 md:bottom-0">
        <Image
          className="object-cover"
          src={profilePic}
          alt="Picture of Steven Fabre"
          priority
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <GameProvider />
    </div>
  );
});

export default function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const content = useRef<HTMLDivElement>(null);
  const positions = useRef<Record<string, { pane: number; window: number }>>(
    {}
  );
  const hasPortrait = pathname === "/" || pathname === "/work";

  useLayoutEffect(() => {
    if (!hasPortrait || !content.current) return;
    const saved = history.state?.portfolioScroll;
    if (window.location.hash && saved?.pathname !== pathname) return;
    const previous =
      positions.current[pathname] ||
      (saved?.pathname === pathname ? saved : undefined);
    content.current.scrollTop = previous?.pane || 0;
    window.scrollTo({ top: previous?.window || 0, behavior: "instant" });
  }, [pathname, hasPortrait]);

  useEffect(() => {
    if (!hasPortrait) return;
    const rememberScroll = () => {
      positions.current[pathname] = {
        pane: content.current?.scrollTop || 0,
        window: window.scrollY,
      };
    };
    const pane = content.current;
    pane?.addEventListener("scroll", rememberScroll, { passive: true });
    window.addEventListener("scroll", rememberScroll, { passive: true });
    return () => {
      pane?.removeEventListener("scroll", rememberScroll);
      window.removeEventListener("scroll", rememberScroll);
    };
  }, [pathname, hasPortrait]);

  if (!hasPortrait) return <>{children}</>;

  return (
    <div className="md:grid md:grid-cols-4 md:h-screen">
      <Portrait />
      <div
        ref={content}
        data-site-content
        className="min-w-0 relative mt-[64vh] bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur md:backdrop-filter-none md:mt-0 md:col-span-3 md:flex md:justify-center md:overflow-y-scroll"
      >
        {children}
      </div>
    </div>
  );
}
