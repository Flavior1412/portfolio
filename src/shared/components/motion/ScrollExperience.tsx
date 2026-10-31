"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { getAnchorScrollTop } from "@/shared/lib/anchor-scroll";

gsap.registerPlugin(ScrollTrigger);

export function ScrollExperience() {
  const reducedMotion = useReducedMotion();
  const restoredInitialHash = useRef(false);
  useEffect(() => {
    let disposed = false;
    let ready = false;
    let pendingNavigation = false;
    let frame: number | null = null;
    const initialHash = window.location.hash;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const lenis = reducedMotion
      ? null
      : new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const restoreAnchor = () => {
      if (!ready) {
        pendingNavigation = true;
        return;
      }
      if (frame !== null) cancelAnimationFrame(frame);
      const hash = window.location.hash;
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        // Measure after pin spacing has settled, then synchronize Lenis too.
        frame = requestAnimationFrame(() => {
          frame = null;
          restoredInitialHash.current = true;
          if (hash !== window.location.hash) return;
          const top = getAnchorScrollTop(hash) ?? 0;
          if (lenis) {
            lenis.resize();
            lenis.scrollTo(top, { immediate: true, force: true });
          } else {
            window.scrollTo({ top, behavior: "instant" });
          }
          ScrollTrigger.update();
        });
      });
    };

    let onLoad: (() => void) | undefined;
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else {
        onLoad = () => resolve();
        window.addEventListener("load", onLoad, { once: true });
      }
    });
    Promise.all([loaded, document.fonts?.ready]).then(() => {
      if (disposed) return;
      ready = true;
      ScrollTrigger.refresh();
      if (pendingNavigation || !restoredInitialHash.current) {
        if (pendingNavigation || initialHash === window.location.hash)
          restoreAnchor();
        else restoredInitialHash.current = true;
      }
    });
    window.addEventListener("hashchange", restoreAnchor);
    window.addEventListener("popstate", restoreAnchor);

    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      if (onLoad) window.removeEventListener("load", onLoad);
      window.removeEventListener("hashchange", restoreAnchor);
      window.removeEventListener("popstate", restoreAnchor);
      window.history.scrollRestoration = previousRestoration;
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, [reducedMotion]);
  return null;
}
