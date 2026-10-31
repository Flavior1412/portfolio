/** Complete project records from Khuong's CV dated 2026-10-15, in chronological order. */
export interface ProjectEntry {
  readonly id: number;
  readonly title: string;
  readonly company: string;
  readonly role: string;
  readonly dateLabel: string;
  readonly description: string;
  readonly responsibilities: readonly string[];
  readonly technologyGroups: readonly {
    readonly label: string;
    readonly items: readonly string[];
  }[];
}
