"use client";

import * as React from "react";
import Image from "next/image";

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
        <Image
          src="/logo-main.png"
          alt=""
          width={380}
          height={190}
          fetchPriority="low"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className="loading-screen-progress" aria-hidden="true">
        <div className="loading-screen-progress-bar" />
      </div>
    </div>
  );
}
