"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const GlassButton = ({ 
  children, 
  className, 
  variant = "primary", 
  onClick,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  ...props 
}) => {

  const getVariantClasses = () => {
    switch(variant) {
      case "neon":
        return "bg-black border border-neon-blue/50 text-neon-blue hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]";
      case "outline":
        return "bg-transparent border border-white/20 text-white hover:border-white hover:bg-white/10";
      case "ghost":
        return "bg-transparent text-white/60 hover:text-white hover:bg-white/5";
      case "primary":
      default:
        return "bg-surface-highlight border border-white/10 text-white hover:bg-white/10 hover:border-white/30";
    }
  };

  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      className={cn(
        "relative px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-colors duration-300 flex items-center justify-center gap-2",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GlassButton;
