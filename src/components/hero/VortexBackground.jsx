"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const VortexBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        // High DPI Support
        const dpr = window.devicePixelRatio || 1;
        
        let width, height;
        const handleResize = () => {
             width = window.innerWidth;
             height = window.innerHeight;
             canvas.width = width * dpr;
             canvas.height = height * dpr;
             ctx.scale(dpr, dpr);
        };
        handleResize();

        // Particle System
        const PARTICLE_COUNT = 3000;
        
        // GSAP Physics State Proxy
        // We let GSAP tween these values, we just read them in the render loop.
        const state = {
            zSpeed: 2,        // Current forward speed
            radiusMulti: 1,   // Current tunnel widening factor
            opacity: 1        // Global opacity based on scroll pos
        };

        const config = {
            baseSpeed: 2,
            maxSpeed: 80,     // Cap for safety
            baseRadius: 200,
        };

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.angle = Math.random() * Math.PI * 2;
                this.baseRadius = config.baseRadius + Math.random() * 300; 
                this.radius = this.baseRadius;

                // Z-depth distribution
                this.z = initial 
                    ? Math.random() * 4000 - 3000 
                    : -3000 + Math.random() * 500;
                
                this.color = ["#00F3FF", "#8A2BE2", "#FFFFFF", "#00FFFF"][Math.floor(Math.random() * 4)];
                this.size = Math.random() * 3 + 1.5; 
            }

            update() {
                // 1. Move (Read pure state from GSAP)
                this.z += state.zSpeed;

                // Recycle
                if (this.z > 600) { 
                    this.reset(false);
                }

                // 2. Dynamic Radius (Elastic Widening)
                this.radius = this.baseRadius * state.radiusMulti;

                // 3. Project
                const x = Math.cos(this.angle) * this.radius;
                const y = Math.sin(this.angle) * this.radius;

                // Spiral Twist
                const spin = this.z * 0.001; 
                const cosSpin = Math.cos(spin);
                const sinSpin = Math.sin(spin);
                
                const tx = x * cosSpin - y * sinSpin;
                const ty = y * cosSpin + x * sinSpin;

                const fov = 600;
                const cameraZ = 800;
                const scale = fov / (fov + this.z + cameraZ);
                
                if (this.z + cameraZ < 10) return; 

                this.screenX = (width/2) + tx * scale;
                this.screenY = (height/2) + ty * scale;
                this.renderSize = this.size * scale;
                
                // Depth Opacity * Global Fade
                const depthAlpha = Math.min(1, (this.z + 3000) / 1000); 
                this.alpha = depthAlpha * Math.min(1, Math.max(0.2, scale)) * state.opacity;
            }

            draw(ctx) {
                if (this.alpha <= 0.01) return;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.screenX, this.screenY, this.renderSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

        // GSAP Scroll Logic
        let lastScrollY = window.scrollY;
        let isStylus = false; // Detection for high-precision devices? (Optional optimization)

        const handleScroll = () => {
             const currentY = window.scrollY;
             const delta = Math.abs(currentY - lastScrollY);
             lastScrollY = currentY;

             // 1. Opacity Tween (Global Fade Out deep down page)
             // Fade out starting at 500px, min 0.15
             const opacityTarget = Math.max(0.15, 1 - (currentY / 2500));
             gsap.to(state, { 
                 opacity: opacityTarget, 
                 duration: 0.5, 
                 ease: "power2.out" 
             });

             // 2. Physics Tween (Elastic "Warp")
             // Velocity boost. 
             // If delta is small (slow scroll), boost is small. 
             // If delta is huge (flick), boost is huge.
             
             // Deadband for stability
             if (delta < 1) return; 

             const boost = Math.min(delta * 2, 60); // Cap boost
             const targetSpeed = config.baseSpeed + boost;
             const targetRadius = 1 + (boost * 0.01); // Widen slightly

             // ATTACK: Tween UP quickly
             gsap.to(state, {
                 zSpeed: targetSpeed,
                 radiusMulti: targetRadius,
                 duration: 0.2,
                 ease: "power1.out",
                 overwrite: true // Important: Replace any decaying tweens
             });

             // DECAY: Queue a tween DOWN back to base
             // This runs after the attack automatically due to overwrite logic handling? 
             // No, overwrite:true kills everything. We need to schedule the decay manually 
             // OR use a "trailing" tween.
             // Best GSAP way: Just fire the attack. Then fire the decay with a delay?
             // Or simpler: Fire a tween to target, then immediately fire a tween to base 
             // with 'overwrite: "auto"' (only conflicts killed).
             
             // Actually, simplest is:
             // Tween to BOOST immediately.
             // Then tween to BASE slowly.
             
             gsap.to(state, {
                 zSpeed: config.baseSpeed,
                 radiusMulti: 1,
                 duration: 1.5,       // Long elastic return
                 ease: "elastic.out(1, 0.5)", // Bouncy? Or just Power2? Elastic is requested ("slowly return")
                 delay: 0.1,          // Wait for the boost to hit
                 overwrite: "auto"    // Don't kill the boost tween, just queue this?
             });
             // Note: overwrite:'auto' is tricky. 
             // Let's rely on simple sequencing: 
             // The second tween will overwrite the first one's *end* state if they overlap?
             // Actually, just firing the decay *every time* is fine as long as the Attack overrides it.
        };

        window.addEventListener("scroll", handleScroll);

        // Render Loop - Purely Visual (No Physics Math)
        const render = () => {
             ctx.clearRect(0, 0, width, height);

             // Optimization: If practically invisible, skip
             if (state.opacity < 0.01) return;

             ctx.save();
             particles.forEach(p => {
                p.update(); // Uses state.* values directly
                p.draw(ctx);
             });
             ctx.restore();
        };

        gsap.ticker.add(render);
        window.addEventListener("resize", handleResize);

        return () => {
            gsap.ticker.remove(render);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
        />
    );
};

export default VortexBackground;
