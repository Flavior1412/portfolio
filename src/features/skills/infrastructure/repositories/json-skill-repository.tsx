import type { SkillRepository } from "../../domain/skill-repository";
import content from "../data/skills.json";

export const jsonSkillRepository: SkillRepository = {
  read: () => content,
};
