"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { LiquidMetalButton } from "./liquid-metal-button";

interface Project {
  id: number;
  title: string;
  image: string;
  category: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Tera Mera",
    image: "/cards-img/4.jpg",
    category: "Web Site"
  },
  {
    id: 2,
    title: "ZED NGO",
    image: "/cards-img/5.jpg",
    category: "Web Site"
  },
  {
    id: 3,
    title: "Swastik Power Project",
    image: "/cards-img/6.jpg",
    category: "Web Site"
  },
  {
    id: 4,
    title: "Aiz-Boostr",
    image: "/cards-img/7.jpg",
    category: "Web Site"
  },
  {
    id: 5,
    title: "Adhyan Academy",
    image: "/cards-img/8.jpg",
    category: "Web Site"
  }
];

export function ProjectCards() {
  const marqueeProjects = [...projects, ...projects, ...projects];
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Base speed for the marquee
  const baseSpeed = -0.5; 
  const isDragging = useRef(false);

  useAnimationFrame(() => {
    if (isDragging.current) return;

    const currentX = x.get();
    let newX = currentX + baseSpeed;

    // Reset position for infinite loop
    // We have 3 sets of projects, we loop when we reach the end of the first set
    const trackWidth = trackRef.current?.offsetWidth || 0;
    const singleSetWidth = trackWidth / 3;

    if (newX <= -singleSetWidth) {
      newX += singleSetWidth;
    } else if (newX > 0) {
      newX -= singleSetWidth;
    }

    x.set(newX);
  });

  return (
    <section className="bg-black pt-8 pb-24 overflow-hidden relative">
      {/* Header Button */}
      <div className="w-full flex justify-center mb-8 relative z-20">
        <LiquidMetalButton label="Projects" />
      </div>

      {/* Side Blur Gradients */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="relative flex cursor-grab active:cursor-grabbing" ref={containerRef}>
        <motion.div
          ref={trackRef}
          className="flex gap-8 px-4"
          style={{ x }}
          drag="x"
          onDragStart={() => (isDragging.current = true)}
          onDragEnd={() => {
            isDragging.current = false;
            // Ensure we don't get stuck far away
            const currentX = x.get();
            const trackWidth = trackRef.current?.offsetWidth || 0;
            const singleSetWidth = trackWidth / 3;
            if (currentX <= -singleSetWidth) {
              x.set(currentX % singleSetWidth);
            } else if (currentX > 0) {
              x.set((currentX % singleSetWidth) - singleSetWidth);
            }
          }}
        >
          {marqueeProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="group pointer-events-none flex-shrink-0 w-[320px] md:w-[600px]"
            >
              <div className="relative aspect-[1672/941] rounded-[2rem] overflow-hidden bg-[#111] p-3 border border-white/5 shadow-2xl transition-all duration-500 group-hover:border-white/10 group-hover:bg-[#151515]">
                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-[#1a1a1a]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 320px, 600px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-5 flex items-center justify-between px-3">
                <div>
                  <h3 className="text-white text-lg md:text-xl font-medium tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/40 text-xs md:text-sm mt-1 uppercase tracking-widest font-mono">
                    {project.category}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:border-white">
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white transition-colors duration-500 group-hover:text-black" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
