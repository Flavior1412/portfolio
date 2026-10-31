import type { ProjectEntry } from "./project";

export interface ProjectRepository {
  read(): readonly ProjectEntry[];
}
