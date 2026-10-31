const HEADER_SCROLL_OFFSET = 90;

/** Resolve saved URL anchors using the same offsets as the navigation menu. */
export function getAnchorScrollTop(hash: string): number | null {
  if (!hash.startsWith("#") || hash.length === 1) return null;

  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }

  const section = document.getElementById(id);
  if (!section) return null;
  // A pinned hero can report viewport coordinates instead of its document top.
  if (id === "hero") return 0;

  const target =
    id === "about"
      ? (document.getElementById("about-scroll-start") ?? section)
      : section;
  return Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET,
  );
}
