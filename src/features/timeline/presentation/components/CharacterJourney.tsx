"use client";

import { useEffect, useId, useState, type RefObject } from "react";
import styles from "./CharacterJourney.module.css";
import {
  buildJourneyRoute,
  locateJourneyTraveler,
  type JourneyRoute,
} from "../lib/journey-path";

interface CharacterJourneyProps {
  progress: number;
  reducedMotion: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  onActiveChange: (index: number) => void;
}

/** The character walks on the same full-page route that connects the actual cards. */
export function CharacterJourney({
  progress,
  reducedMotion,
  containerRef,
  onActiveChange,
}: CharacterJourneyProps) {
  const id = useId().replace(/:/g, "");
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
    mobile: boolean;
    route: JourneyRoute;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame: number | null = null;
    let disposed = false;
    const measure = () => {
      if (disposed || frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const bounds = container.getBoundingClientRect();
        const mobile = window.innerWidth < 768;
        const cards = Array.from(
          container.querySelectorAll<HTMLElement>("[data-journey-card]"),
        );
        const stops = cards.map((card, index) => {
          const rect = card.getBoundingClientRect();
          const top = rect.top - bounds.top;
          const leftSide = mobile || index % 2 === 0;
          const edge = leftSide
            ? rect.left - bounds.left
            : rect.right - bounds.left;
          return {
            x: mobile ? 22 + (index % 2) * 12 : edge + (leftSide ? -44 : 44),
            y: top + Math.min(92, rect.height * 0.3),
            top,
            bottom: rect.bottom - bounds.top,
            edge,
          };
        });
        setLayout({
          width: bounds.width,
          height: bounds.height,
          mobile,
          route: buildJourneyRoute(stops),
        });
      });
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(container);
    container
      .querySelectorAll("[data-journey-card]")
      .forEach((card) => observer?.observe(card));
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [containerRef]);

  const position = layout
    ? locateJourneyTraveler(layout.route, progress)
    : null;
  const activeIndex = position?.activeIndex ?? 0;
  useEffect(() => onActiveChange(activeIndex), [activeIndex, onActiveChange]);

  const normalized = Math.max(0, Math.min(1, progress));
  return (
    <div
      data-testid="character-journey"
      data-progress={normalized.toFixed(3)}
      data-motion={reducedMotion ? "paused" : "playing"}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {layout && position && (
        <>
          <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient
                id={`route-${id}`}
                x1="0"
                y1="0"
                x2="0"
                y2={layout.height}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#38bdf8" />
                <stop offset=".55" stopColor="#a78bfa" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path
              d={layout.route.path}
              strokeWidth="1.5"
              strokeDasharray="2 8"
              strokeLinecap="round"
              className="stroke-slate-300"
            />
            <path
              data-testid="journey-path"
              d={layout.route.path}
              pathLength="1"
              stroke={`url(#route-${id})`}
              strokeWidth="2.5"
              strokeDasharray="1"
              strokeDashoffset={1 - position.drawn}
              strokeLinecap="round"
            />
            {layout.route.stops.map((stop, index) => (
              <g key={index}>
                <path
                  d={`M ${stop.x} ${stop.y} H ${stop.edge}`}
                  className="stroke-slate-300"
                />
                <rect
                  x={stop.x - 12}
                  y={stop.y - 12}
                  width="24"
                  height="24"
                  rx="7"
                  className={
                    index <= activeIndex
                      ? "fill-sky-50 stroke-sky-400"
                      : "fill-slate-50 stroke-slate-300"
                  }
                />
                <text
                  x={stop.x}
                  y={stop.y + 3.5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  className={
                    index <= activeIndex ? "fill-sky-700" : "fill-slate-400"
                  }
                >
                  {String(index + 1).padStart(2, "0")}
                </text>
              </g>
            ))}
          </svg>
          <div
            data-testid="timeline-traveler"
            data-facing={
              layout.mobile || activeIndex % 2 === 0 ? "right" : "left"
            }
            className="absolute z-20 w-[84px] drop-shadow-md min-[768px]:w-28"
            style={{
              left: position.x,
              top: position.y,
              transform: "translate(-50%, -84%)",
            }}
          >
            <div
              style={{
                transform: `scaleX(${layout.mobile || activeIndex % 2 === 0 ? 1 : -1})`,
              }}
            >
              <div
                data-testid="journey-sprite"
                data-frame-count="8"
                className={`${styles.walker} aspect-square w-full bg-no-repeat`}
                style={{
                  backgroundImage:
                    "url('/images/journey/student-walk-cycle.webp')",
                  backgroundSize: "400% 200%",
                  backgroundPosition: "0% 0%",
                  animationDuration: `${1 - normalized * 0.35}s`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
