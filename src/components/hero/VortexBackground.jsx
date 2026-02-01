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
        const rotation = { x: 0, y: 0 };
        const mouse = { x: 0, y: 0 };
        const speed = { base: 2, current: 2 }; // Flight speed through tunnel

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

            update(rotX, rotY) {
                // 1. Move forward (Flight effect)
                this.z += speed.current;

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

                // 3. Apply Mouse Rotation (Look around)
                // Rotate around Y
                let finalX = tx * Math.cos(rotY) - this.z * Math.sin(rotY);
                let z1 = this.z * Math.cos(rotY) + tx * Math.sin(rotY);
                
                // Rotate around X
                let finalY = ty * Math.cos(rotX) - z1 * Math.sin(rotX);
                let z2 = z1 * Math.cos(rotX) + ty * Math.sin(rotX);
                
                // 4. Project to 2D
                const fov = 600;
                // Camera distance offset
                const cameraZ = 800;
                const scale = fov / (fov + z2 + cameraZ);
                
                if (z2 + cameraZ < 10) return; // Clipping

                this.screenX = (width/2) + finalX * scale;
                this.screenY = (height/2) + finalY * scale;
                this.renderSize = this.size * scale;
                
                // Opacity fade in from back (-3000) and fade out near front
                // Map z from -3000...500 to 0...1...0 logic
                const depthAlpha = Math.min(1, (z2 + 3000) / 1000); 
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
             // Trail effect
             ctx.fillStyle = "black";
             ctx.fillRect(0, 0, width, height);
             
             // Mouse rotation dampening
            const targetRotX = mouse.y * 1.0; 
            const targetRotY = mouse.x * 1.0;
            
            rotation.x += (targetRotX - rotation.x) * 0.05;
            rotation.y += (targetRotY - rotation.y) * 0.05;

            // Accelerate on interaction?
            // speed.current = 5 + Math.abs(mouse.x * 10); 
            // Keep steady for now

            particles.forEach(p => {
                p.update(rotation.x, rotation.y);
                p.draw(ctx);
            });
        };

        gsap.ticker.add(render);

        const handleMouseMove = (e) => {
            mouse.x = (e.clientX / width - 0.5) * 2;
            mouse.y = (e.clientY / height - 0.5) * 2;
        };
        
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        return () => {
            gsap.ticker.remove(render);
            window.removeEventListener("mousemove", handleMouseMove);
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
