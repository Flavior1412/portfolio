import { describe, expect, it } from "vitest";
import { buildStructuredData } from "@/features/seo/server";

describe("buildStructuredData", () => {
  it("builds linked profile, website and project entities from portfolio data", () => {
    const data = buildStructuredData({
      siteUrl: "https://example.com/",
      copy: {
        siteName: "Example Portfolio",
        description: "Example description",
        profilePageName: "Example Engineer",
        linkedinUrl: "https://www.linkedin.com/in/example/",
        projectsName: "Selected projects",
        lastUpdated: "2026-11-03",
      },
      profile: {
        name: "Example Engineer",
        role: "Senior Front-end Engineer",
        shortSummary: "Builds enterprise web applications.",
        location: "Ho Chi Minh City, Vietnam",
        email: "example@example.com",
        phone: "0000000000",
      },
      currentEmployer: "Example Company",
      almaMater: "Example University",
      projects: [{ id: 1, title: "Project One", description: "Description" }],
      skills: [{ label: "TypeScript" }],
    });

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "ProfilePage",
          url: "https://example.com",
        }),
        expect.objectContaining({
          "@type": "Person",
          worksFor: { "@type": "Organization", name: "Example Company" },
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "Example University",
          },
        }),
        expect.objectContaining({
          "@type": "ItemList",
          itemListElement: [
            expect.objectContaining({
              item: expect.objectContaining({
                url: "https://example.com/#work-project-1",
              }),
            }),
          ],
        }),
      ]),
    );
  });
});
