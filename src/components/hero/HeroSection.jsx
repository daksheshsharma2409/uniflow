"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import GlassButton from "@/components/ui/GlassButton";
import VortexBackground from "./VortexBackground";
import { useStore } from "@/context/StoreContext";

const HeroSection = () => {
  const { user } = useStore();
  const containerRef = useRef(null);

  // Mouse Parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 40, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 40, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    }
  };

  const textVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  return (
    <section 
        className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        ref={containerRef}
    >
      <VortexBackground />
      
      {/* Reduced blur, let the fine particles shine through clearly */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center"
        initial="hidden"
        animate="visible"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        variants={containerVariants}
      >
        
        {/* Badge */}
        <motion.div variants={textVariants} className="mb-8 transform-style-3d translate-z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                <Sparkles size={14} className="text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                    Flow State Activated
                </span>
            </div>
        </motion.div>

        {/* Main Heading */}
        <div className="mb-10 relative flex flex-col items-center transform-style-3d translate-z-20">
            <motion.h1 variants={textVariants} className="text-5xl md:text-8xl font-medium text-white tracking-tight mb-2 leading-[1.1] drop-shadow-2xl">
                DISCOVER THE
            </motion.h1>
            <motion.h1 variants={textVariants} className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter leading-[0.9] drop-shadow-lg">
                UNSEEN
            </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p variants={textVariants} className="max-w-xl text-lg md:text-xl text-white/80 mb-14 font-light leading-relaxed transform-style-3d translate-z-10 drop-shadow-md">
          UniFlow aggregates every <span className="text-white font-medium border-b border-white/30">hackathon</span>, <span className="text-white font-medium border-b border-white/30">workshop</span>, and <span className="text-white font-medium border-b border-white/30">fest</span> into a seamless digital vortex.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={textVariants} className="flex flex-col md:flex-row gap-6 transform-style-3d translate-z-30">
          <Link href="#featured" onClick={(e) => {
            e.preventDefault();
            document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
          }}>
             <GlassButton variant="primary" className="h-16 px-12 text-lg font-bold bg-white text-black hover:bg-white/90 border-0 shadow-[0_0_40px_rgba(0,243,255,0.3)] hover:shadow-[0_0_60px_rgba(0,243,255,0.5)] hover:scale-105 transition-all">
                Explore Events <ArrowRight className="ml-2 w-5 h-5" />
            </GlassButton>
          </Link>
          
          {!user && (
            <Link href="/onboarding">
                <GlassButton variant="outline" className="h-16 px-10 text-lg border-white/20 bg-black/20 hover:bg-white/10 text-white hover:text-white backdrop-blur-md">
                    Personalize Feed
                </GlassButton>
            </Link>
          )}
        </motion.div>
      </motion.div>
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_30%,_black_100%)] z-0 opacity-80" />

    </section>
  );
};

export default HeroSection;
