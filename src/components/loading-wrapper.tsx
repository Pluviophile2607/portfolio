"use client";

import { useEffect } from "react";
import { useLoading } from "@/context/loading-context";
import { Intro } from "@/components/intro";
import { Preloader } from "@/components/preloader";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const { 
    showIntro, 
    isLoading, 
    setShowIntro, 
    setIsLoading, 
    setHasLoadedGlobal 
  } = useLoading();
  const lenis = useLenis();

  useEffect(() => {
    if (showIntro || isLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      lenis?.start();
      
      // Force a resize/refresh to ensure Lenis recalculates page height
      setTimeout(() => {
        lenis?.resize();
        window.dispatchEvent(new Event("resize"));
      }, 500);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      lenis?.start();
    };
  }, [showIntro, isLoading, lenis]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    setHasLoadedGlobal(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <Intro key="intro" onEnter={handleIntroComplete} />
        )}
        
        {!showIntro && isLoading && (
          <Preloader key="preloader" onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
