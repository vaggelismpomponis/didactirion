"use client";

import * as React from "react";

const STORAGE_KEY = "didactirion-splash-seen";
const SPLASH_MS = 550;

export function LoadingScreen() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (reducedMotion || isMobile) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    }, SPLASH_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="loading-screen-overlay"
      aria-hidden="true"
      role="presentation"
    >
      <div className="loading-screen-logo">
        {/* Plain <img> avoids pulling in the next/image client chunk */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-main-v2.png"
          alt=""
          width={380}
          height={190}
          style={{ width: "100%", height: "auto" }}
          fetchPriority="low"
        />
      </div>
      <div className="loading-screen-progress" aria-hidden="true">
        <div className="loading-screen-progress-bar" />
      </div>
    </div>
  );
}
