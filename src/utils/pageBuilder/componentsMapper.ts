import AboutMe from "@/sections/aboutMe/index.astro";
import AboutBanner from "@/sections/aboutBanner/index.astro";
import CertificatesGrid from "@/sections/certificatesGrid/index.astro";
import CertificatesGallery from "@/sections/certificatesGallery/index.astro";
import CurrentFocus from "@/sections/currentFocus/index.astro";
import ExperienceTimeline from "@/sections/experienceTimeline/index.astro";
import Hero from "@/sections/hero/index.astro";
import ProjectsShowcase from "@/sections/projectsShowcase/index.astro";
import RichTextSection from "@/sections/richTextSection/index.astro";
import Subhero from "@/sections/subhero/index.astro";
import TechnologiesOverview from "@/sections/technologiesOverview/index.astro";
import TechnologiesStack from "@/sections/technologiesStack/index.astro";

export const componentsMapper = {
    aboutMe: AboutMe,
    aboutBanner: AboutBanner,
    certificatesGrid: CertificatesGrid,
    certificatesGallery: CertificatesGallery,
    currentFocus: CurrentFocus,
    experienceTimeline: ExperienceTimeline,
    hero: Hero,
    projectsShowcase: ProjectsShowcase,
    richTextSection: RichTextSection,
    subhero: Subhero,
    technologiesOverview: TechnologiesOverview,
    technologiesStack: TechnologiesStack,
} as const;
