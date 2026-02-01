"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const GridBackground = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create grid lines dynamically or animate existing ones
      // Here we assume CSS handles the basic grid, we animate the perspective/movement
      
      gsap.to(gridRef.current, {
        backgroundPosition: "0px 100px",
        ease: "none",
        duration: 2,
        repeat: -1
      });

    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
      {/* Perspective Container */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 243, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 243, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: "perspective(500px) rotateX(60deg) scale(2)",
          transformOrigin: "center top",
          boxShadow: "inset 0 0 100px 100px #000" // Vignette
        }}
      />
      
      {/* Floating Particles/Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black" />
      <div className="absolute w-[800px] h-[400px] bg-neon-blue/20 rounded-full blur-[100px] top-[-200px] left-1/2 -translate-x-1/2 animate-pulse" />
    </div>
  );
};

export default GridBackground;
