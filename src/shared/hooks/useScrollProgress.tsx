import { useState, useEffect, useRef, RefObject } from "react";

/** Maps document scroll through a section to [0, 1], including viewport resizes. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const top = element.getBoundingClientRect().top;
        const scrollRange = element.offsetHeight - window.innerHeight;
        const raw = scrollRange > 0 ? -top / scrollRange : top <= 0 ? 1 : 0;
        setProgress(Math.max(0, Math.min(1, raw)));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [ref]);

  return progress;
}
