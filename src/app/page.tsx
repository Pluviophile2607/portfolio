"use client"

import { useState } from "react";
import { VideoScrollHero } from "@/components/ui/video-scroll-hero";
import { ProjectCards } from "@/components/ui/project-cards";
import { ServicesBento } from "@/components/ui/services-bento";
import { NewGridSection } from "@/components/ui/new-grid-section";
import { FloatingConsultButton } from "@/components/ui/floating-consult-button";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { useLoading } from "@/context/loading-context";

export default function Home() {
  const { 
    showIntro, 
    isLoading, 
    setShowIntro, 
    setIsLoading, 
    setHasLoadedGlobal 
  } = useLoading();
  
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    setHasLoadedGlobal(true);
  };

  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window !== "undefined") {
      const threshold = 1500 + window.innerHeight * 0.4;
      setShowFloatingButton(latest > threshold);
    }
  });

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
      className="bg-black w-full overflow-clip"
    >
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
  )
}
