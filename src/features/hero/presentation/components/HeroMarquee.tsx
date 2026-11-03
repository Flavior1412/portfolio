import content from "@/shared/data/content.json";
import styles from "./HeroMarquee.module.css";

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

const marqueeCopy = `${parts.map((part) => part.text).join("")}${content.hero.marquee.separator}`;

export function HeroMarquee() {
  return (
    <div
      className="flex w-full select-none"
      aria-hidden="true"
      data-nosnippet="true"
    >
      <div
        className={styles.track}
        data-copy={marqueeCopy}
        data-testid="hero-marquee-copy"
      >
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
    </div>
  );
}
