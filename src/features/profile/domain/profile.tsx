export interface Profile {
  readonly name: string;
  readonly role: string;
  readonly headline: string;
  readonly shortSummary: string;
  readonly summary: string;
  readonly location: string;
  readonly email: string;
  readonly phone: string;
}

export interface Employment {
  readonly role: string;
  readonly company: string;
  readonly dates: string;
}

export interface HeroCaption {
  readonly at: number;
  readonly text: string;
}

export interface ProfileContent {
  readonly profile: Profile;
  readonly employment: readonly Employment[];
  readonly heroCaptions: readonly HeroCaption[];
}
