"use client";

import Reveal from "@/shared/components/motion/Reveal";
import { Section } from "@/shared/components/ui/Section";
import content from "@/shared/data/content.json";
import { formatText } from "@/shared/lib/format-text";

interface AboutSectionProps {
  profile: { name: string; summary: string };
  employment: readonly { role: string; company: string; dates: string }[];
}

export function AboutSection({ profile, employment }: AboutSectionProps) {
  return (
    <Section id="about">
      <div className="folio-container folio-section-space flex min-h-screen flex-col justify-center gap-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
          <Reveal>
            <p className="folio-label text-ash">
              {formatText(content.about.eyebrow, {
                name: profile.name.toUpperCase(),
              })}
            </p>
            <h2 className="mt-6 font-display text-[11vw] font-light leading-[1.1] md:text-[4.2vw]">
              <span className="block">{content.about.heading.opening}</span>
              <span className="block font-bold">
                {content.about.heading.middle}
              </span>
              <span className="block">{content.about.heading.closing}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="folio-copy whitespace-pre-line text-ash">
              {profile.summary}
            </p>
            <p className="folio-label mt-6 text-ink">
              {content.about.certifications}
            </p>
          </Reveal>
        </div>
        <Reveal
          className="grid gap-8 border-t border-ink/10 pt-8 md:grid-cols-3"
          stagger={0.08}
        >
          {content.about.metrics.map((metric) => (
            <div key={metric.label}>
              <p className="folio-label text-ash">{metric.label}</p>
              <p className="mt-2 font-display text-2xl font-light md:text-3xl">
                {metric.value}
              </p>
            </div>
          ))}
        </Reveal>
        <Reveal className="border-t border-ink/10 pt-8">
          <h3 className="folio-label mb-4 text-ash">
            {content.about.employment}
          </h3>
          <ol className="grid gap-6 md:grid-cols-3">
            {employment.map((job) => (
              <li key={`${job.company}-${job.dates}`}>
                <p className="font-display text-lg text-ink">{job.role}</p>
                <p className="mt-1 text-sm text-ash">{job.company}</p>
                <p className="mt-2 font-display text-xs text-ash">
                  {job.dates}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
