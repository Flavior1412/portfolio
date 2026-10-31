import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { HeroSection } from "@/features/hero";
import { TimelineSection } from "@/features/timeline";
import { SkillsSection } from "@/features/skills";
import { ContactSection } from "@/features/contact";
import { AboutSection } from "@/features/about";
import { PrinciplesSection } from "@/features/principles";
import { WorkSection } from "@/features/work";
import { ScrollExperience } from "@/shared/components/motion/ScrollExperience";

import { getPortfolio } from "./_composition/portfolio";

/** Single-page career portfolio. */
export default function Home() {
  const {
    profile,
    employment,
    heroCaptions,
    milestones,
    projects,
    skills,
    skillCategories,
  } = getPortfolio();
  return (
    <>
      <ScrollExperience />
      <Navbar name={profile.name} email={profile.email} />
      <main id="main-content" className="relative">
        <HeroSection profile={profile} heroCaptions={heroCaptions} />
        <PrinciplesSection />
        <div id="about-scroll-start" aria-hidden="true" />
        <AboutSection profile={profile} employment={employment} />
        <TimelineSection milestones={milestones} />
        <WorkSection projects={projects} />
        <SkillsSection skills={skills} skillCategories={skillCategories} />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} email={profile.email} />
    </>
  );
}
