import React from "react";
import { motion } from "framer-motion";

interface HydrationProgressProps {
  currentGlasses: number;
  goal: number;
}

export default function HydrationProgress({ currentGlasses, goal }: HydrationProgressProps) {
  const percent = Math.min(100, Math.max(0, (currentGlasses / Math.max(1, goal)) * 100));

  return (
    <div className="relative flex flex-col items-center justify-center p-10 rounded-3xl overflow-hidden bg-gradient-to-t from-green-950/40 via-card to-transparent">
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.2),transparent_70%)] blur-3xl pointer-events-none" />

      <motion.div
        className="relative h-40 w-40 rounded-full border-4 border-green-500/30 overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Liquid fill */}
        <motion.div
          className="absolute bottom-0 w-full bg-green-500/60"
          style={{ height: `${percent}%` }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Ripple overlay */}
        <motion.div
          className="absolute bottom-0 w-full bg-green-400/20 blur-md"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold text-green-400">
            {currentGlasses}/{goal}
          </p>
          <p className="text-xs text-muted-foreground">glasses today</p>
        </div>
      </motion.div>
    </div>
  );
}


