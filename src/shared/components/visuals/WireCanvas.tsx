"use client";

import { useEffect, useRef } from "react";

export type CanvasDraw = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  options: { sizeRatio?: number },
) => void;

export interface WireCanvasProps {
  draw: CanvasDraw;
  className?: string;
  sizeRatio?: number;
  speed?: number;
  still?: number;
}

/**
 * Hosts a drawing callback on a DPR-aware canvas.
 *
 * The mark turns on its own and picks up extra rotation from scroll, so it
 * reads as a live 3D object rather than a static graphic. The loop only runs
 * while the canvas is on screen, and reduced-motion gets a single still frame.
 */
export default function WireCanvas({
  draw,
  className = "",
  sizeRatio,
  speed = 0.02,
  still = 0.35,
}: WireCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let visible = false;

    const render = (progress: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (
        canvas.width !== Math.round(w * dpr) ||
        canvas.height !== Math.round(h * dpr)
      ) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, progress, sizeRatio === undefined ? {} : { sizeRatio });
    };

    // How far the canvas has travelled through the viewport, 0..1.
    const scrollOffset = () => {
      const rect = canvas.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      return span ? 1 - rect.bottom / span : 0;
    };

    if (reduced) {
      render(still);
      const onResize = () => render(still);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const loop = (time: number) => {
      render(time * 0.001 * speed + scrollOffset() * 0.9);
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === visible) return;
        visible = entry.isIntersecting;
        if (visible) raf = requestAnimationFrame(loop);
        else cancelAnimationFrame(raf);
      },
      { rootMargin: "100px" },
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [draw, sizeRatio, speed, still]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
