"use client";

import Icon from "./Icon";
import Link from "next/link";
import {
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
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
  useEffect(() => () => clearTimeout(timeoutIdRef.current), []);
  const [state, setState] = useState<FeedbackState>(FeedbackState.None);
  const [isOpen, setIsOpen] = useState(false);

  const content = useMemo(() => {
    if (state === FeedbackState.None) {
      return "Copy email to clipboard";
    }
    if (state === FeedbackState.Success) {
      return (
        <div className="flex items-center gap-1.5 -ml-1">
          <Icon name="check" size={16} className="text-green-400" />
          Email copied
        </div>
      );
    }
    if (state === FeedbackState.Error) {
      return (
        <div className="flex items-center gap-1.5 -ml-1">
          <Icon name="error" size={16} className="text-red-400" />
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
