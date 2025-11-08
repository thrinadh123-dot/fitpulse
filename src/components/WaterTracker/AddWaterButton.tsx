import React, { useState } from "react";
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

interface AddWaterButtonProps {
  currentGlasses: number;
  goal: number;
  onClick: () => void;
}

export default function AddWaterButton({ currentGlasses, goal, onClick }: AddWaterButtonProps) {
  const [rippleKey, setRippleKey] = useState<number>(0);
  const progressRatio = goal > 0 ? currentGlasses / goal : 0;

  const handleClick = () => {
    setRippleKey(Date.now());
    onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={progressRatio > 0.75 ? { boxShadow: "0 0 20px rgba(34,197,94,0.5)" } : {}}
      className="relative px-6 py-3 rounded-full bg-green-500 text-black font-medium flex items-center gap-2 overflow-hidden"
      onClick={handleClick}
    >
      {/* Ripple */}
      <motion.div
        key={rippleKey}
        className="absolute inset-0 bg-green-400/40"
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: [0, 2], opacity: [0.8, 0] }}
        transition={{ duration: 0.4 }}
      />
      <Droplet className="h-5 w-5" />
      Add Water
    </motion.button>
  );
}


