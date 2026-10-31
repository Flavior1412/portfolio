import { getAnchorScrollTop } from "@/shared/lib/anchor-scroll";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY")!;

function addTarget(id: string, top: number) {
  const element = document.createElement("section");
  element.id = id;
  document.body.append(element);
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, top, 100, 100),
  );
  return element;
}

describe("getAnchorScrollTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 400,
    });
  });

  afterEach(() => {
    document.body.replaceChildren();
    Object.defineProperty(window, "scrollY", originalScrollY);
    vi.restoreAllMocks();
  });

  it("accounts for document scroll and the fixed navigation height", () => {
    addTarget("work", 600);
    expect(getAnchorScrollTop("#work")).toBe(910);
  });

  it("uses About's stable marker and falls back to its section", () => {
    addTarget("about", 800);
    const marker = addTarget("about-scroll-start", 700);
    expect(getAnchorScrollTop("#about")).toBe(1010);
    marker.remove();
    expect(getAnchorScrollTop("#about")).toBe(1110);
  });

  it("returns to the document top even when the hero is pinned", () => {
    addTarget("hero", 0);
    expect(getAnchorScrollTop("#hero")).toBe(0);
  });

  it("supports encoded IDs and clamps targets above the document start", () => {
    addTarget("a section", -500);
    expect(getAnchorScrollTop("#a%20section")).toBe(0);
  });

  it.each(["", "#", "work", "#missing", "#%E0%A4%A"])(
    "ignores invalid or missing anchors: %s",
    (hash) => expect(getAnchorScrollTop(hash)).toBeNull(),
  );
});
