/**
 * Earth & Moon — 3D Elliptical Orbit
 *
 * Minimal wireframe line art inspired by Torus Knot.
 *
 * Features:
 * - Earth and Moon made from flowing parametric lines
 * - True 3D elliptical Moon orbit
 * - Moon moves in front of and behind Earth
 * - Earth occludes Moon naturally
 * - Depth-aware orbital path
 * - Independent Moon self-rotation
 * - Scroll-controlled animation
 *
 * API:
 * drawEarthMoonOrbit(ctx, w, h, progress, options)
 */

const TAU = Math.PI * 2;
const COUNT = 440;

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint extends Point3D {
  depth: number;
}

interface VisiblePoint extends ProjectedPoint {
  visible: boolean;
}

interface LineSphereOptions {
  radius?: number;
  spin?: number;
  tilt?: number;
  ink?: string;
  lineWidth?: number;
  curves?: number;
  particles?: boolean;
  offset?: Point3D;
  earthRadius?: number;
  occludeByEarth?: boolean;
}

interface EllipticalOrbitOptions {
  radiusX: number;
  radiusZ: number;
  tilt: number;
  ink: string;
  earthRadius: number;
}

export interface EarthMoonOrbitOptions {
  sizeRatio?: number;
  ink?: string;
  lineWidth?: number;
  earthCurves?: number;
  moonCurves?: number;
  earthRotationSpeed?: number;
  moonOrbitSpeed?: number;
  moonSelfRotationSpeed?: number;
  orbitWidth?: number;
  orbitDepth?: number;
  orbitTilt?: number;
  showOrbit?: boolean;
  showParticles?: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Rotate point around X axis.
 */
function rotateX(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

/**
 * Perspective projection.
 *
 * Camera is positioned at negative Z.
 * Smaller Z = closer to camera.
 */
function project(
  point: Point3D,
  cx: number,
  cy: number,
  scale: number,
): ProjectedPoint {
  const cameraDistance = 5;

  const perspective = cameraDistance / Math.max(0.5, cameraDistance + point.z);

  return {
    x: cx + point.x * scale * perspective,
    y: cy + point.y * scale * perspective,
    z: point.z,
    depth: perspective,
  };
}

/**
 * Check whether a 3D point is hidden
 * behind Earth's projected sphere.
 */
function isBehindEarth(point: Point3D, earthRadius: number): boolean {
  if (point.z <= 0) return false;

  const distanceXY = Math.sqrt(point.x * point.x + point.y * point.y);

  if (distanceXY >= earthRadius) {
    return false;
  }

  const earthFrontZ = -Math.sqrt(
    earthRadius * earthRadius - distanceXY * distanceXY,
  );

  return point.z > earthFrontZ;
}

/**
 * Draw a sphere using flowing parametric curves.
 */
function drawLineSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  {
    radius = 1,
    spin = 0,
    tilt = 0.5,
    ink = "11,11,11",
    lineWidth = 1,
    curves = 3,
    particles = true,
    offset = { x: 0, y: 0, z: 0 },
    earthRadius = 0,
    occludeByEarth = false,
  }: LineSphereOptions = {},
) {
  const cosY = Math.cos(spin);
  const sinY = Math.sin(spin);

  const cosX = Math.cos(tilt);
  const sinX = Math.sin(tilt);

  for (let curve = 0; curve < curves; curve++) {
    const phase = (curve / curves) * TAU;
    const points: VisiblePoint[] = [];

    for (let i = 0; i <= COUNT; i++) {
      const t = (i / COUNT) * TAU;

      const longitude = t * 3 + phase;
      const latitude = Math.sin(t * 2 + phase) * 1.1;

      let x = radius * Math.cos(latitude) * Math.cos(longitude);

      let y = radius * Math.sin(latitude);

      let z = radius * Math.cos(latitude) * Math.sin(longitude);

      // Rotate around Y
      const rx = x * cosY - z * sinY;
      const rz = x * sinY + z * cosY;

      x = rx;
      z = rz;

      // Rotate around X
      const ry = y * cosX - z * sinX;
      z = y * sinX + z * cosX;
      y = ry;

      // Apply orbital offset
      x += offset.x;
      y += offset.y;
      z += offset.z;

      const point = { x, y, z };

      const projected = project(point, cx, cy, scale);

      points.push({
        ...projected,
        visible: !occludeByEarth || !isBehindEarth(point, earthRadius),
      });
    }

    /**
     * Draw line segments.
     */
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];

      if (!a.visible || !b.visible) {
        continue;
      }

      const alpha = clamp(0.1 + (b.depth - 0.7) * 0.8, 0.06, 0.85);

      ctx.strokeStyle = `rgba(${ink},${alpha})`;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    ctx.restore();

    /**
     * Draw particles.
     */
    if (particles) {
      for (let i = 0; i < points.length; i += 12) {
        const point = points[i];

        if (!point.visible) continue;

        const alpha = clamp(0.15 + (point.depth - 0.7) * 0.9, 0.08, 0.95);

        ctx.fillStyle = `rgba(${ink},${alpha})`;

        ctx.beginPath();

        ctx.arc(point.x, point.y, 1.4 * point.depth, 0, TAU);

        ctx.fill();
      }
    }
  }
}

