// components/WaterTracker/HydrationProgress.tsx
import { motion } from "framer-motion";

interface Props {
  currentMl: number;
  goalMl: number;
}

const HydrationProgress = ({ currentMl, goalMl }: Props) => {
  const percentage = Math.min((currentMl / goalMl) * 100, 120);

  return (
    <div className="relative w-56 h-56 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
      
      {/* Water fill */}
      <motion.div
        className="absolute bottom-0 w-full rounded-full overflow-hidden"
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(to top, rgba(56,189,248,.9), rgba(14,165,233,.9))"
        }}
      >
        {/* Water surface with wave animation */}
        <motion.div
          className="absolute top-0 w-[200%] h-6 opacity-20"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
          }}
        />
      </motion.div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          key={currentMl}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-primary-number text-foreground"
        >
          {currentMl} ml
        </motion.span>
        <span className="text-body-text text-muted-foreground">
          of {goalMl} ml
        </span>
      </div>
    </div>
  );
};

export { HydrationProgress };
export default HydrationProgress;