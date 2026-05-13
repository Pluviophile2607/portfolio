"use client";

import React, { useRef } from "react";
import { Paintbrush, Code2, Layout, Sparkles } from "lucide-react";
import LightPillar from "./LightPillar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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
      className="service-card group relative overflow-hidden rounded-[1px] p-5 md:p-10 w-full min-h-[380px] md:min-h-[500px] lg:min-h-[600px] flex flex-col justify-between shadow-2xl will-change-transform"
    >
      {/* Dark overlay — fades in via GSAP */}
      <div className="card-overlay absolute inset-0 bg-black rounded-[1px] opacity-0 pointer-events-none z-20" />

      {/* Top Section */}
      <div className="flex justify-between items-start z-10 relative">
        <h3
          className="text-3xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.8] uppercase max-w-[80%] md:max-w-[70%]"
          style={{ color: textColor }}
        >
          {title}
        </h3>
        <div className="shrink-0 opacity-80" style={{ color: textColor }}>
          {icon ? (
            React.cloneElement(icon, {
              className: "w-6 h-6 md:w-10 md:h-10",
            })
          ) : (
            <Sparkles className="w-6 h-6 md:w-10 md:h-10" />
          )}
        </div>
      </div>

      {/* Middle/Right Section */}
      <div className="flex justify-end items-center gap-4 md:gap-10 z-10 my-4 md:my-0">
        <span
          className="text-4xl md:text-7xl lg:text-[8rem] font-medium tracking-tighter opacity-90 leading-none"
          style={{ color: textColor }}
        >
          ({number})
        </span>

        {image && (
          <div className="service-media w-24 md:w-48 lg:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transform rotate-2 group-hover:rotate-0 transition-all duration-700 ease-out shrink-0">
            <img
              src={image}
              alt={title}
              className="service-media-img w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-all duration-700"
            />
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="max-w-[320px] md:max-w-[450px] z-10">
        <p
          className="text-sm md:text-lg font-medium leading-tight opacity-80"
          style={{ color: textColor }}
        >
          {description}
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
        const overlay = wrapper.querySelector(".card-overlay");

        // 1. Pinning the Cards (Including the last one for a smooth transition to next section)
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          id: `pin-${i}`,
        });

        if (!isLast) {
          // 2. Smooth Animating Transitions via Timeline
          const nextWrapper = wrappers[i + 1];
          const rotationDir = i % 2 === 0 ? -4 : 4; 

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: nextWrapper,
              start: "top bottom",
              end: "top top",
              // Tighter scrub: 0.5 feels responsive but not laggy. It settles quickly after scroll release.
              scrub: 0.5, 
            },
          });

          tl.to(card, {
            scale: 0.88, // slightly softer scale
            rotation: rotationDir,
            transformOrigin: "top center",
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
      image: "/assets/services/ui-ux.png",
      bgColor: "#A3E635",
      textColor: "#1A3001",
      number: "01",
    },
    {
      title: "BRANDING",
      description:
        "Designing cohesive and impactful brand identities to help you stand out in a crowded market, ensuring consistency across all touchpoints.",
      icon: <Layout />,
      image: "/assets/services/branding.png",
      bgColor: "#60A5FA",
      textColor: "#082F49",
      number: "02",
    },
    {
      title: "COLLABORATION",
      description:
        "From intuitive UI/UX design to seamless website development, I create digital solutions tailored to your specific business needs and goals.",
      icon: null,
      image: "/assets/services/collaboration.png",
      bgColor: "#111111",
      textColor: "#FFFFFF",
      number: "03",
    },
    {
      title: "DEVELOPMENT",
      description:
        "Building responsive, high-performing websites with modern tools and technologies like React, Next.js, and Framer Motion.",
      icon: <Code2 />,
      image: "/assets/services/web-dev.png",
      bgColor: "#FB923C",
      textColor: "#431407",
      number: "04",
    },
    {
      title: "PROTOTYPING",
      description:
        "Turning ideas into interactive prototypes to visualize functionality and user flow effectively before moving into full-scale development.",
      icon: <Sparkles />,
      image: "/assets/services/prototyping.png",
      bgColor: "#C084FC",
      textColor: "#2E1065",
      number: "05",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="bg-black relative overflow-visible pt-0 pb-10 md:pb-32 z-10"
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
        {services.map((service, index) => (
          <div
            key={service.number}
            className="card-wrapper w-full h-[90vh] md:h-screen flex items-center justify-center p-2 md:p-4"
            style={{ zIndex: index + 1 }}
          >
            <ServiceCard {...service} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}