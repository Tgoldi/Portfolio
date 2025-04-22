
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "../theme-provider";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

export default function Particles({
  className = "",
  quantity = 50,
  staticity = 30,
  ease = 50,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<Array<Particle>>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const { theme } = useTheme();

  const initializedRef = useRef(false);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }

    function initCanvas() {
      if (canvasContainerRef.current && canvasRef.current && context.current) {
        canvasRef.current.width = canvasContainerRef.current.offsetWidth;
        canvasRef.current.height = canvasContainerRef.current.offsetHeight;
      }
    }

    initCanvas();

    function onMouseMove(e: MouseEvent) {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const { w, h } = {
          w: canvasContainerRef.current.offsetWidth,
          h: canvasContainerRef.current.offsetHeight,
        };
        const x = e.clientX - rect.left - w / 2;
        const y = e.clientY - rect.top - h / 2;
        const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
        if (inside) {
          mouse.current.x = x;
          mouse.current.y = y;
        }
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const { w, h } = {
          w: canvasContainerRef.current.offsetWidth,
          h: canvasContainerRef.current.offsetHeight,
        };
        const x = e.touches[0].clientX - rect.left - w / 2;
        const y = e.touches[0].clientY - rect.top - h / 2;
        const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
        if (inside) {
          mouse.current.x = x;
          mouse.current.y = y;
        }
      }
    }

    function onMouseLeave() {
      mouse.current.x = 0;
      mouse.current.y = 0;
    }

    function resizeCanvas() {
      if (canvasContainerRef.current && canvasRef.current && context.current) {
        initCanvas();
        initParticles();
      }
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onMouseLeave);
    document.addEventListener("mouseleave", onMouseLeave);

    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseLeave);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [quantity, staticity, ease, refresh, theme]);

  function initParticles() {
    particles.current = [];
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;

      for (let i = 0; i < quantity; i++) {
        particles.current.push({
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          size: Math.random() * 2 + 1,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1,
          color: theme === "dark" ? "rgba(200, 200, 200, 0.5)" : "rgba(150, 50, 75, 0.3)",
        });
      }
    }
  }

  function animate() {
    if (context.current && canvasRef.current) {
      context.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      for (const particle of particles.current) {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce particles off edges
        if (canvasRef.current) {
          if (
            particle.x + particle.size > canvasRef.current.width / 2 ||
            particle.x - particle.size < -canvasRef.current.width / 2
          ) {
            particle.vx *= -1;
          }
          if (
            particle.y + particle.size > canvasRef.current.height / 2 ||
            particle.y - particle.size < -canvasRef.current.height / 2
          ) {
            particle.vy *= -1;
          }
        }

        // Apply mouse interaction
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const directionX = dx / distance || 0;
          const directionY = dy / distance || 0;
          particle.x -= directionX * force * staticity * 0.05;
          particle.y -= directionY * force * staticity * 0.05;
        }

        // Draw particle
        const translateX = canvasRef.current.width / 2 + particle.x;
        const translateY = canvasRef.current.height / 2 + particle.y;

        context.current.beginPath();
        context.current.arc(
          translateX,
          translateY,
          particle.size,
          0,
          Math.PI * 2
        );
        context.current.fillStyle = particle.color;
        context.current.fill();
      }
    }
    requestAnimationFrame(animate);
  }

  return (
    <div
      className={`fixed inset-0 -z-10 ${className}`}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
}
