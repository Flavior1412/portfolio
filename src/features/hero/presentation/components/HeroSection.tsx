"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeroCanvas from "./HeroCanvas";
import { HeroMarquee } from "./HeroMarquee";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import content from "@/shared/data/content.json";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  profile: { headline: string; summary: string; location: string };
  heroCaptions: readonly { at: number; text: string }[];
}

export function HeroSection({ profile, heroCaptions }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLAnchorElement>(null);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 0.15,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      timeline
        .to(
          introRef.current,
          { autoAlpha: 0, y: -40, ease: "none", duration: 0.12 },
          0,
        )
        .to(hintRef.current, { autoAlpha: 0, ease: "none", duration: 0.04 }, 0);
      heroCaptions.forEach((caption, index) => {
        const element = captionRefs.current[index];
        if (!element) return;
        timeline
          .fromTo(
            element,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, ease: "none", duration: 0.08 },
            caption.at,
          )
          .to(
            element,
            { autoAlpha: 0, y: -24, ease: "none", duration: 0.08 },
            caption.at + 0.16,
          );
      });
    }, sectionRef);
    return () => context.revert();
  }, [heroCaptions, reducedMotion]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate h-screen w-full overflow-hidden bg-bone"
    >
      <h1 className="sr-only">{profile.headline}</h1>
      <div className="absolute inset-x-0 top-[13%] z-0 md:top-[9%]">
        <HeroMarquee />
      </div>
      <HeroCanvas className="pointer-events-none absolute inset-0 z-10 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-16 bg-gradient-to-t from-bone via-bone/75 to-transparent md:h-28"
      />
      <div
        ref={introRef}
        className="absolute left-6 top-[24%] z-20 max-w-[19rem] md:left-[6%] md:top-[52%] md:max-w-sm"
      >
        <p className="font-display text-sm leading-relaxed text-ash md:text-base">
          {profile.summary}
        </p>
        <p className="mt-4 font-display text-xs uppercase tracking-[0.2em] text-ink">
          {profile.location}
        </p>
        <div className="mt-5 flex gap-6 font-display text-[10px] uppercase tracking-[0.15em]">
          <a
            href="#timeline"
            className="underline underline-offset-4 transition-opacity hover:opacity-50"
          >
            {content.hero.timeline}
          </a>
          <a
            href="#contact"
            className="underline underline-offset-4 transition-opacity hover:opacity-50"
          >
            {content.hero.contact}
          </a>
        </div>
      </div>
      <a
        href="#principles"
        ref={hintRef}
        className="absolute bottom-10 left-6 z-20 font-display text-xs tracking-[0.3em] text-ink md:left-[6%]"
      >
        {content.hero.scrollHint}
      </a>
      <div className="pointer-events-none absolute left-6 top-[68%] z-[5] w-[30%] max-w-sm text-center md:left-[6%] md:top-[52%]">
        {heroCaptions.map((caption, index) => (
          <p
            key={caption.text}
            ref={(element) => {
              captionRefs.current[index] = element;
            }}
            className="absolute left-0 top-0 w-full font-display text-xs leading-relaxed tracking-[0.18em] text-ink opacity-0 md:text-sm md:tracking-[0.25em]"
          >
            {caption.text}
          </p>
        ))}
      </div>
    </section>
  );
}
