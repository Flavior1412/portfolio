"use client";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import content from "@/shared/data/content.json";
import { formatText } from "@/shared/lib/format-text";

export function Footer({ name, email }: { name: string; email: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <footer
      data-nav="dark"
      className="relative z-10 border-t border-bone/10 bg-ink text-bone/40"
    >
      <div className="folio-container flex flex-col gap-4 py-8 font-display text-[10px] uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between">
        <span>
          {formatText(content.footer.copyright, {
            year: new Date().getFullYear(),
            name,
          })}
        </span>
        <a
          href={`mailto:${email}`}
          className="transition-colors hover:text-bone"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: reducedMotion ? "instant" : "smooth",
            })
          }
          className="text-left transition-colors hover:text-bone"
        >
          {content.footer.backToTop}
        </button>
      </div>
    </footer>
  );
}
