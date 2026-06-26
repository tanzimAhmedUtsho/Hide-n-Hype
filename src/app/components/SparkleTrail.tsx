import { useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = ["#c8a84b", "#f0ebe0", "#e8d48a", "#ffffff", "#d4af60"];

export function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rotation: number) {
      const spikes = 4;
      const innerR = r * 0.4;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes + rotation;
        const radius = i % 2 === 0 ? r : innerR;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    function spawnParticles(x: number, y: number) {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        const maxLife = 40 + Math.random() * 30;
        particlesRef.current.push({
          id: idRef.current++,
          x,
          y,
          size: 3 + Math.random() * 5,
          opacity: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: maxLife,
          maxLife,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        p.life--;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.rotation += p.rotationSpeed;
        p.opacity = (p.life / p.maxLife) * 0.9;
        p.size *= 0.985;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        drawStar(ctx, p.x, p.y, p.size, p.rotation);
        ctx.fill();
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    let lastX = 0;
    let lastY = 0;
    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (dist > 6) {
        spawnParticles(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
