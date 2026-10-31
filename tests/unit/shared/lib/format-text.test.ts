import { describe, expect, it } from "vitest";
import { formatText } from "@/shared/lib/format-text";

describe("formatText", () => {
  it("binds repeated values and zero without reinterpreting replacement text", () => {
    expect(
      formatText("{name} / {name} / {count}", {
        name: "{year} $&",
        count: 0,
      }),
    ).toBe("{year} $& / {year} $& / 0");
  });

  it("keeps missing and inherited placeholders visible for content editors", () => {
    expect(
      formatText("{name} / {missing} / {constructor}", { name: "Khuong" }),
    ).toBe("Khuong / {missing} / {constructor}");
  });
});
