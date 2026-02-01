"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import GridBackground from "./GridBackground";
import gsap from "gsap";

import { useStore } from "@/context/StoreContext";

const HeroSection = () => {
  const { user } = useStore();
  const textRef = useRef(null);

  useEffect(() => {
    // Reveal Animation with proper cleanup
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(textRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, textRef); // Scope to textRef

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <GridBackground />
      
      <div ref={textRef} className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
          <Sparkles size={14} className="text-neon-orange" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">Student's Event Discovery Reimagined</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6">
          DISCOVER THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-primary to-accent">UNSEEN</span>
        </h1>

        <p className="max-w-xl text-lg md:text-xl text-white/50 mb-10 font-light">
          Stop missing out. UniFlow aggregates every hackathon, workshop, and cultural fest across campuses into one personalized feed.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href="#featured" onClick={(e) => {
            e.preventDefault();
            document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <GlassButton variant="neon" className="h-14 px-8 text-lg">
              Explore Events <ArrowRight />
            </GlassButton>
          </Link>
          {!user && (
            <Link href="/onboarding">
              <GlassButton variant="outline" className="h-14 px-8 text-lg">
                 Personalize Feed
              </GlassButton>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
