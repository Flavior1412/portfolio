import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useReducedMotion", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("reads the preference, responds to changes, and removes its listener", () => {
    let change: ((event: MediaQueryListEvent) => void) | undefined;
    const media = {
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(
        (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          change = listener;
        },
      ),
      removeEventListener: vi.fn(),
    };
    // This browser boundary only implements the media-query change event used here.
    vi.spyOn(window, "matchMedia").mockReturnValue(
      media as unknown as MediaQueryList,
    );
    const { result, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    act(() => change?.({ matches: false } as MediaQueryListEvent));
    expect(result.current).toBe(false);
    unmount();
    expect(media.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
