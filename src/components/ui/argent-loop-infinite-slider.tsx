"use client";

import * as React from "react";
import "./argent-loop-infinite-slider.css";

interface ProjectData {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
}

const PROJECT_DATA: ProjectData[] = [
  {
    title: "Redroom Gesture 14",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    category: "Concept Series",
    year: "2025",
    description: "Expressive motion study",
  },
  {
    title: "Shadowwear 6AM",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    category: "Photography",
    year: "2024",
    description: "Urban portrait series",
  },
  {
    title: "Blur Formation 03",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop",
    category: "Kinetic Study",
    year: "2024",
    description: "Motion blur experiment",
  },
  {
    title: "Sunglass Operator",
    image:
      "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=1887&auto=format&fit=crop",
    category: "Editorial Motion",
    year: "2023",
    description: "Fashion editorial piece",
  },
  {
    title: "Azure Figure 5",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1896&auto=format&fit=crop",
    category: "Visual Research",
    year: "2024",
    description: "Color theory exploration",
  },
];

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

// Utility functions
const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const getProjectData = (index: number) => {
  return PROJECT_DATA[index];
};

const getProjectNumber = (index: number) => {
  return (index + 1).toString().padStart(2, "0");
};

export function ArgentLoopSlider() {
  // Refs for state that changes frequently (animation loop)
  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0, // Will be set on mount
    minimapHeight: 250, // Fixed height from CSS
  });

  // Refs to store DOM elements
  const containerRef = React.useRef<HTMLDivElement>(null);
  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const requestRef = React.useRef<number | undefined>(undefined);

  // Helper to update parallax for a single item
  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number
  ) => {
    if (!img) return;
    
    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }
    
    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.2;
    current = lerp(current, target, 0.1);
    
    // Optimization: only update if changed significantly
    if (Math.abs(current - target) > 0.01) {
        img.style.transform = `translateY(${current}px) scale(1.5)`;
        img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY =
      s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  };

  const updatePositions = () => {
    const s = state.current;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    // Update Projects
    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });

    // Update Minimap Images
    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
          updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    // Update Info
    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  const animate = () => {
    const s = state.current;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }

    if (s.isSnapping) updateSnap();
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  };
  
  const animationLoop = () => {
     animate();
     requestRef.current = requestAnimationFrame(animationLoop);
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    state.current.projectHeight = container.offsetHeight;
    
    const onWheel = (e: WheelEvent) => {
      const s = state.current;
      const maxScroll = -(PROJECT_DATA.length - 1) * s.projectHeight;

      // Allow page scroll if we're at the boundaries
      if ((s.targetY >= 0 && e.deltaY < 0) || (s.targetY <= maxScroll && e.deltaY > 0)) {
        return;
      }

      e.preventDefault();
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY
      );
      
      s.targetY = Math.max(Math.min(s.targetY - delta, 0), maxScroll);
    };

    const onTouchStart = (e: TouchEvent) => {
        const s = state.current;
        s.isDragging = true;
        s.isSnapping = false;
        s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
        s.lastScrollTime = Date.now();
    }

    const onTouchMove = (e: TouchEvent) => {
        const s = state.current;
        if (!s.isDragging) return;
        const delta = (e.touches[0].clientY - s.dragStart.y) * 1.5;
        const maxScroll = -(PROJECT_DATA.length - 1) * s.projectHeight;
        s.targetY = Math.max(Math.min(s.dragStart.scrollY + delta, 0), maxScroll);
        s.lastScrollTime = Date.now();
    }

    const onTouchEnd = () => {
        state.current.isDragging = false;
    }

    const onResize = () => {
        const container = containerRef.current;
        if (container) {
            state.current.projectHeight = container.offsetHeight;
            // No need to manually set height here as CSS handles it
        }
    }

    if (container) {
      container.addEventListener("wheel", onWheel, { passive: false });
      container.addEventListener("touchstart", onTouchStart);
      container.addEventListener("touchmove", onTouchMove, { passive: false });
      container.addEventListener("touchend", onTouchEnd);
    }
    window.addEventListener("resize", onResize);
    
    onResize();
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      if (container) {
        container.removeEventListener("wheel", onWheel);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
      }
      window.removeEventListener("resize", onResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="parallax-container" ref={containerRef}>
      <ul className="project-list">
        {PROJECT_DATA.map((data, i) => {
          return (
            <div
              key={i}
              className="project"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              <img src={data.image} alt={data.title} />
            </div>
          );
        })}
      </ul>

      <div className="minimap">
        <div className="minimap-wrapper">
          <div className="minimap-img-preview">
            {PROJECT_DATA.map((data, i) => {
              return (
                <div
                  key={i}
                  className="minimap-img-item"
                  ref={(el) => {
                    if (el) minimapRef.current.set(i, el);
                    else minimapRef.current.delete(i);
                  }}
                >
                  <img src={data.image} alt={data.title} />
                </div>
              );
            })}
          </div>
          <div className="minimap-info-list">
            {PROJECT_DATA.map((data, i) => {
              const num = getProjectNumber(i);
              return (
                <div
                  key={i}
                  className="minimap-item-info"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div className="minimap-item-info-row">
                    <p className="num">{num}</p>
                    <p className="title">{data.title}</p>
                  </div>
                  <div className="minimap-item-info-row secondary">
                    <p>{data.category}</p>
                    <p>{data.year}</p>
                  </div>
                  <div className="minimap-item-info-row desc">
                    <p>{data.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
