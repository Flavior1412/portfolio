import type { ProjectRepository } from "../../domain/project-repository";
import content from "../data/projects.json";

export const jsonProjectRepository: ProjectRepository = {
  read: () => content,
};
