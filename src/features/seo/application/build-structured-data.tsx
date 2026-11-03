import type {
  StructuredDataGraph,
  StructuredDataInput,
} from "../domain/seo";

/** Build portable JSON-LD from the serializable portfolio model. */
export function buildStructuredData({
  siteUrl,
  copy,
  profile,
  currentEmployer,
  almaMater,
  projects,
  skills,
}: StructuredDataInput): StructuredDataGraph {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const personId = `${normalizedSiteUrl}/#person`;
  const websiteId = `${normalizedSiteUrl}/#website`;

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    jobTitle: profile.role,
    description: profile.shortSummary,
    url: normalizedSiteUrl,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    homeLocation: {
      "@type": "Place",
      name: profile.location,
    },
    sameAs: [copy.linkedinUrl],
    knowsAbout: skills.map((skill) => skill.label),
  };

  if (currentEmployer) {
    person.worksFor = {
      "@type": "Organization",
      name: currentEmployer,
    };
  }

  if (almaMater) {
    person.alumniOf = {
      "@type": "CollegeOrUniversity",
      name: almaMater,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${normalizedSiteUrl}/#profilepage`,
        url: normalizedSiteUrl,
        name: copy.profilePageName,
        description: profile.shortSummary,
        dateModified: copy.lastUpdated,
        mainEntity: { "@id": personId },
        isPartOf: { "@id": websiteId },
      },
      person,
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: normalizedSiteUrl,
        name: copy.siteName,
        description: copy.description,
        publisher: { "@id": personId },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        "@id": `${normalizedSiteUrl}/#projects`,
        name: copy.projectsName,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            url: `${normalizedSiteUrl}/#work-project-${project.id}`,
            creator: { "@id": personId },
          },
        })),
      },
    ],
  };
}
