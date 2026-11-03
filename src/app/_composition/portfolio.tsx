import { getProfile, jsonProfileRepository } from "@/features/profile/server";
import {
  getTimeline,
  jsonTimelineRepository,
} from "@/features/timeline/server";
import { getProjects, jsonProjectRepository } from "@/features/work/server";
import { getSkills, jsonSkillRepository } from "@/features/skills/server";
import { buildStructuredData } from "@/features/seo/server";
import content from "@/shared/data/content.json";
import { SITE_URL } from "./site";

/** Wire the static data adapters to application queries at the Next.js boundary. */
export function getPortfolio() {
  const profileContent = getProfile(jsonProfileRepository);
  const milestones = getTimeline(jsonTimelineRepository);
  const projects = getProjects(jsonProjectRepository);
  const skillCatalog = getSkills(jsonSkillRepository);

  return {
    ...profileContent,
    milestones,
    projects,
    ...skillCatalog,
    structuredData: buildStructuredData({
      siteUrl: SITE_URL,
      copy: {
        siteName: content.metadata.siteName,
        description: content.metadata.description,
        profilePageName: content.metadata.title,
        linkedinUrl: content.contact.linkedinHref,
        projectsName: content.metadata.projectsName,
        lastUpdated: content.metadata.lastUpdated,
      },
      profile: profileContent.profile,
      currentEmployer: profileContent.employment[0]?.company,
      almaMater: milestones[0]?.company,
      projects,
      skills: skillCatalog.skills,
    }),
  };
}
