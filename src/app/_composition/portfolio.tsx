import { getProfile, jsonProfileRepository } from "@/features/profile/server";
import {
  getTimeline,
  jsonTimelineRepository,
} from "@/features/timeline/server";
import { getProjects, jsonProjectRepository } from "@/features/work/server";
import { getSkills, jsonSkillRepository } from "@/features/skills/server";

/** Wire the static data adapters to application queries at the Next.js boundary. */
export function getPortfolio() {
  return {
    ...getProfile(jsonProfileRepository),
    milestones: getTimeline(jsonTimelineRepository),
    projects: getProjects(jsonProjectRepository),
    ...getSkills(jsonSkillRepository),
  };
}
