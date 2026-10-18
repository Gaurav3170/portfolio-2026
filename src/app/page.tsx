import { experiences } from "@/data/career";
import { Contact } from "@/components/Chapters/Contact";
import { ExperienceChapter } from "@/components/Chapters/ExperienceChapter";
import { Intro } from "@/components/Chapters/Intro";
import { JourneyBackdrop } from "@/components/Journey/JourneyBackdrop";
import { ScrollDriver } from "@/components/Journey/ScrollDriver";
import { ChapterRail } from "@/components/Navigation/ChapterRail";
import { Navigation } from "@/components/Navigation/Navigation";
import styles from "./page.module.scss";

/**
 * Server component. All career content renders as static HTML; the 3D backdrop
 * and scroll driver are small client islands layered around it.
 */
export default function HomePage() {
  return (
    <>
      <JourneyBackdrop />
      <ScrollDriver />
      <Navigation />
      <ChapterRail />
      <main id="journey" className={styles.journey}>
        <Intro />
        {experiences.map((experience, index) => (
          <ExperienceChapter
            key={experience.id}
            experience={experience}
            index={String(index + 1).padStart(2, "0")}
            variant={experience.sceneId === "beginning" ? "beginning" : "default"}
          />
        ))}
        {/* TODO(projects): render <Projects /> here; add its chapter in data/career.ts. */}
        <Contact />
      </main>
    </>
  );
}
