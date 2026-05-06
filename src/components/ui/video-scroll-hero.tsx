"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

import { SparklesText } from "@/components/ui/sparkles-text";

interface VideoScrollHeroProps {
  videoSrc?: string;
  scrollHeight?: number;
  initialClipPercentage?: number;
  finalClipPercentage?: number;
  className?: string;
}

export function VideoScrollHero({
  videoSrc = "/herosection-video-1.mp4",
  scrollHeight = 1500,
  initialClipPercentage = 20,
  finalClipPercentage = 80,
  className = "",
}: VideoScrollHeroProps) {
  const { scrollY } = useScroll();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Clip corners animate from inset → 0% / 100%
  const clipStart = useTransform(
    scrollY,
    [0, scrollHeight],
    [initialClipPercentage, 0]
  );
  const clipEnd = useTransform(
    scrollY,
    [0, scrollHeight],
    [finalClipPercentage, 100]
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest >= scrollHeight * 0.90) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  });

  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  return (
    <div
      style={{ height: `calc(${scrollHeight}px + 100vh)` }}
      className={`relative w-full ${className}`}
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{ clipPath, willChange: "clip-path" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/20" />

        <AnimatePresence>
          {isFullScreen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute bottom-8 left-8 md:bottom-12 md:left-12 right-8 md:right-12 z-20 pointer-events-auto flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12"
            >
              <div>
                <p className="-mb-1 md:-mb-2 lg:-mb-3 text-4xl md:text-6xl lg:text-7xl font-light leading-none text-white/90">
                  I&apos;m
                </p>
                <SparklesText 
                  text="Prithvi Singh" 
                  className="text-4xl md:text-[5rem] lg:text-[6.5rem] text-white tracking-tight leading-none" 
                  sparklesCount={5}
                />
              </div>
              <div className="md:text-right max-w-xl">
                <div className="text-xl md:text-3xl lg:text-4xl text-white/70 font-light pb-1 md:pb-2 lg:pb-3">
                  Developer
                </div>
                <p className="text-sm md:text-lg text-white font-light leading-[1.6] md:ml-auto">
                  Blending code and design to build unique digital experiences. <br /> Let&apos;s turn your ideas into reality!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

