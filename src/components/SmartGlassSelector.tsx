import React, { useState } from "react";
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

type GlassSize = "small" | "regular" | "large" | "bottle";

interface SmartGlassSelectorProps {
  onSelect: (size: GlassSize, volume: number) => void;
  defaultSize?: GlassSize;
}

const glassOptions: Array<{ size: GlassSize; label: string; volume: number }> = [
  { size: "small", label: "Small Glass", volume: 200 },
  { size: "regular", label: "Regular Glass", volume: 250 },
  { size: "large", label: "Large Glass", volume: 350 },
  { size: "bottle", label: "Bottle", volume: 500 },
];

export default function SmartGlassSelector({ onSelect, defaultSize = "regular" }: SmartGlassSelectorProps) {
  const [selected, setSelected] = useState<GlassSize>(defaultSize);

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {glassOptions.map((glass) => {
        const isSelected = selected === glass.size;

        return (
          <motion.div
            key={glass.size}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => {
              setSelected(glass.size);
              onSelect(glass.size, glass.volume);
            }}
            className={`relative flex flex-col items-center justify-center w-32 p-4 rounded-xl cursor-pointer transition-all duration-300 bg-card text-foreground ${
              isSelected
                ? "border-2 border-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                : "border border-border hover:border-green-500/40"
            }`}
          >
            {/* Ripple pulse when selected */}
            {isSelected && (
              <motion.span
                layoutId="glassRipple"
                className="pointer-events-none absolute inset-0 rounded-xl"
                initial={{ boxShadow: "0 0 0 0 rgba(34,197,94,0.0)" }}
                animate={{ boxShadow: [
                  "0 0 0 0 rgba(34,197,94,0.0)",
                  "0 0 20px 4px rgba(34,197,94,0.15)",
                  "0 0 0 0 rgba(34,197,94,0.0)"
                ] }}
                transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
              />
            )}

            <div className="relative h-10 w-10 mb-2">
              {/* Water fill */}
              <motion.div
                className="absolute bottom-0 left-0 w-full bg-green-500/60 rounded-b-lg"
                initial={{ height: "0%" }}
                whileHover={{ height: "70%" }}
                animate={isSelected ? { height: "70%" } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
              <Droplet className="absolute top-0 left-0 h-10 w-10 text-green-400" />
            </div>

            <p className="text-sm font-medium text-center">{glass.label}</p>
            <p className="text-xs text-muted-foreground">{glass.volume}ml</p>
          </motion.div>
        );
      })}
    </div>
  );
}


