import { BulletList } from "@/shared/components/ui/BulletList";
import { TagList } from "@/shared/components/ui/TagList";
import type { Milestone } from "../../domain/milestone";
import content from "@/shared/data/content.json";
import { formatText } from "@/shared/lib/format-text";

export function MilestoneCard({
  milestone,
  active = false,
}: {
  milestone: Milestone;
  active?: boolean;
}) {
  return (
    <article
      id={`milestone-${milestone.id}`}
      aria-label={formatText(content.timeline.milestoneLabel, {
        role: milestone.role,
        company: milestone.company,
      })}
      className={`group relative scroll-mt-28 rounded-2xl border bg-white/70 p-5 shadow-sm transition-colors duration-300 hover:shadow-lg sm:p-6 ${active ? "border-sky-300/80 shadow-sky-500/5" : "border-ink/10 hover:border-ink/20"}`}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <time
          className="text-xs font-semibold uppercase tracking-wider text-sky-700"
          dateTime={milestone.startDate || undefined}
        >
          {milestone.dateLabel}
        </time>
        {milestone.domain && (
          <span className="rounded-full border border-ink/10 bg-ink/[0.03] px-2.5 py-0.5 text-[10px] font-medium text-ash">
            {milestone.domain}
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-sky-700">
        {milestone.role}
      </h3>
      <p className="mb-4 mt-1 text-xs font-medium text-ash">
        {milestone.company}
      </p>
      <p className="text-sm leading-relaxed text-ash">
        {milestone.description}
      </p>
      {milestone.responsibilities && (
        <BulletList
          items={milestone.responsibilities}
          variant="compact"
          className="mt-4 border-t border-ink/5 pt-4"
        />
      )}
      {milestone.technologies && (
        <TagList
          items={milestone.technologies}
          variant="compact"
          className="mt-4"
        />
      )}
    </article>
  );
}
