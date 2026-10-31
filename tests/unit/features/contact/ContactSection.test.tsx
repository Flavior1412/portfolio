import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactSection } from "@/features/contact/presentation/components/ContactSection";
import profileContent from "@/features/profile/infrastructure/data/profile.json";
const { profile } = profileContent;

describe("ContactSection", () => {
  it("provides direct email and phone links using the profile contact details", () => {
    render(<ContactSection profile={profile} />);

    expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole("link", { name: profile.phone })).toHaveAttribute(
      "href",
      `tel:${profile.phone}`,
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/h%E1%BB%AFu-kh%C6%B0%C6%A1ng-kira-2a6431191/",
    );
    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute(
      "href",
      "/resume/Khuong%20CV_281026.pdf",
    );
  });

  it("links the contact actions to Zalo, LinkedIn and the resume", () => {
    const { container } = render(<ContactSection profile={profile} />);

    expect(screen.getByRole("link", { name: "Zalo" })).toHaveAttribute(
      "href",
      "https://zalo.me/0354342144",
    );
    expect(container.querySelector("form")).not.toBeInTheDocument();
    expect(
      container.querySelector('a[href="#contact-form"]'),
    ).not.toBeInTheDocument();
  });
});
