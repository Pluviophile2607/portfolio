"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Paintbrush, Code2, Layout, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Grainient from "./grainient";
import Globe from "./globe";
import Silk from "./silk";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  index: number;
  image?: string;
  imageLayout?: 'top' | 'bottom' | 'left';
  gridRef: React.RefObject<HTMLDivElement | null>;
}

const BentoCard = ({ title, description, icon, className, index, image, gridRef }: BentoCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [globalData, setGlobalData] = useState({ 
    globalSize: { width: 1, height: 1 }, 
    cardOffset: { x: 0, y: 0 } 
  });

  useEffect(() => {
    if (!containerRef.current || !gridRef.current) return;
    
    const updateLayout = () => {
      if (!containerRef.current || !gridRef.current) return;
      const grid = gridRef.current;
      const card = containerRef.current;
      
      setGlobalData({
        globalSize: { 
          width: grid.offsetWidth || 1, 
          height: grid.offsetHeight || 1 
        },
        cardOffset: { x: card.offsetLeft, y: 0 }
      });
      setContainerWidth(card.offsetWidth);
    };

    updateLayout();
    
    const ro = new ResizeObserver(updateLayout);
    ro.observe(gridRef.current);
    window.addEventListener('resize', updateLayout);
    
    const timer = setTimeout(updateLayout, 100);
    return () => {
      window.removeEventListener('resize', updateLayout);
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [gridRef]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const preparedDesc = useMemo(() => {
    if (!mounted) return null;
    return prepareWithSegments(description, "bold 16px Inter, sans-serif");
  }, [description, mounted]);

  const preparedTitle = useMemo(() => {
    if (!mounted) return null;
    const fontSize = title === "What I Offer" ? "24px" : "20px";
    return prepareWithSegments(title, `bold ${fontSize} Inter, sans-serif`);
  }, [title, mounted]);

  const titleLayout = useMemo(() => {
    if (!mounted || !preparedTitle || containerWidth === 0) return null;
    return layoutWithLines(preparedTitle, containerWidth, 32);
  }, [preparedTitle, containerWidth, mounted]);

  const getEmoji = (title: string) => {
    switch (title) {
      case "UI/UX Design": return " 🎨";
      case "Web Development": return " 💻";
      case "Branding & Identity": return " 🌟";
      case "Prototyping": return " 🚀";
      default: return "";
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-[1.5rem] border border-white/10 p-6 flex flex-col min-h-[350px] md:min-h-[250px] backdrop-blur-xl",
        className
      )}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isMobile ? (
          <Silk
            speed={5}
            scale={1}
            color="#ffc300"
            noiseIntensity={1.5}
            rotation={0}
          />
        ) : (
          <Grainient
            color1="#EAB308"
            color2="#41366b"
            color3="#7C3AED"
            timeSpeed={1.05}
            colorBalance={-0.08}
            warpStrength={1}
            warpFrequency={5.9}
            warpSpeed={1.9}
            warpAmplitude={41}
            blendAngle={83}
            blendSoftness={0.11}
            rotationAmount={660}
            noiseScale={0.4}
            grainAmount={0.03}
            grainScale={2}
            grainAnimated={false}
            contrast={1.8}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={2.5}
            globalSize={globalData.globalSize}
            cardOffset={globalData.cardOffset}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col h-full">
        {icon && (
          <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 shadow-sm">
            {icon}
          </div>
        )}
        
        <div className="flex flex-col flex-grow">
          <h3 className={cn(
            "mb-3 tracking-tight text-white font-bold",
            title === "What I Offer" ? "text-3xl" : "text-2xl"
          )}>
            {title === "What I Offer" ? (
              <div className="flex items-center gap-2">
                <span>💼 What I <span className="text-blue-400">Offer</span></span>
              </div>
            ) : (
              <>
                {titleLayout ? titleLayout.lines.map((line: any, i: number) => (
                  <div key={i}>
                    {line.text}
                    {i === titleLayout.lines.length - 1 && getEmoji(title)}
                  </div>
                )) : title}
              </>
            )}
          </h3>
          <div 
            className="text-zinc-900 leading-relaxed text-base font-bold"
          >
            {description}
          </div>
        </div>

        {image && (
          <div className={cn(
            "flex mix-blend-screen opacity-80",
            "mt-4 justify-end h-24 sm:h-32"
          )}>
            <img 
              src={image} 
              alt={title} 
              className="max-h-full max-w-full object-contain" 
            />
          </div>
        )}

        {title === "What I Offer" && (
          <div className="absolute -bottom-12 sm:bottom-0 left-0 right-0 h-80 sm:h-96 flex items-center justify-center overflow-visible">
            <Globe />
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  image?: string;
  imageLayout?: 'top' | 'bottom' | 'left';
}

export function ServicesBento() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    if (!isMobile || !containerRef.current || !gridRef.current) return;

    const grid = gridRef.current;
    const scrollWidth = grid.scrollWidth;
    const windowWidth = window.innerWidth;
    const scrollAmount = scrollWidth - windowWidth + 48; // Adjust for horizontal padding

    const ctx = gsap.context(() => {
      gsap.to(grid, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => `+=${scrollWidth}`,
          invalidateOnRefresh: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  const services: Service[] = [
    {
      title: "UI/UX Design",
      description: "Crafting user-friendly and visually engaging interfaces that deliver exceptional experiences.",
      icon: <Paintbrush className="w-6 h-6 text-zinc-300" />,
      className: "md:col-span-2 md:row-span-2 w-[85vw] md:w-auto shrink-0",
    },
    {
      title: "Branding & Identity",
      description: "Designing cohesive and impactful brand identities to help you stand out.",
      icon: <Layout className="w-6 h-6 text-zinc-300" />,
      className: "md:col-span-2 md:row-span-2 md:col-start-3 w-[85vw] md:w-auto shrink-0",
    },
    {
      title: "What I Offer",
      description: "From intuitive UI/UX design to seamless website development, I create digital solutions tailored to your needs. Let's turn your ideas into impactful experiences!",
      icon: null,
      className: "md:col-span-2 md:row-span-4 md:col-start-5 min-h-[500px] md:min-h-0 w-[85vw] md:w-auto shrink-0",
    },
    {
      title: "Web Development",
      description: "Building responsive, high-performing websites with modern tools and technologies.",
      icon: <Code2 className="w-6 h-6 text-zinc-300" />,
      className: "md:col-span-2 md:row-span-2 md:row-start-3 w-[85vw] md:w-auto shrink-0",
    },
    {
      title: "Prototyping",
      description: "Turning ideas into interactive prototypes to visualize functionality and user flow effectively.",
      icon: <Sparkles className="w-6 h-6 text-zinc-300" />,
      className: "md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-3 w-[85vw] md:w-auto shrink-0",
    },
  ];

  return (
    <section ref={containerRef} className="bg-black relative overflow-hidden flex items-center min-h-[600px] md:min-h-0">
      <div className="mx-auto max-w-7xl px-6 w-full h-full flex items-center">
        <div 
          ref={gridRef} 
          className={cn(
            "gap-3 md:gap-4 transition-all w-full",
            isMobile ? "flex flex-nowrap" : "grid grid-cols-1 md:grid-cols-6 md:grid-rows-4 md:h-[650px]"
          )}
        >
          {services.map((service, index) => {
            const syncIndex = index > 2 ? index - 3 : index;
            return <BentoCard key={index} {...service} index={syncIndex} gridRef={gridRef} />;
          })}
        </div>
      </div>
    </section>
  );
}
