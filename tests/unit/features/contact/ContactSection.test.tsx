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
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole("link", { name: "Phone" })).toHaveAttribute(
      "href",
      `tel:${profile.phone}`,
    );
  });

  it("opens an email message instead of linking to the removed contact form", () => {
    const { container } = render(<ContactSection profile={profile} />);

    expect(screen.getByRole("link", { name: "Send Message" })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(container.querySelector("form")).not.toBeInTheDocument();
    expect(
      container.querySelector('a[href="#contact-form"]'),
    ).not.toBeInTheDocument();
  });
});
