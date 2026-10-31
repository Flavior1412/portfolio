import { useState, useEffect } from "react";

/**
 * Returns true when the OS/browser has prefers-reduced-motion: reduce.
 * Listens for live changes so the UI responds if the user toggles the setting.
 */
export function useReducedMotion(): boolean {
  // Start static during SSR/hydration until the browser preference is known.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
