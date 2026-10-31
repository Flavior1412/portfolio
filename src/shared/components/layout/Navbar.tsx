"use client";

import {
  useState,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import content from "@/shared/data/content.json";
import { getAnchorScrollTop } from "@/shared/lib/anchor-scroll";

type NavigateHandler = (
  event: ReactMouseEvent<HTMLAnchorElement>,
  href: string,
) => void;

function NavigationLinks({
  onNavigate,
  className,
  linkClassName,
}: {
  onNavigate: NavigateHandler;
  className: string;
  linkClassName?: string;
}) {
  return (
    <ul className={className}>
      {content.navigation.links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            onClick={(event) => onNavigate(event, link.href)}
            className={linkClassName}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Navbar({ name, email }: { name: string; email: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const scrollToSection: NavigateHandler = (event, href) => {
    setMenuOpen(false);
    if (getAnchorScrollTop(href) === null) return;
    event.preventDefault();
    ScrollTrigger.refresh();
    requestAnimationFrame(() => {
      const top = getAnchorScrollTop(href);
      if (top === null) return;
      window.history.pushState(null, "", href);
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  };

  useEffect(() => {
    let frame: number | null = null;
    const update = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setScrolled(window.scrollY > 40);
        setOnDark(
          Array.from(document.querySelectorAll('[data-nav="dark"]')).some(
            (section) => {
              const rect = section.getBoundingClientRect();
              return rect.top <= 76 && rect.bottom > 76;
            },
          ),
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: MouseEvent) => {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      )
        setMenuOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", closeDesktop);
    return () => media.removeEventListener("change", closeDesktop);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${onDark ? "text-bone" : "text-ink"} ${scrolled && !onDark ? "bg-bone/70 backdrop-blur-md" : ""}`}
    >
      <nav
        className="flex items-center justify-between gap-4 px-6 py-5 md:px-10"
        aria-label={content.accessibility.primaryNavigation}
      >
        <a
          href="#hero"
          onClick={(event) => scrollToSection(event, "#hero")}
          aria-label={name}
          className="shrink-0 font-display text-[18px] leading-none tracking-tight md:text-[22px]"
        >
          <b className="font-bold">{content.navigation.brand.givenName}</b>
          <span className="font-light">
            {content.navigation.brand.familyName}
          </span>
          <span className="opacity-50">{content.navigation.brand.mark}</span>
        </a>
        <NavigationLinks
          onNavigate={scrollToSection}
          className="hidden items-center gap-8 font-display text-xs uppercase tracking-[0.2em] lg:flex"
          linkClassName="opacity-55 transition-opacity hover:opacity-100"
        />
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={`mailto:${email}`}
            className={`hidden rounded-full px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.18em] transition-all duration-500 hover:-translate-y-0.5 min-[420px]:block ${onDark ? "bg-bone text-ink" : "bg-ink text-bone"}`}
          >
            {content.navigation.contact}
          </a>
          <button
            ref={triggerRef}
            aria-label={
              menuOpen
                ? content.accessibility.closeMenu
                : content.accessibility.openMenu
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="p-2 lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d={menuOpen ? "M6 6L18 18M6 18L18 6" : "M4 8H20M4 16H20"} />
            </svg>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className={`absolute inset-x-0 top-full border-t p-6 lg:hidden ${onDark ? "border-bone/10 bg-ink" : "border-ink/10 bg-bone"}`}
        >
          <NavigationLinks
            onNavigate={scrollToSection}
            className="space-y-5 font-display text-sm uppercase tracking-[0.2em]"
          />
        </div>
      )}
    </header>
  );
}
