"use client";

import Icon from "@/components/Icon";
import { ReactNode, useEffect, useRef, useState } from "react";
import copyStringToClipboard from "@/utils/copyStringToClipboard";
import { Tooltip } from "@/components/Tooltip";

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

  const content =
    state === FeedbackState.None ? (
      "Copy email to clipboard"
    ) : (
      <div className="flex items-center gap-1.5 -ml-1">
        <Icon
          name={state === FeedbackState.Success ? "check" : "error"}
          size={16}
          className={
            state === FeedbackState.Success ? "text-green-400" : "text-red-400"
          }
        />
        {state === FeedbackState.Success
          ? "Email copied"
          : "The email couldn’t be copied."}
      </div>
    );

  async function handleClick() {
    const success = await copyStringToClipboard(email);
    setState(success ? FeedbackState.Success : FeedbackState.Error);
    setIsOpen(true);

    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setState(FeedbackState.None);
      setIsOpen(false);
    }, 2000);
  }

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
      <a
        ref={triggerRef}
        className={className}
        href={`mailto:${email}`}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {children}
      </a>
    </Tooltip>
  );
}
