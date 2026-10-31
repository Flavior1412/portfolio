import { Section } from "@/shared/components/ui/Section";
import content from "@/shared/data/content.json";

/** Portfolio contact details with direct email and phone links. */
export function ContactSection({
  profile,
}: {
  profile: { email: string; phone: string };
}) {
  return (
    <Section id="contact" variant="interactive">
      <div className="folio-container folio-section-space flex min-h-screen flex-col justify-center">
        <h2 className="font-display text-[13vw] font-light leading-[1.05] md:text-[6vw]">
          <span className="block">{content.contact.heading.opening}</span>
          <span className="block font-bold">
            {content.contact.heading.closing}
          </span>
        </h2>
        <div className="mt-12 md:mt-14">
          <a
            href={`mailto:${profile.email}`}
            className="inline-block break-all font-display text-xl underline underline-offset-8 md:text-3xl"
          >
            {profile.email}
          </a>
          <p className="folio-muted mt-4 font-display text-lg md:text-xl">
            <a href={`tel:${profile.phone}`}>{profile.phone}</a>
          </p>
          <p className="folio-copy folio-muted mt-6 max-w-xl">
            {content.contact.description}
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 font-display text-sm uppercase tracking-[0.15em] text-ash transition-colors duration-700 group-hover/section:text-bone/70 md:mt-14">
          <a href={content.contact.zaloHref}>{content.contact.zalo}</a>
          <a href={content.contact.linkedinHref}>
            {content.contact.linkedin}
          </a>
          <a href={content.contact.resumeHref}>{content.contact.resume}</a>
        </div>
      </div>
    </Section>
  );
}
