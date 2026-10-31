"use client";

import {
  createElement,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type JSX,
  type ReactNode,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealTag = Extract<
  keyof HTMLElementTagNameMap,
  keyof JSX.IntrinsicElements
>;

interface RevealOptions {
  children?: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  y?: number;
  start?: string;
}

export type RevealProps<Tag extends RevealTag = "div"> = RevealOptions & {
  as?: Tag;
} & Omit<ComponentPropsWithoutRef<Tag>, keyof RevealOptions | "as">;

/**
 * Fades its children up as they enter the viewport. Children are staggered when
 * `stagger` is set and the wrapper has more than one element child.
 */
export default function Reveal<Tag extends RevealTag = "div">({
  as,
  children,
  className = "",
  delay = 0,
  stagger = 0,
  y = 40,
  start = "top 85%",
  ...rest
}: RevealProps<Tag>) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.9,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, y, start]);

  return createElement(as ?? "div", { ref, className, ...rest }, children);
}
