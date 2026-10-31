"use client";

import { useEffect, useRef } from "react";
import useHeroImage from "../hooks/useHeroImage";
import drawEarthMoonOrbit from "@/shared/lib/visuals/earth-moon-orbit";

interface HeroCanvasProps {
  className?: string;
}

/** Draw the current character image at a fixed position in the pinned hero. */
export default function HeroCanvas({ className = "" }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const render = useRef(() => {});
  const { image, available } = useHeroImage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    render.current = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      if (
        canvas.width !== Math.round(width * dpr) ||
        canvas.height !== Math.round(height * dpr)
      ) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      if (available === false) {
        drawEarthMoonOrbit(context, width, height, 0);
        return;
      }
      const source = image.current;
      if (!source) return;

      const portrait = width / height < 1.1;
      const targetHeight = height * (portrait ? 0.75 : 0.9);
      const baseScale = Math.min(
        width / source.width,
        targetHeight / source.height,
      );
      const imageWidth = source.width * baseScale;
      const imageHeight = source.height * baseScale;
      const x =
        (width - imageWidth) / 2 + (portrait ? 0 : Math.min(width * 0.05, 70));
      const y = height - imageHeight;
      context.drawImage(source, x, y, imageWidth, imageHeight);
      canvas.dataset.imageReady = "true";
    };

    render.current();
    window.addEventListener("resize", render.current);
    return () => window.removeEventListener("resize", render.current);
  }, [available, image]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="hero-image"
      aria-hidden="true"
      className={className}
    />
  );
}
