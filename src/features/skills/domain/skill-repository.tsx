import type { SkillGroups } from "./skill";

export interface SkillRepository {
  read(): SkillGroups;
}
