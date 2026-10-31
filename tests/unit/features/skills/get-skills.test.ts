import { describe, expect, it } from "vitest";
import { getSkills } from "@/features/skills/application/get-skills";
import type { SkillGroups } from "@/features/skills/domain/skill";
import type { SkillRepository } from "@/features/skills/domain/skill-repository";

describe("getSkills", () => {
  it("preserves arbitrary editorial category and item order without changing its source", () => {
    const source: SkillGroups = Object.freeze({
      "New editorial category": Object.freeze([
        Object.freeze({ id: "second", label: "Second" }),
        Object.freeze({ id: "first", label: "First" }),
      ]),
      "Empty category": Object.freeze([]),
      "Another category": Object.freeze([
        Object.freeze({ id: "third", label: "Third" }),
      ]),
    });
    const repository: SkillRepository = { read: () => source };

    const catalog = getSkills(repository);

    expect(catalog.skillCategories).toEqual([
      "New editorial category",
      "Empty category",
      "Another category",
    ]);
    expect(catalog.skills).toEqual([
      { id: "second", label: "Second", category: "New editorial category" },
      { id: "first", label: "First", category: "New editorial category" },
      { id: "third", label: "Third", category: "Another category" },
    ]);
    expect(source["New editorial category"][0]).toEqual({
      id: "second",
      label: "Second",
    });
    expect(catalog.skills[0]).not.toBe(source["New editorial category"][0]);
  });

  it("returns an empty catalog for a repository with no groups", () => {
    expect(getSkills({ read: () => ({}) })).toEqual({
      skillCategories: [],
      skills: [],
    });
  });
});
