"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Animate progress bar from 0 → 100 over ~1.2s
    const start = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        // Short pause at 100% before hiding
        setTimeout(() => setVisible(false), 300);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #f8f5f0 0%, #ede8e0 50%, #f8f5f0 100%)",
          }}
        >
          {/* Decorative top accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #1d3461 0%, #8b1a2d 50%, #1d3461 100%)",
              transformOrigin: "left",
            }}
          />

          {/* Logo container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {/* Logo image */}
            <div
              style={{
                position: "relative",
                width: "min(380px, 80vw)",
                filter: "drop-shadow(0 8px 32px rgba(29, 52, 97, 0.18))",
              }}
            >
              <Image
                src="/logo-main.png"
                alt="Διδακτήριον"
                width={760}
                height={380}
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </div>

            {/* Progress bar track */}
            <div
              style={{
                width: "min(280px, 65vw)",
                height: "3px",
                borderRadius: "99px",
                background: "rgba(29, 52, 97, 0.12)",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: "99px",
                  background: "linear-gradient(90deg, #1d3461 0%, #8b1a2d 100%)",
                  width: `${progress}%`,
                }}
                transition={{ ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Decorative bottom accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #1d3461 0%, #8b1a2d 50%, #1d3461 100%)",
              transformOrigin: "right",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
