/** Category names are editorial content, independent of the storage format. */
export type SkillCategory = string;

export interface Skill {
  readonly id: string;
  readonly label: string;
  readonly category: SkillCategory;
}

export type SkillGroups = Readonly<
  Record<SkillCategory, readonly Pick<Skill, "id" | "label">[]>
>;

export interface SkillCatalog {
  readonly skillCategories: readonly SkillCategory[];
  readonly skills: readonly Skill[];
}
