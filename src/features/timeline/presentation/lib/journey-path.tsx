export interface JourneyPoint {
  x: number;
  y: number;
}
export interface JourneyStop extends JourneyPoint {
  top: number;
  bottom: number;
  edge: number;
}
type Curve = [JourneyPoint, JourneyPoint, JourneyPoint, JourneyPoint];
type Sample = JourneyPoint & { distance: number };

export interface JourneyRoute {
  path: string;
  samples: Sample[];
  length: number;
  stops: JourneyStop[];
}

/** Keep the route outside cards and make the side-to-side turns in their gaps. */
export function buildJourneyRoute(stops: JourneyStop[]): JourneyRoute {
  if (!stops.length) return { path: "", samples: [], length: 0, stops };
  const curves: Curve[] = [];
  let cursor: JourneyPoint = { x: stops[0].x + 12, y: stops[0].top };
  const start = cursor;
  const add = (a: JourneyPoint, b: JourneyPoint, end: JourneyPoint) => {
    curves.push([cursor, a, b, end]);
    cursor = end;
  };

  stops.forEach((stop, index) => {
    const bow = stop.edge > stop.x ? -10 : 10;
    add(
      { x: stop.x + bow, y: cursor.y + (stop.y - cursor.y) * 0.35 },
      { x: stop.x + bow, y: stop.y - 28 },
      { x: stop.x, y: stop.y },
    );
    add(
      { x: stop.x - bow, y: stop.y + 40 },
      { x: stop.x - bow, y: stop.bottom - 24 },
      { x: stop.x, y: stop.bottom + 18 },
    );
    const next = stops[index + 1];
    if (next) {
      const entry = next.top - 18;
      const gap = entry - cursor.y;
      add(
        { x: stop.x, y: cursor.y + gap * 0.6 },
        { x: next.x, y: entry - gap * 0.6 },
        { x: next.x, y: entry },
      );
    }
  });

  const samples: Sample[] = [{ ...start, distance: 0 }];
  for (const [a, b, c, d] of curves) {
    for (let step = 1; step <= 48; step++) {
      const t = step / 48;
      const u = 1 - t;
      const point = {
        x:
          u ** 3 * a.x +
          3 * u ** 2 * t * b.x +
          3 * u * t ** 2 * c.x +
          t ** 3 * d.x,
        y:
          u ** 3 * a.y +
          3 * u ** 2 * t * b.y +
          3 * u * t ** 2 * c.y +
          t ** 3 * d.y,
      };
      const previous = samples[samples.length - 1];
      samples.push({
        ...point,
        distance:
          previous.distance +
          Math.hypot(point.x - previous.x, point.y - previous.y),
      });
    }
  }

  return {
    path:
      `M ${start.x} ${start.y} ` +
      curves
        .map(([, b, c, d]) => `C ${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`)
        .join(" "),
    samples,
    length: samples[samples.length - 1].distance,
    stops,
  };
}

/** Map vertical reading progress onto the actual route, including its turns. */
export function locateJourneyTraveler(route: JourneyRoute, progress: number) {
  if (!route.samples.length) return { x: 0, y: 0, drawn: 0, activeIndex: 0 };
  const first = route.samples[0];
  const last = route.samples[route.samples.length - 1];
  const y = first.y + Math.max(0, Math.min(1, progress)) * (last.y - first.y);
  const found = route.samples.findIndex((point) => point.y >= y);
  const index = Math.max(1, found < 0 ? route.samples.length - 1 : found);
  const next = route.samples[index];
  const previous = route.samples[index - 1];
  const fraction = Math.max(
    0,
    Math.min(1, (y - previous.y) / (next.y - previous.y || 1)),
  );
  const distance =
    previous.distance + (next.distance - previous.distance) * fraction;
  const activeIndex = Math.max(
    0,
    route.stops.findLastIndex((stop) => stop.y <= y + 12),
  );
  return {
    x: previous.x + (next.x - previous.x) * fraction,
    y,
    drawn: route.length > 0 ? distance / route.length : 0,
    activeIndex,
  };
}
