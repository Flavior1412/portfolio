"use client";

import Reveal from "@/shared/components/motion/Reveal";
import type { SkillCatalog } from "../../domain/skill";
import { Section } from "@/shared/components/ui/Section";
import content from "@/shared/data/content.json";

export function SkillsSection({ skillCategories, skills }: SkillCatalog) {
  return (
    <Section id="skills" variant="interactive">
      <div className="folio-container folio-section-space">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="folio-label folio-subtle">{content.skills.eyebrow}</p>
            <h2 className="mt-6 font-display text-3xl font-light md:text-4xl">
              {content.skills.heading}
            </h2>
          </div>
          <p className="folio-copy folio-muted max-w-md">
            {content.skills.description}
          </p>
        </Reveal>
        <Reveal
          className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.08}
        >
          {skillCategories.map((category) => (
            <div key={category}>
              <h3 className="folio-label folio-subtle">{category}</h3>
              <ul className="mt-4 space-y-3">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <li
                      key={skill.id}
                      className="font-display text-lg font-light leading-snug md:text-xl"
                    >
                      {skill.url ? (
                        <a
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 hover:opacity-70 focus-visible:outline focus-visible:outline-offset-4"
                        >
                          {skill.label}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      ) : (
                        skill.label
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
