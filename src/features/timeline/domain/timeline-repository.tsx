import type { Milestone } from "./milestone";

export interface TimelineRepository {
  read(): readonly Milestone[];
}
