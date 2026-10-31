import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MilestoneCard } from "@/features/timeline/presentation/components/MilestoneCard";
import type { Milestone } from "@/features/timeline/domain/milestone";

// Factory — avoids hardcoded literals spread across tests
function makeMilestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: 2,
    startDate: "2017-07",
    dateLabel: "Jul 2017 – Oct 2019",
    role: "Junior Front-end Developer",
    company: "FPT Software",
    description: "Built responsive UI components at enterprise scale.",
    ...overrides,
  };
}

describe("MilestoneCard", () => {
  it("renders the date label", () => {
    // Arrange
    const milestone = makeMilestone();

    // Act
    render(<MilestoneCard milestone={milestone} />);

    // Assert
    expect(screen.getByText("Jul 2017 – Oct 2019")).toBeInTheDocument();
  });

  it("renders the role title", () => {
    // Arrange
    const milestone = makeMilestone();

    // Act
    render(<MilestoneCard milestone={milestone} />);

    // Assert
    expect(screen.getByText("Junior Front-end Developer")).toBeInTheDocument();
  });

  it("renders the company name", () => {
    // Arrange
    const milestone = makeMilestone();

    // Act
    render(<MilestoneCard milestone={milestone} />);

    // Assert
    expect(screen.getByText("FPT Software")).toBeInTheDocument();
  });

  it("renders the description", () => {
    // Arrange
    const milestone = makeMilestone();

    // Act
    render(<MilestoneCard milestone={milestone} />);

    // Assert
    expect(
      screen.getByText("Built responsive UI components at enterprise scale."),
    ).toBeInTheDocument();
  });

  it("renders all four data fields together", () => {
    // Arrange
    const milestone = makeMilestone({
      dateLabel: "Mar 2021 – Oct 2022",
      role: "Senior Front-end Engineer",
      company: "FPT Software (Buyer Red Line)",
      description: "Architected scalable front-end solutions.",
    });

    // Act
    render(<MilestoneCard milestone={milestone} />);

    // Assert
    expect(screen.getByText("Mar 2021 – Oct 2022")).toBeInTheDocument();
    expect(screen.getByText("Senior Front-end Engineer")).toBeInTheDocument();
    expect(
      screen.getByText("FPT Software (Buyer Red Line)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Architected scalable front-end solutions."),
    ).toBeInTheDocument();
  });

  it("still renders content in the DOM", () => {
    // Content remains readable before the viewport entrance animation.
    const milestone = makeMilestone();

    // Act
    render(<MilestoneCard milestone={milestone} />);

    // Assert
    expect(screen.getByText("Junior Front-end Developer")).toBeInTheDocument();
  });
});
