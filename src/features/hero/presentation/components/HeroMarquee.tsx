import content from "@/shared/data/content.json";

const parts = [
  { text: content.hero.marquee.building, style: "" },
  { text: content.hero.marquee.enterprise, style: "font-bold" },
  {
    text: content.hero.marquee.applications,
    style: "outline-type font-medium",
  },
  { text: content.hero.marquee.with, style: "" },
  {
    text: content.hero.marquee.angular,
    style: "outline-type font-medium italic",
  },
  { text: content.hero.marquee.and, style: "" },
  { text: content.hero.marquee.vue, style: "font-bold" },
];

export function HeroMarquee() {
  return (
    <div className="flex w-full select-none" aria-hidden="true">
      {[0, 1, 2].map((copy) => (
        <div key={copy} className="flex shrink-0 animate-marquee">
          <p className="whitespace-nowrap font-display text-[13vw] font-light leading-none md:text-[7.5vw]">
            {parts.map((part) => (
              <span key={part.text} className={part.style}>
                {part.text}
              </span>
            ))}
            <span className="px-6 text-ash">
              {content.hero.marquee.separator}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
