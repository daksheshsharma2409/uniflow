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
        const scroll = { y: 0, target: 0, lastY: 0, speed: 0 };
        const speed = { base: 2 }; 

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.angle = Math.random() * Math.PI * 2;
                this.radius = 200 + Math.random() * 300; 
                this.z = initial 
                    ? Math.random() * 4000 - 3000 
                    : -3000 + Math.random() * 500;
                
                this.x = Math.cos(this.angle) * this.radius;
                this.y = Math.sin(this.angle) * this.radius;

                const colors = ["#00F3FF", "#8A2BE2", "#FFFFFF", "#00FFFF"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 3 + 1.5; 
            }

            update(currentSpeed) {
                this.z += currentSpeed;

                if (this.z > 600) { 
                    this.reset(false);
                }

                const spin = this.z * 0.001; 
                const cosSpin = Math.cos(spin);
                const sinSpin = Math.sin(spin);
                
                let tx = this.x * cosSpin - this.y * sinSpin;
                let ty = this.y * cosSpin + this.x * sinSpin;

                let finalX = tx;
                let finalY = ty;
                
                const fov = 600;
                const cameraZ = 800;
                const scale = fov / (fov + this.z + cameraZ);
                
                if (this.z + cameraZ < 10) return; 

                this.screenX = (width/2) + finalX * scale;
                this.screenY = (height/2) + finalY * scale;
                this.renderSize = this.size * scale;
                
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
             // Calculate Scroll Velocity
             // Smooth scroll target
             scroll.y += (scroll.target - scroll.y) * 0.1; 
             
             // Calculate velocity (difference between frames)
             const velocity = Math.abs(scroll.y - scroll.lastY);
             scroll.lastY = scroll.y;
             
             // Smooth velocity dampening
             scroll.speed += (velocity - scroll.speed) * 0.1;

             // Warp Speed: Based on SCROLL VELOCITY now
             // base speed + (scroll speed * multiplier)
             const currentSpeed = speed.base + (scroll.speed * 1.5);
             
             // Clear with transparency
             ctx.clearRect(0, 0, width, height);
             // Optional: Dark trail if needed, but 'clearRect' is cleaner for overlay
             // ctx.fillStyle = "rgba(0,0,0,0.1)"; 
             // ctx.fillRect(0,0,width,height); 
             // If we want trails, we can't fully clear. 
             // But if we want it to be an overlay, we must have transparency.
             // Compromise: No trails implies 'cleaner' look. Trails imply speed.
             // Let's use clean clearRect for now to ensure transparency works as requested.

             ctx.save();
             // Render all particles
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
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
        />
    );
};

export default VortexBackground;
