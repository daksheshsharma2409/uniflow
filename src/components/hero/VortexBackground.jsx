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

        // Configuration
        const PARTICLE_COUNT = 3000;
        
        // Physics State
        const scroll = { y: 0, target: 0 };
        const speed = { base: 2 }; // Flight speed through tunnel

        class Particle {
            constructor() {
                // Initialize in a deeply scattered tunnel
                this.reset(true);
            }

            reset(initial = false) {
                // Helix/Spiral Logic
                this.angle = Math.random() * Math.PI * 2;
                
                // Radius varies to create "wall" thickness
                this.radius = 200 + Math.random() * 300; 
                
                // Z-depth: -3000 (far) to 500 (close)
                // If initial, scatter everywhere. If reset, put at back.
                this.z = initial 
                    ? Math.random() * 4000 - 3000 
                    : -3000 + Math.random() * 500;
                
                this.x = Math.cos(this.angle) * this.radius;
                this.y = Math.sin(this.angle) * this.radius;

                // Color variations: Cyan to Blue to White
                const colors = ["#00F3FF", "#8A2BE2", "#FFFFFF", "#00FFFF"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 3 + 1.5; 
            }

            update(currentSpeed) {
                // 1. Move forward (Flight effect)
                this.z += currentSpeed;

                // Loop/Recycle
                if (this.z > 600) { // Passed camera
                    this.reset(false);
                }

                // 2. Rotate World (Spiral feel)
                // Rotate entire cylinder around Z axis for the "Vortex" spin
                const spin = this.z * 0.001; // Twist the tunnel
                const cosSpin = Math.cos(spin);
                const sinSpin = Math.sin(spin);
                
                let tx = this.x * cosSpin - this.y * sinSpin;
                let ty = this.y * cosSpin + this.x * sinSpin;

                // 3. No Mouse Rotation - Just fixed perspective
                let finalX = tx;
                let finalY = ty;
                
                // 4. Project to 2D
                const fov = 600;
                // Camera distance offset
                const cameraZ = 800;
                const scale = fov / (fov + this.z + cameraZ);
                
                if (this.z + cameraZ < 10) return; // Clipping

                this.screenX = (width/2) + finalX * scale;
                this.screenY = (height/2) + finalY * scale;
                this.renderSize = this.size * scale;
                
                // Opacity fade in from back (-3000) and fade out near front
                const depthAlpha = Math.min(1, (this.z + 3000) / 1000); 
                this.alpha = depthAlpha * Math.min(1, Math.max(0.2, scale));
            }

            draw(ctx) {
                if (this.alpha <= 0) return;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.screenX, this.screenY, this.renderSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

        // GSAP Ticker
        const render = () => {
             // Calculate Scroll Physics
             scroll.y += (scroll.target - scroll.y) * 0.1; // Smooth scroll
             
             // Warp Speed: Scroll increases speed
             const currentSpeed = speed.base + (scroll.y * 0.05);
             
             // Fade Out: Scroll decreases opacity
             // Fade roughly completely by 800px scroll
             const globalAlpha = Math.max(0, 1 - (scroll.y / 800));

             // Trail effect with scroll-based opacity
             ctx.fillStyle = `rgba(0, 0, 0, ${globalAlpha > 0 ? 1 : 1})`; // Keep black bg? Or fade it too? 
             // Actually, if we fade the canvas opacity, we don't need to do it here. 
             // But we need to clear the frame.
             ctx.fillStyle = "black";
             ctx.fillRect(0, 0, width, height);
             
             // If completely off screen/faded, skip drawing particles for performance
             if (globalAlpha < 0.01) return;

             ctx.save();
             ctx.globalAlpha = globalAlpha;

             particles.forEach(p => {
                p.update(currentSpeed);
                p.draw(ctx);
             });
             
             ctx.restore();
        };

        gsap.ticker.add(render);
        
        const handleScroll = () => {
             scroll.target = window.scrollY;
        };

        
        window.addEventListener("scroll", handleScroll);
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
            className="fixed inset-0 w-full h-full -z-10 bg-black pointer-events-none"
        />
    );
};

export default VortexBackground;
