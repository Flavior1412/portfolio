import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollProgress } from "@/shared/hooks/useScrollProgress";
import type { RefObject } from "react";

function createMockElement(offsetHeight = 2000, rectTop = 0): HTMLDivElement {
  const el = document.createElement("div");
  Object.defineProperty(el, "offsetHeight", {
    value: offsetHeight,
    configurable: true,
  });
  Object.defineProperty(el, "getBoundingClientRect", {
    value: () => ({ top: rectTop }),
    configurable: true,
  });
  return el;
}

/**
 * useScrollProgress expects a RefObject<HTMLElement>. React.createRef seals
 * `.current` as non-configurable, so we use a plain object that satisfies
 * the same interface.
 */
function makeMutableRef(element: HTMLDivElement): RefObject<HTMLDivElement> {
  return { current: element };
}

/**
 * In Vitest's jsdom, window.scrollY is a getter-only property.
 * Object.defineProperty with { value, configurable: true } overrides it.
 */
function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    configurable: true,
  });
}

/**
 * Mount the hook, then flush the rAF scheduled by the initial handleScroll()
 * call inside useEffect. The flush must happen *after* renderHook (not inside
 * the same act()) so React can batch the resulting setState call correctly.
 */
async function mountAndFlush(ref: RefObject<HTMLDivElement | null>) {
  const hookResult = renderHook(() => useScrollProgress(ref));
  // useEffect fires synchronously in React test renderer, scheduling a rAF.
  // Flush that rAF inside act() so the subsequent setState is captured.
  await act(async () => {
    await vi.runAllTimersAsync();
  });
  return hookResult;
}

describe("useScrollProgress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setScrollY(0);
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.restoreAllMocks();
    // Restore scrollY to 0 for next test
    setScrollY(0);
  });

  it("returns 0 at the top of the section", async () => {
    // Arrange — section top at viewport top, no scroll
    // elementTop = rectTop + scrollY = 0 + 0 = 0; raw = 0/1200 = 0
    setScrollY(0);
    const el = createMockElement(2000, 0);
    const ref = makeMutableRef(el);

    // Act
    const { result } = await mountAndFlush(ref);

    // Assert
    expect(result.current).toBe(0);
  });

  it("clamps to 0 when scroll is before the section", async () => {
    // Arrange — section 500px below viewport
    // elementTop = 500 + 0 = 500; raw = (0-500)/1200 < 0 → clamped to 0
    setScrollY(0);
    const el = createMockElement(2000, 500);
    const ref = makeMutableRef(el);

    // Act
    const { result } = await mountAndFlush(ref);

    // Assert
    expect(result.current).toBe(0);
  });

  it("returns a value between 0 and 1 in the middle of the section", async () => {
    // Arrange
    // elementTop = rectTop + scrollY = -600 + 600 = 0
    // raw = (600 - 0) / (2000 - 800) = 0.5
    setScrollY(600);
    const el = createMockElement(2000, -600);
    const ref = makeMutableRef(el);

    // Act
    const { result } = await mountAndFlush(ref);

    // Assert
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(1);
  });

  it("clamps to 1 when scroll is past the end of the section", async () => {
    // Arrange — scrolled far past section
    // elementTop = rectTop + scrollY = -9999 + 9999 = 0
    // raw = 9999 / (2000 - 800) >> 1 → clamped to 1
    setScrollY(9999);
    const el = createMockElement(2000, -9999);
    const ref = makeMutableRef(el);

    // Act
    const { result } = await mountAndFlush(ref);

    // Assert
    expect(result.current).toBe(1);
  });

  it("removes the scroll listener when unmounted", async () => {
    // Arrange
    const removeSpy = vi.spyOn(window, "removeEventListener");
    setScrollY(0);
    const el = createMockElement(2000, 0);
    const ref = makeMutableRef(el);
    const { unmount } = await mountAndFlush(ref);

    // Act
    unmount();

    // Assert
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("updates progress when a scroll event fires", async () => {
    // Arrange — start at top
    setScrollY(0);
    const el = createMockElement(2000, 0);
    const ref = makeMutableRef(el);
    const { result } = await mountAndFlush(ref);
    expect(result.current).toBe(0);

    // Act — simulate scrolling to midpoint
    Object.defineProperty(el, "getBoundingClientRect", {
      value: () => ({ top: -600 }),
      configurable: true,
    });
    await act(async () => {
      setScrollY(600);
      window.dispatchEvent(new Event("scroll"));
      await vi.runAllTimersAsync();
    });

    // Assert
    expect(result.current).toBeGreaterThan(0);
  });

  it("returns a finite endpoint when the section is exactly one viewport tall", async () => {
    const { result } = await mountAndFlush(
      makeMutableRef(createMockElement(800, 0)),
    );
    expect(result.current).toBe(1);
    expect(Number.isFinite(result.current)).toBe(true);
  });

  it("keeps a short section at zero before it reaches the viewport top", async () => {
    const { result } = await mountAndFlush(
      makeMutableRef(createMockElement(400, 100)),
    );
    expect(result.current).toBe(0);
  });

  it("recalculates progress after the viewport is resized", async () => {
    const { result } = await mountAndFlush(
      makeMutableRef(createMockElement(2000, -600)),
    );
    expect(result.current).toBe(0.5);
    await act(async () => {
      Object.defineProperty(window, "innerHeight", {
        value: 1400,
        configurable: true,
      });
      window.dispatchEvent(new Event("resize"));
      await vi.runAllTimersAsync();
    });
    expect(result.current).toBe(1);
  });

  it("does not schedule work when the ref has no element", async () => {
    const { result } = await mountAndFlush({ current: null });
    expect(result.current).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("coalesces scroll events and cancels a pending frame on unmount", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = renderHook(() =>
      useScrollProgress(makeMutableRef(createMockElement())),
    );
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(cancel).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
});
