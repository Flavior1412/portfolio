"use client";

import { useRef, useState } from "react";
import { useScrollProgress } from "@/shared/hooks/useScrollProgress";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { MilestoneCard } from "./MilestoneCard";
import { CharacterJourney } from "./CharacterJourney";
import type { Milestone } from "../../domain/milestone";
import { Section } from "@/shared/components/ui/Section";
import styles from "./TimelineSection.module.css";
import content from "@/shared/data/content.json";

/** The original zigzag journey, using the portfolio's current type system. */
export function TimelineSection({
  milestones,
}: {
  milestones: readonly Milestone[];
}) {
  const trailRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(trailRef);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Section
      id="timeline"
      aria-labelledby="timeline-title"
      className="overflow-x-clip"
    >
      <div className="folio-container folio-section-space">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="folio-label text-ash">{content.timeline.eyebrow}</p>
            <h2
              id="timeline-title"
              className="mt-6 font-display text-3xl font-light tracking-tight text-ink sm:text-4xl"
            >
              {content.timeline.heading}
            </h2>
            <p className="folio-copy mt-4 text-ash">
              {content.timeline.description}
            </p>
          </div>
          <p className="font-display text-xs text-ash">
            {content.timeline.dateRange}{" "}
            <span className="mx-2 text-ink/20">
              {content.timeline.separator}
            </span>{" "}
            {content.timeline.scrollHint}
          </p>
        </div>

        <div
          ref={trailRef}
          data-testid="timeline-route"
          className="relative mx-auto max-w-6xl pb-20 pt-40"
        >
          <CharacterJourney
            progress={progress}
            reducedMotion={reducedMotion}
            juniorStartIndex={milestones.findIndex(
              (milestone) => milestone.id === 1,
            )}
            middleStartIndex={milestones.findIndex(
              (milestone) => milestone.id === 2,
            )}
            seniorStartIndex={milestones.findIndex(
              (milestone) => milestone.id === 3,
            )}
            containerRef={trailRef}
            onActiveChange={setActiveIndex}
          />
          <ol
            aria-label={content.timeline.listLabel}
            className="relative flex flex-col gap-28 min-[768px]:gap-44"
          >
            {milestones.map((milestone, index) => (
              <li
                key={milestone.id}
                className={`${styles.stop} relative`}
                aria-current={index === activeIndex ? "step" : undefined}
              >
                <div data-journey-card className={styles.card}>
                  <MilestoneCard
                    milestone={milestone}
                    active={index === activeIndex}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
