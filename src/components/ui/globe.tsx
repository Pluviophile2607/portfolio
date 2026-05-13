"use client";

import React from "react";
import { motion } from "framer-motion";

const Globe: React.FC = () => {
  const imageUrl = "https://cdn.designfast.io/image/2026-05-05/a59ce0c0-a3bd-4ab0-a76d-bcf060ebf24b.png";

  return (
    <>
      <style>
        {`
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        `}
      </style>
      <div className="flex items-center justify-center w-full h-full">
        {/* Outer Glow Wrapper */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[40px] transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />
          
          <motion.div
            initial={{ rotate: 23.5 }}
            className="relative w-[280px] h-[280px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,250px_0_44px_#00000066_inset,150px_0_38px_#000000aa_inset]"
            style={{
              background: "radial-gradient(circle at 30% 30%, #1a1a1a 0%, #000 100%)",
            }}
          >
            {/* Texture Container for Seamless Loop */}
            <motion.div
              className="absolute inset-0 flex h-full"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 60,
                ease: "linear",
                repeat: Infinity,
              }}
              style={{ width: "200%" }}
            >
              <div 
                className="w-1/2 h-full bg-repeat-x" 
                style={{ 
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: "auto 100%", // Fit height, let width scale
                  backgroundPosition: "center",
                }} 
              />
              <div 
                className="w-1/2 h-full bg-repeat-x" 
                style={{ 
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: "auto 100%",
                  backgroundPosition: "center",
                }} 
              />
            </motion.div>

            {/* Atmospheric Overlay for depth */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.8),inset_-10px_-10px_20px_rgba(255,255,255,0.1)] pointer-events-none" />
            
            {/* Stars inside the globe container (optional, but keep them as they were) */}
            <div
              className="absolute left-[10%] top-[20%] w-1 h-1 bg-white rounded-full opacity-30"
              style={{ animation: "twinkling 3s infinite" }}
            />
            <div
              className="absolute left-[30%] top-[40%] w-1 h-1 bg-white rounded-full opacity-40"
              style={{ animation: "twinkling-slow 2s infinite" }}
            />
            <div
              className="absolute left-[70%] top-[10%] w-1 h-1 bg-white rounded-full opacity-20"
              style={{ animation: "twinkling-long 4s infinite" }}
            />
            <div
              className="absolute left-[80%] top-[80%] w-1 h-1 bg-white rounded-full opacity-50"
              style={{ animation: "twinkling 3s infinite" }}
            />
            <div
              className="absolute left-[20%] top-[70%] w-1 h-1 bg-white rounded-full opacity-40"
              style={{ animation: "twinkling-fast 1.5s infinite" }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Globe;

