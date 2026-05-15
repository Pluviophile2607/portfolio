"use client";

import React, { useRef } from "react";
import { Paintbrush, Code2, Layout, Sparkles } from "lucide-react";
import LightPillar from "./LightPillar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ScrollReveal from "./ScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactElement<{ className?: string }> | null;
  index: number;
  image?: string;
  bgColor: string;
  textColor: string;
  number: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  image,
  bgColor,
  textColor,
  number,
}: ServiceCardProps) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      // Added `will-change-transform` for GPU hardware acceleration to eliminate scroll stutter
      className="service-card group relative overflow-hidden rounded-[1px] p-6 md:p-10 w-[94%] md:w-full mx-auto min-h-[500px] md:min-h-[500px] lg:min-h-[600px] flex flex-col justify-between shadow-2xl scale-[0.98] md:scale-100 will-change-transform"
    >
      {/* Dark overlay — fades in via GSAP */}
      <div className="card-overlay absolute inset-0 bg-black rounded-[1px] opacity-0 pointer-events-none z-20" />

      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 z-10 relative">
        <h3
          className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.8] uppercase text-center md:text-left max-w-full md:max-w-[70%]"
          style={{ color: textColor }}
        >
          {title}
        </h3>
        <div className="shrink-0 opacity-80" style={{ color: textColor }}>
          {icon ? (
            React.cloneElement(icon, {
              className: "w-8 h-8 md:w-10 md:h-10",
            })
          ) : (
            <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
          )}
        </div>
      </div>

      {/* Middle/Right Section */}
      <div className="flex flex-col md:flex-row justify-center md:justify-end items-center gap-6 md:gap-10 z-10 my-8 md:my-0">
        <span
          className="text-6xl md:text-7xl lg:text-[8rem] font-medium tracking-tighter opacity-90 leading-none"
          style={{ color: textColor }}
        >
          ({number})
        </span>

        {image && (
          <div className="service-media w-32 md:w-48 lg:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform rotate-3 md:rotate-6 transition-all duration-700 ease-out shrink-0">
            <img
              src={image}
              alt={title}
              className="service-media-img w-full h-full object-cover transition-all duration-700"
            />
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="max-w-full md:max-w-[450px] mx-auto md:mx-0 z-10">
        <p
          className="text-base md:text-lg font-medium leading-tight text-center md:text-left"
          style={{ color: textColor }}
        >
          {description.split(" ").map((word, i) => (
            <span
              key={i}
              className="service-desc-word inline-block opacity-20 md:opacity-10 mr-[0.25em] will-change-[opacity]"
            >
              {word}
            </span>
          ))}
        </p>
      </div>

      {/* Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-100" />
      </div>
    </div>
  );
};

export function ServicesBento() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const wrappers = gsap.utils.toArray<HTMLElement>(
        ".card-wrapper",
        containerRef.current
      );

      wrappers.forEach((wrapper, i) => {
        const isLast = i === wrappers.length - 1;
        const card = wrapper.querySelector(".service-card");
        if (!card) return;
        const overlay = wrapper.querySelector(".card-overlay");

        // 1. Pinning the Cards
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top", 
          end: isLast ? "+=100%" : "bottom top", 
          pin: card,
          pinSpacing: isLast,
          id: `pin-${i}`,
        });

        // 2. Word Reveal Scrub
        const words = card.querySelectorAll(".service-desc-word");
        if (words.length > 0) {
          gsap.to(words, {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: "center center", 
              scrub: true,
            },
          });
        }

        if (!isLast) {
          // 3. Smooth Animating Transitions via Timeline
          const nextWrapper = wrappers[i + 1];
          const rotationDir = i % 2 === 0 ? -4 : 4; 

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: nextWrapper,
              // Start shrinking only as the next card actually starts overlapping
              start: "top bottom", 
              end: "top top",
              scrub: 0.5, 
            },
          });

          tl.to(card, {
            scale: 0.88, // slightly softer scale
            rotation: rotationDir,
            transformOrigin: "top center",
            // Hide the card completely on mobile as the next one covers it
            opacity: window.innerWidth < 768 ? 0 : 1,
            // power2.inOut makes the movement organic. It eases into the shrink and eases into the final resting place.
            ease: "power2.inOut", 
          }, 0); 

          if (overlay) {
            tl.to(overlay, {
              opacity: 0.75,
              ease: "power2.inOut",
            }, 0); 
          }
        }
      });

      // Refresh ScrollTrigger after images load
      const images = containerRef.current.querySelectorAll("img");
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        ScrollTrigger.refresh();
      } else {
        const tryRefresh = () => {
          loadedCount++;
          if (loadedCount >= totalImages) ScrollTrigger.refresh();
        };

        images.forEach((img) => {
          if (img.complete) {
            tryRefresh();
          } else {
            img.addEventListener("load", tryRefresh, { once: true });
            img.addEventListener("error", tryRefresh, { once: true });
          }
        });
      }
    },
    { scope: containerRef }
  );

  const services = [
    {
      title: "UI/UX DESIGN",
      description:
        "Crafting user-friendly and visually engaging interfaces that deliver exceptional experiences through deep user research and modern design principles.",
      icon: <Paintbrush />,
      image: "https://cdn.designfast.io/image/2026-05-15/f8804da4-fddc-4bee-bd0e-fda019a5afb5.jpeg",
      bgColor: "#A3E635",
      textColor: "#1A3001",
      number: "01",
    },
    {
      title: "DEVELOPMENT",
      description:
        "Building responsive, high-performing websites with modern tools and technologies like React, Next.js, and Framer Motion.",
      icon: <Code2 />,
      image: "https://cdn.designfast.io/image/2026-05-15/5ebb17b2-ac17-4934-984f-98995bd1d0bd.jpeg",
      bgColor: "#FB923C",
      textColor: "#431407",
      number: "02",
    },
    {
      title: "PROTOTYPING",
      description:
        "Turning ideas into interactive prototypes to visualize functionality and user flow effectively before moving into full-scale development.",
      icon: <Sparkles />,
      image: "https://cdn.designfast.io/image/2026-05-15/2844cec8-8df0-41c5-8d78-786af7450f9b.jpeg",
      bgColor: "#C084FC",
      textColor: "#2E1065",
      number: "03",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="bg-black relative overflow-visible pt-0 pb-0 md:pb-0 z-10"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={0.35}
          rotationSpeed={0.04}
          glowAmount={0.001}
          pillarWidth={5.0}
          pillarHeight={0.15}
          noiseIntensity={0.2}
          pillarRotation={0}
          interactive={false}
          mixBlendMode="screen"
        />
      </div>

      <div className="w-full px-0 relative z-10 flex flex-col">
        {services.map((service, index) => {
          const isLast = index === services.length - 1;
          return (
          <div
            key={service.number}
            className={`card-wrapper w-full flex items-start justify-center px-2 md:px-4 pt-[12vh] md:pt-0 ${
              isLast ? "h-auto pb-4 md:pb-8" : "h-[140vh] md:h-[180vh]"
            }`}
            style={{ zIndex: index + 1 }}
          >
            <ServiceCard {...service} index={index} />
          </div>
        )})}
      </div>
    </section>
  );
}
