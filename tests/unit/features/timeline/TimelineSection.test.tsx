import { TimelineSection } from "@/features/timeline/presentation/components/TimelineSection";
import milestones from "@/features/timeline/infrastructure/data/timeline.json";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/hooks/useScrollProgress", () => ({
  useScrollProgress: () => 0,
}));
vi.mock("@/features/timeline/presentation/components/CharacterJourney", () => ({
  CharacterJourney: () => <div data-testid="character-journey" />,
}));

describe("TimelineSection", () => {
  afterEach(cleanup);

  it("retains every career milestone and its original facts in the zigzag layout", () => {
    render(<TimelineSection milestones={milestones} />);
    expect(
      within(
        screen.getByRole("list", { name: "Career milestones" }),
      ).getAllByRole("article"),
    ).toHaveLength(milestones.length);
    for (const milestone of milestones) {
      const article = screen.getByRole("article", {
        name: `${milestone.role} at ${milestone.company}`,
      });
      expect(
        within(article).getByText(milestone.description),
      ).toBeInTheDocument();
      expect(
        within(article).getByText(milestone.dateLabel),
      ).toBeInTheDocument();
      for (const point of milestone.responsibilities ?? [])
        expect(within(article).getByText(point)).toBeInTheDocument();
      for (const tech of milestone.technologies ?? [])
        expect(within(article).getByText(tech)).toBeInTheDocument();
    }
  });

  it("restores the walking journey and keeps stable destinations for work links", () => {
    render(<TimelineSection milestones={milestones} />);
    for (const milestone of milestones)
      expect(
        document.getElementById(`milestone-${milestone.id}`),
      ).toBeInTheDocument();
    expect(screen.getByTestId("character-journey")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-route")).toBeInTheDocument();
    expect(
      screen.queryByText(/Small steps|A little more momentum/i),
    ).not.toBeInTheDocument();
  });
});
