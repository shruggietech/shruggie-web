"use client";

import { useRef, useState, type HTMLAttributes } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyCodeBlock({
  children,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!ref.current) return;
    const text = ref.current.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative group">
      <pre
        ref={ref}
        className="my-6 min-h-[3.5rem] overflow-x-auto rounded-lg border border-border p-4 pr-12 text-body-sm [&>code]:bg-transparent [&>code]:p-0"
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-3 right-3 rounded-md border border-border bg-bg-secondary p-1.5 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}
