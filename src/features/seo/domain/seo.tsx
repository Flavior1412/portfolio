export interface SeoProfile {
  readonly name: string;
  readonly role: string;
  readonly shortSummary: string;
  readonly location: string;
  readonly email: string;
  readonly phone: string;
}

export interface SeoProject {
  readonly id: number;
  readonly title: string;
  readonly description: string;
}

export interface SeoSkill {
  readonly label: string;
}

export interface SeoCopy {
  readonly siteName: string;
  readonly description: string;
  readonly profilePageName: string;
  readonly linkedinUrl: string;
  readonly projectsName: string;
  readonly lastUpdated: string;
}

export interface StructuredDataInput {
  readonly siteUrl: string;
  readonly copy: SeoCopy;
  readonly profile: SeoProfile;
  readonly currentEmployer?: string;
  readonly almaMater?: string;
  readonly projects: readonly SeoProject[];
  readonly skills: readonly SeoSkill[];
}

export interface StructuredDataGraph {
  readonly "@context": "https://schema.org";
  readonly "@graph": readonly Record<string, unknown>[];
}
