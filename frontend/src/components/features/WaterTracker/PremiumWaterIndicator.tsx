// components/WaterTracker/PremiumWaterIndicator.tsx
"use client";

import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

interface PremiumWaterIndicatorProps {
  currentMl: number;
  goalMl: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const PremiumWaterIndicator = ({
  currentMl,
  goalMl,
  size = "md",
  className = "",
}: PremiumWaterIndicatorProps) => {
  // Convert to liters for display
  const displayLiters = (currentMl / 1000).toFixed(1);
  const goalLiters = (goalMl / 1000).toFixed(1);
  
  // Cap at 100% for visual indicator
  const fillPercentage = Math.min((currentMl / goalMl) * 100, 100);
  
  const sizeClasses = {
    sm: { 
      container: "w-32 h-32", 
      text: "text-3xl", 
      unit: "text-base", 
      subtitle: "text-xs",
      icon: "h-8 w-8" 
    },
    md: { 
      container: "w-40 h-40", 
      text: "text-4xl", 
      unit: "text-lg", 
      subtitle: "text-sm",
      icon: "h-10 w-10" 
    },
    lg: { 
      container: "w-56 h-56", 
      text: "text-5xl", 
      unit: "text-xl", 
      subtitle: "text-base",
      icon: "h-12 w-12" 
    },
    xl: { 
      container: "w-64 h-64", 
      text: "text-6xl", 
      unit: "text-2xl", 
      subtitle: "text-base",
      icon: "h-14 w-14" 
    },
  };
  
  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Main circular container */}
      <div 
        className={`
          ${currentSize.container}
          relative rounded-full
          bg-gradient-to-b
          from-slate-100
          to-slate-200
          border-8
          border-slate-300
          shadow-inner
          overflow-hidden
          flex items-center justify-center
        `}
        style={{
          boxShadow: `
            inset 0 4px 12px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.05)
          `,
        }}
      >
        {/* Water fill - Simple solid blue */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400"
          initial={{ height: "0%" }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
          style={{
            borderTopLeftRadius: "1000px",
            borderTopRightRadius: "1000px",
          }}
        >
          {/* Water surface - subtle wave effect */}
          <div 
            className="absolute top-0 left-0 right-0 h-4 opacity-30"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: "50%",
            }}
          />
        </motion.div>

        {/* Center content - Always visible above water */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Water droplet icon - subtle */}
          <div className="mb-3 opacity-80">
            <Droplet 
              className={currentSize.icon}
              style={{
                color: fillPercentage > 50 ? "#ffffff" : "#3b82f6",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          </div>
          
          {/* Main value */}
          <div className="text-center">
            <span
              className={`
                ${currentSize.text}
                font-bold
                text-slate-800
                tracking-tight
              `}
              style={{
                textShadow: fillPercentage > 50 
                  ? "0 1px 2px rgba(255,255,255,0.5)"
                  : "0 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              {displayLiters}
              <span
                className={`
                  ${currentSize.unit}
                  font-normal
                  ml-0.5
                  text-slate-600
                `}
                style={{
                  textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                }}
              >
                L
              </span>
            </span>
            
            {/* Subtle subtitle */}
            <div 
              className={`
                ${currentSize.subtitle}
                mt-1
                font-medium
                text-slate-500
                tracking-wide
                uppercase
              `}
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              Water Intake
            </div>
          </div>
        </div>
        
        {/* Glass rim effect */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none border-2 border-white/50"
          style={{
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6)",
          }}
        />
      </div>

      {/* Optional progress indicator around the circle */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `4px solid transparent`,
          borderTopColor: fillPercentage === 100 ? "#10b981" : "#3b82f6",
          borderRightColor: fillPercentage > 75 ? "#3b82f6" : "transparent",
          borderBottomColor: fillPercentage > 50 ? "#3b82f6" : "transparent",
          borderLeftColor: fillPercentage > 25 ? "#3b82f6" : "transparent",
          transform: "rotate(-45deg)",
          transition: "all 1s ease",
        }}
      />
    </div>
  );
};