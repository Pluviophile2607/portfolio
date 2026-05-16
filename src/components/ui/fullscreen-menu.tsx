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
  { label: "Contact", href: "/contact", image: "https://cdn.designfast.io/image/2026-05-12/c82e986e-a9a9-4479-a8d4-e682a8373f9e.jpeg" },
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
      // First, clear any leftover inline styles from a previous close
      gsap.set(".menu-content-wrapper", { clearProps: "all" });
      gsap.set(".menu-link-item", { clearProps: "all" });

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
      // CLOSE Animation - stagger links out first
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
        delay: 0.2,
        onComplete: () => {
          // Clear all inline styles so next open is a clean slate
          gsap.set(".menu-content-wrapper", { clearProps: "all" });
          gsap.set(".menu-link-item", { clearProps: "all" });
        }
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
    // If it's an anchor link and we are on the homepage
    if (href.startsWith("/#") && pathname === "/") {
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
      lenis?.start();
    }
  };

  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith("/projects");
  const isContactPage = pathname === "/contact";
  const barColor = isOpen ? "bg-white" : (isProjectPage ? "bg-black" : "bg-white");
  const isHidden = showIntro || isLoading || isContactPage;

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
              className="fixed top-0 left-0 right-0 z-[110] px-6 md:px-12 pt-8 pb-8 flex justify-between items-center pointer-events-none"
            >
              <Link 
                href="/" 
                onClick={(e) => handleLinkClick(e, "/")}
                className="pointer-events-auto relative flex items-center group"
              >
                <span className="text-[#EAB308] text-2xl font-serif font-medium tracking-tight">
                  Prithvi Singh
                </span>
              </Link>

              <button 
                onClick={toggleMenu}
                className="pointer-events-auto group relative w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
              >
                <div className="relative w-8 h-8 flex flex-col items-center justify-center">
                  <span className={cn(
                    "absolute w-8 h-[1px] transition-all duration-500",
                    barColor,
                    isOpen ? "rotate-45" : "-translate-y-1.5"
                  )} />
                  <span className={cn(
                    "absolute w-8 h-[1px] transition-all duration-500",
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
                "fixed inset-0 z-[100] bg-black flex flex-col md:flex-row",
                isOpen ? "pointer-events-auto" : "pointer-events-none"
              )}
              style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            >
              <div className="menu-content-wrapper flex flex-col md:flex-row w-full h-full">
                {/* Left Side: Globe */}
                <div className="hidden md:flex flex-1 items-center justify-center bg-black border-r border-white/10 overflow-hidden">
                  <div className="relative w-[85%] aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 bg-radial-gradient from-[#EAB308]/5 to-transparent opacity-30" />
                    <Globe />
                  </div>
                </div>

                {/* Right Side: Links */}
                <div className="flex-1 flex flex-col justify-between p-8 md:px-24 md:pt-20 md:pb-10 bg-[#0c0c0c]">
                  {/* Top: Navigation */}
                  <div className="flex-1 md:flex-none flex flex-col items-center justify-center md:items-start md:justify-start text-center md:text-left">
                    <p className="text-[#3f3f46] text-[10px] md:text-xs font-serif uppercase tracking-[0.6em] mb-10">Navigation</p>
                    <div className="space-y-2">
                      {NAV_LINKS.map((link) => (
                        <div key={link.label} className="overflow-hidden">
                          <Link 
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className="menu-link-item block text-4xl md:text-[5.5rem] font-serif text-[#f4f4f5] hover:text-[#EAB308] transition-all duration-500 leading-[0.85] tracking-tight text-center md:text-left"
                          >
                            {link.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Contact */}
                  <div className="space-y-4">
                    <p className="text-[#3f3f46] text-[10px] md:text-xs font-serif uppercase tracking-[0.4em]">Get in touch</p>
                    <a href="mailto:prithvisingh1521@gmail.com" className="text-[#f4f4f5] text-sm hover:text-[#EAB308] transition-colors font-mono tracking-tight font-medium">
                      prithvisingh1521@gmail.com
                    </a>
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
