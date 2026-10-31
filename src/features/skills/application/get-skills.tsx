import type { SkillCatalog } from "../domain/skill";
import type { SkillRepository } from "../domain/skill-repository";

/** Preserve the editor's category and item order when building the catalog. */
export function getSkills(repository: SkillRepository): SkillCatalog {
  const groups = repository.read();
  const skillCategories = Object.keys(groups);
  const skills = skillCategories.flatMap((category) =>
    groups[category].map((skill) => ({ ...skill, category })),
  );

  return { skillCategories, skills };
}
