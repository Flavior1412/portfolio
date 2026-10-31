import { describe, expect, it } from "vitest";
import {
  buildJourneyRoute,
  locateJourneyTraveler,
} from "@/features/timeline/presentation/lib/journey-path";

const stops = [
  { x: 100, y: 250, top: 160, bottom: 420, edge: 144 },
  { x: 900, y: 700, top: 600, bottom: 1000, edge: 856 },
  { x: 100, y: 1300, top: 1200, bottom: 1500, edge: 144 },
];

describe("career journey path", () => {
  it("makes its zigzag turns in the gaps and stays outside each card", () => {
    const route = buildJourneyRoute(stops);
    for (const point of route.samples) {
      for (const stop of stops) {
        if (point.y < stop.top || point.y > stop.bottom) continue;
        if (stop.x < stop.edge) expect(point.x).toBeLessThan(stop.edge);
        else expect(point.x).toBeGreaterThan(stop.edge);
      }
    }
    expect(
      Math.max(...route.samples.map((point) => point.x)) -
        Math.min(...route.samples.map((point) => point.x)),
    ).toBeGreaterThan(780);
  });

  it("keeps reading progress and the drawn route monotonic through all bends", () => {
    const route = buildJourneyRoute(stops);
    let previous = locateJourneyTraveler(route, 0);
    for (let step = 1; step <= 100; step++) {
      const point = locateJourneyTraveler(route, step / 100);
      expect(point.y).toBeGreaterThan(previous.y);
      expect(point.drawn).toBeGreaterThan(previous.drawn);
      expect(Number.isFinite(point.x)).toBe(true);
      previous = point;
    }
    expect(previous.drawn).toBeCloseTo(1);
    expect(previous.activeIndex).toBe(2);
  });

  it("handles scroll reversal, overscroll and an empty layout", () => {
    const route = buildJourneyRoute(stops);
    expect(locateJourneyTraveler(route, -1)).toEqual(
      locateJourneyTraveler(route, 0),
    );
    expect(locateJourneyTraveler(route, 2)).toEqual(
      locateJourneyTraveler(route, 1),
    );
    expect(locateJourneyTraveler(route, 0.25).drawn).toBeLessThan(
      locateJourneyTraveler(route, 0.75).drawn,
    );
    expect(locateJourneyTraveler(buildJourneyRoute([]), 0.5)).toEqual({
      x: 0,
      y: 0,
      drawn: 0,
      activeIndex: 0,
    });
  });
});
