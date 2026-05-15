"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useLenis } from "lenis/react";

const NAV_LINKS = [
  { label: "Home", href: "/", image: "https://cdn.designfast.io/image/2026-05-12/68fe2048-7a5e-4d55-93f0-afa87ac6cac8.jpeg" },
  { label: "Projects", href: "/#projects", image: "https://cdn.designfast.io/image/2026-05-12/65c81e50-890b-493e-87e0-9e30235ebd8b.jpeg" },
  { label: "Services", href: "/#services", image: "https://cdn.designfast.io/image/2026-05-12/b3422204-bfdf-4e52-a78c-1c2a0c30dfdb.jpeg" },
  { label: "Contact", href: "mailto:prithvisingh1521@gmail.com", image: "https://cdn.designfast.io/image/2026-05-12/c82e986e-a9a9-4479-a8d4-e682a8373f9e.jpeg" },
];

import { useLoading } from "@/context/loading-context";
import Globe from "./globe";

export function FullscreenMenu({ children }: { children: React.ReactNode }) {
  const { showIntro, isLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  
  // Custom easing "hop" (cubic-bezier approximation)
  const hopEase = "cubic-bezier(0.76, 0, 0.24, 1)";

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      // OPEN Animation
      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.4,
        ease: "expo.inOut"
      });

      // Scale content slightly for depth
      gsap.fromTo(".menu-content-wrapper",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: "expo.out", delay: 0.2 }
      );

      // Stagger link animations
      gsap.fromTo(".menu-link-item", 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power4.out", delay: 0.6 }
      );
    } else {
      // CLOSE Animation
      // Stagger links out first for a smoother transition
      gsap.to(".menu-link-item", {
        y: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.in"
      });

      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.4,
        ease: "expo.inOut",
        delay: 0.2 // Slight delay to let links start their animation
      });
      
      gsap.to(".menu-content-wrapper", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.inOut"
      });
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // If it's an anchor link on the same page
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      setIsOpen(false);
      
      // Faster Close Animation for navigation
      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.8,
        ease: "expo.inOut"
      });

      gsap.to(".menu-content-wrapper", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "expo.inOut"
      });

      // Start scrolling immediately
      setTimeout(() => {
        lenis?.scrollTo(`#${targetId}`, { offset: -80 });
      }, 100);
    } else {
      setIsOpen(false);
      // Explicitly start lenis when navigating to other pages
      lenis?.start();
    }
  };

  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith("/projects");
  const barColor = isOpen ? "bg-white" : (isProjectPage ? "bg-black" : "bg-white");
  const isHidden = showIntro || isLoading;

  return (
    <div ref={containerRef} className="relative w-full">
      <AnimatePresence>
        {!isHidden && (
          <>
            {/* Header / Navbar */}
            <motion.nav 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 z-[110] px-6 md:px-12 pt-2 pb-8 flex justify-between items-center pointer-events-none"
            >
              <Link 
                href="/" 
                onClick={(e) => handleLinkClick(e, "/")}
                className="pointer-events-auto relative flex items-center group"
              >
                <div className={cn(
                  "relative w-32 h-12 opacity-90 group-hover:opacity-100 transition-opacity",
                  isProjectPage && !isOpen ? "invert" : ""
                )}>
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    priority
                    sizes="128px"
                    className="object-contain"
                  />
                </div>
              </Link>

              <button 
                onClick={toggleMenu}
                className="pointer-events-auto group relative w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
              >
                <div className="relative w-8 h-8 flex flex-col items-center justify-center">
                  <span className={cn(
                    "absolute w-6 h-0.5 transition-all duration-500",
                    barColor,
                    isOpen ? "rotate-45" : "-translate-y-1.5"
                  )} />
                  <span className={cn(
                    "absolute w-6 h-0.5 transition-all duration-500",
                    barColor,
                    isOpen ? "-rotate-45" : "translate-y-1.5"
                  )} />
                </div>
              </button>
            </motion.nav>

            {/* Menu Overlay */}
            <div 
              ref={menuRef}
              className={cn(
                "fixed inset-0 z-[100] bg-[#111] flex flex-col md:flex-row",
                isOpen ? "pointer-events-auto" : "pointer-events-none"
              )}
              style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            >
              <div className="menu-content-wrapper flex flex-col md:flex-row w-full h-full">
                {/* Left Side: Globe (Dynamic Media) */}
                <div className="hidden md:flex flex-[1.2] items-center justify-center p-12 bg-[#080808] border-r border-white/5">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Globe />
                  </div>
                </div>

                {/* Right Side: Links (Text Content) */}
                <div className="flex-1 flex flex-col justify-center p-8 md:p-20 bg-[#111]">
                <div className="space-y-1 md:space-y-2">
                  <p className="text-white/30 text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-8">Navigation</p>
                  {NAV_LINKS.map((link) => (
                    <div key={link.label} className="overflow-hidden">
                      <Link 
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="menu-link-item block text-4xl md:text-7xl font-medium text-white hover:italic transition-all duration-300 hover:pl-4 leading-[0.9]"
                      >
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-16 md:mt-32 flex flex-col md:flex-row gap-8 md:gap-24">
                  <div>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Social</p>
                    <div className="flex gap-6">
                      {["TW", "IN", "LI"].map(s => (
                        <a key={s} href="#" className="text-white hover:text-white/50 transition-colors font-mono">{s}</a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Get in touch</p>
                    <a href="mailto:prithvisingh1521@gmail.com" className="text-white hover:text-white/50 transition-colors font-mono">prithvisingh1521@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        )}
      </AnimatePresence>

      {/* Main Content Wrapper - No longer pushed to avoid breaking sticky elements */}
      <div className="relative w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}

// Helper for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
