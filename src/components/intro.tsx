"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { SlideButton } from "@/components/ui/slide-button"

export function Intro({ onEnter }: { onEnter: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-12 overflow-hidden"
        >
          <motion.h1 
            className="text-white text-xs md:text-sm uppercase tracking-[0.6em] font-light opacity-50 text-center"
          >
            Digital Experience
          </motion.h1>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <SlideButton onSuccess={onEnter} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-8 text-white/20 text-[10px] uppercase tracking-[0.3em] font-light"
        >
          Prithvi Portfolio &copy; 2026
        </motion.p>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/10" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/10" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/10" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/10" />
    </motion.div>
  )
}
