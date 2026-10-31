import type { ProjectEntry } from "../domain/project";
import type { ProjectRepository } from "../domain/project-repository";

export function getProjects(
  repository: ProjectRepository,
): readonly ProjectEntry[] {
  return repository.read();
}
