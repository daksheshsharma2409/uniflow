"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const GlassCard = ({ children, className, hoverEffect = true }) => {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (!hoverEffect) return;
    gsap.to(cardRef.current, {
      y: -5,
      scale: 1.01,
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      borderColor: "rgba(255,255,255,0.2)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!hoverEffect) return;
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      borderColor: "rgba(255,255,255,0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-surface/40 backdrop-blur-xl border border-white/10 shadow-lg text-white transition-colors",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </div>
  );
};

export default GlassCard;
