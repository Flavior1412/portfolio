"use client";

import Reveal from "@/shared/components/motion/Reveal";
import WireCanvas from "@/shared/components/visuals/WireCanvas";
import drawEarthMoonOrbit from "@/shared/lib/visuals/earth-moon-orbit";
import type { ProjectEntry } from "../../domain/project";
import { Section } from "@/shared/components/ui/Section";
import { ProjectCard } from "./ProjectCard";
import content from "@/shared/data/content.json";

export function WorkSection({
  projects,
}: {
  projects: readonly ProjectEntry[];
}) {
  return (
    <Section id="work" aria-labelledby="work-title">
      <div className="folio-container relative flex min-h-screen flex-col justify-center py-28">
        <WireCanvas
          draw={drawEarthMoonOrbit}
          sizeRatio={0.24}
          className="pointer-events-none absolute left-10 top-1/2 hidden aspect-square w-[46%] max-w-[560px] -translate-y-1/2 md:block"
        />
        <Reveal className="relative self-end text-right">
          <p className="folio-label text-ash">{content.work.eyebrow}</p>
          <h2
            id="work-title"
            className="mt-6 font-display text-[13vw] font-light leading-[1.05] md:text-[5vw]"
          >
            <span className="block">{content.work.heading.opening}</span>
            <span className="outline-type block font-medium">
              {content.work.heading.middle}
            </span>
            <span className="block">{content.work.heading.closing}</span>
          </h2>
        </Reveal>
      </div>
      <div className="border-b border-ink/10">
        {projects.map((project, index) => (
          <Reveal key={project.id} y={24}>
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
