"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const EMAIL = "faisalmd543@gmail.com";

type Status = "idle" | "copied" | "failed";

export function CopyEmailButton() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-dark",
        status === "failed"
          ? "border-terracotta-dark text-terracotta-dark"
          : "border-espresso/20 text-espresso hover:border-terracotta-dark"
      )}
    >
      {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy email"}
      <span aria-live="polite" className="sr-only">
        {status === "copied"
          ? "Email address copied to clipboard"
          : status === "failed"
            ? "Copy failed. Use the email link instead."
            : ""}
      </span>
    </button>
  );
}
