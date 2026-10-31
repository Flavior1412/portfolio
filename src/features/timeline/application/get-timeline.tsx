import type { Milestone } from "../domain/milestone";
import type { TimelineRepository } from "../domain/timeline-repository";

export function getTimeline(
  repository: TimelineRepository,
): readonly Milestone[] {
  return repository.read();
}
