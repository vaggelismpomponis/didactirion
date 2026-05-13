"use client";

import { motion } from "framer-motion";

export function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up",
  className
}: { 
  children: React.ReactNode, 
  delay?: number,
  direction?: "up" | "down" | "left" | "right",
  className?: string
}) {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
    >
      {children}
    </motion.div>
  );
}
