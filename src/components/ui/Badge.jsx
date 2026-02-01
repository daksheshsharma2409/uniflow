import React from "react";
import { cn } from "@/lib/utils";

const Badge = ({ children, className, active = false }) => {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300",
        active 
          ? "bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]"
          : "bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white/80",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
