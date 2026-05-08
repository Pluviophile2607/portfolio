"use client"

import { useState } from "react";
import CardNav from "@/components/ui/card-nav";
import { VideoScrollHero } from "@/components/ui/video-scroll-hero";
import { ProjectCards } from "@/components/ui/project-cards";
import { ServicesBento } from "@/components/ui/services-bento";
import { NewGridSection } from "@/components/ui/new-grid-section";
import { Preloader } from "@/components/preloader";
import { Intro } from "@/components/intro";
import { FloatingConsultButton } from "@/components/ui/floating-consult-button";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // The hero section is sticky for 1500px.
    // It starts moving up out of the viewport after 1500px.
    // We show the button when the hero has moved up by 40% of the viewport height.
    if (typeof window !== "undefined") {
      const threshold = 1500 + window.innerHeight * 0.4;
      setShowFloatingButton(latest > threshold);
    }
  });

  const items = [
    {
      label: "About",
      bgColor: "#1B1722",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company", href: "#" },
        { label: "Careers", ariaLabel: "About Careers", href: "#" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#2F293A",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects", href: "#" },
        { label: "Case Studies", ariaLabel: "Project Case Studies", href: "#" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#2F293A", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us", href: "#" },
        { label: "Twitter", ariaLabel: "Twitter", href: "#" },
        { label: "LinkedIn", ariaLabel: "LinkedIn", href: "#" }
      ]
    }
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <Intro key="intro" onEnter={() => setShowIntro(false)} />
        )}
        
        {!showIntro && isLoading && (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        className="bg-black w-full overflow-clip"
      >
        {/* Navbar — fixed above everything */}
        <CardNav
          logo="/logo.png"
          logoAlt="Prithvi Singh Logo"
          items={items}
          baseColor="#000"
          menuColor="#fff"
          buttonBgColor="#fff"
          buttonTextColor="#000"
          ease="power3.out"
        />

        {/* Scroll-scale hero video */}
        <VideoScrollHero
          videoSrc="/herosection-video-1.mp4"
          scrollHeight={1500}
          initialClipPercentage={20}
          finalClipPercentage={80}
        />

        {/* New Cards Section */}
        <ProjectCards />

          {/* Services Section Badge */}
          <section className="relative w-full z-10 bg-black pb-24 flex flex-col items-center">
            <LiquidMetalButton label="Services" />
            <p className="text-white/40 text-xs md:text-sm mt-6 uppercase tracking-[0.4em] font-light">
              Crafting Digital Excellence
            </p>
          </section>

          <ServicesBento />
          <NewGridSection />

          {/* Floating Action Button */}
          <FloatingConsultButton 
            isVisible={showFloatingButton}
            popupHeading="Start a Project"
            popupDescription="Let's build something amazing together. Schedule a free consultation."
            ctaButtonText="Book Now"
            revolvingText="GET IN TOUCH - LET'S TALK - FREE CONSULT - "
            imageSrc="https://cdn.designfast.io/image/2026-05-05/16257b17-2e65-438f-90e9-af38e1cd89c2.png"
          />
      </motion.main>
    </>
  )
}

