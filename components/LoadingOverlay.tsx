"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  show: boolean;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

function LoadingOverlay({
  show,
  title = "Processing…",
  className,
  children,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className={cn("loading-wrapper", className)} aria-hidden={!show}>
      <div className="loading-shadow-wrapper bg-(--bg-secondary) shadow-soft-lg">
        <div className="loading-shadow">
          <div
            className="loading-animation size-12 border-2 border-(--accent-warm) border-t-transparent rounded-full"
            role="status"
            aria-label="Loading"
          />
          <p className="loading-title">{title}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export { LoadingOverlay };
