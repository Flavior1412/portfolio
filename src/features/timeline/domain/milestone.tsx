// ─── Timeline ────────────────────────────────────────────────────────────────

export interface Milestone {
  /** Unique sequential identifier (0 = illustrative childhood introduction) */
  readonly id: number;
  /** ISO month, "present", or empty for the undated illustrative origin */
  readonly startDate: string;
  /** Display-ready label, e.g. "Jul 2017 – Oct 2019" */
  readonly dateLabel: string;
  readonly role: string;
  readonly company: string;
  /** 1–3 sentence description shown in MilestoneCard */
  readonly description: string;
  /** Key technologies used in this milestone / project from CV */
  readonly technologies?: readonly string[];
  /** Key responsibilities & accomplishments from CV */
  readonly responsibilities?: readonly string[];
  /** Project domain (e.g. Government, Retail, Education, Oil & Gas, Automotive) */
  readonly domain?: string;
}
