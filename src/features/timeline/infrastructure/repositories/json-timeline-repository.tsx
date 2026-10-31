import type { TimelineRepository } from "../../domain/timeline-repository";
import content from "../data/timeline.json";

/** Seven CV-backed milestones and one explicitly illustrative childhood introduction. */
export const jsonTimelineRepository: TimelineRepository = {
  read: () => content,
};