/**
 * Draw a 3D elliptical orbit.
 */
function drawEllipticalOrbit(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  { radiusX, radiusZ, tilt, ink, earthRadius }: EllipticalOrbitOptions,
) {
  const segments = 360;

  ctx.save();
  ctx.lineWidth = 0.8;
  ctx.lineCap = "round";

  let previous: VisiblePoint | null = null;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * TAU;

    let point = {
      x: Math.cos(angle) * radiusX,
      y: 0,
      z: Math.sin(angle) * radiusZ,
    };

    point = rotateX(point, tilt);

    const visible = !isBehindEarth(point, earthRadius);

    const projected = project(point, cx, cy, scale);

    if (previous && previous.visible && visible) {
      const alpha = clamp(0.08 + (projected.depth - 0.7) * 0.3, 0.04, 0.2);

      ctx.strokeStyle = `rgba(${ink},${alpha})`;

      ctx.beginPath();

      ctx.moveTo(previous.x, previous.y);

      ctx.lineTo(projected.x, projected.y);

      ctx.stroke();
    }

    previous = {
      ...projected,
      visible,
    };
  }

  ctx.restore();
}

/**
 * Main renderer.
 */
export default function drawEarthMoonOrbit(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  {
    sizeRatio = 0.18,
    ink = "11,11,11",
    lineWidth = 0.8,

    earthCurves = 4,
    moonCurves = 3,

    earthRotationSpeed = 5,
    moonOrbitSpeed = 8,
    moonSelfRotationSpeed = 8,

    orbitWidth = 1.45,
    orbitDepth = 1.15,
    orbitTilt = 0.45,

    showOrbit = true,
    showParticles = true,
  }: EarthMoonOrbitOptions = {},
) {
  if (!ctx || w <= 0 || h <= 0) return;

  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  const scale = Math.min(w, h) * sizeRatio;

  const p = Number.isFinite(progress) ? progress : 0;

  /**
   * Scroll-driven rotation.
   */
  const earthSpin = p * TAU * earthRotationSpeed;

  const earthTilt = 0.5 + Math.sin(p * Math.PI) * 0.2;

  const moonAngle = p * TAU * moonOrbitSpeed;

  const moonSpin = p * TAU * moonSelfRotationSpeed;

  const earthRadius = 0.85;
  const moonRadius = 0.23;

  /**
   * Moon position on elliptical orbit.
   */
  let moonPosition = {
    x: Math.cos(moonAngle) * orbitWidth,
    y: 0,
    z: Math.sin(moonAngle) * orbitDepth,
  };

  moonPosition = rotateX(moonPosition, orbitTilt);

  /**
   * Draw orbit behind everything.
   */
  if (showOrbit) {
    drawEllipticalOrbit(ctx, cx, cy, scale, {
      radiusX: orbitWidth,
      radiusZ: orbitDepth,
      tilt: orbitTilt,
      ink,
      earthRadius,
    });
  }

  /**
   * Draw Earth.
   */
  drawLineSphere(ctx, cx, cy, scale, {
    radius: earthRadius,
    spin: earthSpin,
    tilt: earthTilt,
    ink,
    lineWidth,
    curves: earthCurves,
    particles: showParticles,
  });

  /**
   * Draw Moon.
   *
   * Earth occludes Moon when it
   * passes behind Earth's silhouette.
   */
  drawLineSphere(ctx, cx, cy, scale, {
    radius: moonRadius,
    spin: moonSpin,
    tilt: 0.35,
    ink,
    lineWidth: lineWidth * 0.8,
    curves: moonCurves,
    particles: showParticles,
    offset: moonPosition,
    earthRadius,
    occludeByEarth: true,
  });
}
