import { BulletList } from "@/shared/components/ui/BulletList";
import { TagList } from "@/shared/components/ui/TagList";
import type { ProjectEntry } from "../../domain/project";
import styles from "./ProjectCard.module.css";
import content from "@/shared/data/content.json";
import { formatText } from "@/shared/lib/format-text";

interface ProjectCardProps {
  project: ProjectEntry;
  index: number;
}

function ProjectDetails({ project, index }: ProjectCardProps) {
  return (
    <div className="folio-container grid gap-8 py-10 lg:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.8fr)_minmax(0,0.7fr)] lg:gap-8 lg:py-14">
      <span className="folio-subtle font-display text-xs tracking-[0.25em]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-4xl font-light leading-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-5xl">
          {project.title}
          <span
            aria-hidden="true"
            className="ml-4 inline-block -translate-x-3 text-2xl opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-100 md:text-3xl"
          >
            {content.work.linkArrow}
          </span>
        </h3>
        <p className="folio-subtle mt-3 font-display text-[10px] uppercase tracking-[0.2em] transition-transform duration-700 group-hover:translate-x-3">
          {formatText(content.work.projectSummary, {
            company: project.company,
            role: project.role,
            dateLabel: project.dateLabel,
          })}
        </p>
      </div>
      <div className="min-w-0">
        <h4 className="folio-label folio-subtle mb-3">
          {content.work.description}
        </h4>
        <p className="folio-muted text-sm leading-relaxed">
          {project.description}
        </p>
        <h4 className="folio-label folio-subtle mb-4 mt-8">
          {content.work.responsibilities}
        </h4>
        <BulletList items={project.responsibilities} />
      </div>
      <div className="min-w-0">
        <h4 className="folio-label folio-subtle mb-4">
          {content.work.technologies}
        </h4>
        <div className="space-y-5">
          {project.technologyGroups.map((group) => (
            <div key={group.label}>
              <h5 className="folio-subtle font-display text-[10px] uppercase tracking-[0.15em]">
                {group.label}
              </h5>
              <TagList items={group.items} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Both layers share markup; the decorative wipe inherits its own color tokens. */
export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      id={`work-project-${project.id}`}
      aria-label={formatText(content.work.projectLabel, {
        title: project.title,
      })}
      className="border-t border-ink/10"
    >
      <a
        href={`#milestone-${project.id}`}
        className={`group ${styles.link}`}
        aria-label={formatText(content.work.projectLinkLabel, {
          title: project.title,
          company: project.company,
        })}
      >
        <ProjectDetails project={project} index={index} />
        <div aria-hidden="true" className={styles.overlay}>
          <ProjectDetails project={project} index={index} />
        </div>
      </a>
    </article>
  );
}
