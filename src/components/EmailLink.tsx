"use client";

import Link from "next/link";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import copyStringToClipboard from "../utils/copyStringToClipboard";
import { Tooltip } from "./Tooltip";

enum FeedbackState {
  None,
  Success,
  Error,
}

export default function EmailLink({
  email,
  children,
  className,
}: {
  email: string;
  children: ReactNode;
  className?: string;
}) {
  const triggerRef = useRef(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();
  const [state, setState] = useState<FeedbackState>(FeedbackState.None);
  const [isOpen, setIsOpen] = useState(false);

  const content = useMemo(() => {
    if (state === FeedbackState.None) {
      return "Copy email to clipboard";
    }
    if (state === FeedbackState.Success) {
      return (
        <div className="flex items-center gap-1.5 -ml-1">
          <svg
            aria-hidden="true"
            focusable="false"
            className="fill-green-400"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
          >
            <path d="m13 24-9-9 1.414-1.414L13 21.171 26.586 7.586 28 9 13 24z" />
          </svg>
          Email copied
        </div>
      );
    }
    if (state === FeedbackState.Error) {
      return (
        <div className="flex items-center gap-1.5 -ml-1">
          <svg
            aria-hidden="true"
            focusable="false"
            className="fill-red-400"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 1C4.15 1 1 4.15 1 8s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7Zm-.55 3h1.1v5.5h-1.1V4ZM8 12.5c-.4 0-.75-.35-.75-.75S7.6 11 8 11s.75.35.75.75-.35.75-.75.75Z" />
          </svg>
          The email couldn’t be copied.
        </div>
      );
    }
  }, [state]);

  const handleClick = useCallback(async () => {
    const success = await copyStringToClipboard(email);
    setState(success ? FeedbackState.Success : FeedbackState.Error);
    setIsOpen(true);

    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setState(FeedbackState.None);
      setIsOpen(false);
    }, 2000);
  }, [email]);

  return (
    <Tooltip
      content={content}
      delayDuration={200}
      open={isOpen}
      onOpenChange={setIsOpen}
      onPointerDownOutside={(e) => {
        if (e.target === triggerRef.current) e.preventDefault();
      }}
    >
      <Link
        ref={triggerRef}
        className={className}
        href={`mailto:${email}`}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {children}
      </Link>
    </Tooltip>
  );
}
