"use client";

import { useEffect, useRef, useState } from "react";

const HERO_IMAGE = "/frames/male0001.webp";

/** Clear the opening image's connected white backdrop, leaving the character. */
function cutOutOpeningImage(image: HTMLImageElement): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 0, 0);

  const frame = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = frame;
  const { width, height } = canvas;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const visit = (index: number) => {
    if (visited[index]) return;
    visited[index] = 1;
    const offset = index * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    if (Math.min(red, green, blue) < 225) return;
    if (Math.max(red, green, blue) - Math.min(red, green, blue) > 20) return;
    data[offset + 3] = 0;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x++) {
    visit(x);
    visit((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    visit(y * width);
    visit(y * width + width - 1);
  }
  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    if (x > 0) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < width * (height - 1)) visit(index + width);
  }

  context.putImageData(frame, 0, 0);
  return canvas;
}

/** Load only the current hero image; older animation frames are not displayed. */
export default function useHeroImage() {
  const image = useRef<HTMLCanvasElement | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null); // null = still probing

  useEffect(() => {
    let cancelled = false;
    const probe = new Image();
    probe.src = HERO_IMAGE;

    probe.onerror = () => {
      if (!cancelled) setAvailable(false);
    };

    probe.onload = () => {
      if (cancelled) return;
      image.current = cutOutOpeningImage(probe);
      setAvailable(image.current !== null);
    };

    return () => {
      cancelled = true;
      probe.onload = null;
      probe.onerror = null;
    };
  }, []);

  return { image, available };
}
