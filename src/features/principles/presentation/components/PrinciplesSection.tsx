"use client";

import Reveal from "@/shared/components/motion/Reveal";
import { Section } from "@/shared/components/ui/Section";
import content from "@/shared/data/content.json";

export function PrinciplesSection() {
  return (
    <Section id="principles" variant="sticky">
      <div className="folio-container flex min-h-screen flex-col justify-center gap-16 py-24">
        <Reveal className="md:max-w-[55%]">
          <p className="folio-label text-ash">{content.principles.eyebrow}</p>
          <h2 className="mt-6 font-display text-[9vw] font-light leading-[1.25] md:text-[3.4vw]">
            <span className="block">{content.principles.heading.opening}</span>
            <span className="block">{content.principles.heading.middle}</span>
            <span className="block">{content.principles.heading.closing}</span>
          </h2>
        </Reveal>
        <Reveal className="self-end text-right md:max-w-[55%]" delay={0.1}>
          <h2 className="font-display text-[9vw] font-light leading-[1.25] md:text-[3.4vw]">
            <span className="block">{content.principles.focus.opening}</span>
            <span className="outline-type block font-medium">
              {content.principles.focus.middle}
            </span>
            <span className="block">{content.principles.focus.closing}</span>
          </h2>
          <p className="folio-label mt-6 text-ash">
            {content.principles.technologies}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
