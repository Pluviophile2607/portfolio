"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import SplitText from "@/components/ui/SplitText"

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Prevent scrolling while preloader is active
    document.body.style.overflow = "hidden"

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 4000)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ""
    }
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ""
        if (onComplete) onComplete()
      }}
    >
      {loading && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          <ShaderAnimation />
          <div className="absolute z-10 text-center">
            <SplitText
              text="Hi, I’m Prithvi"
              className="text-white text-4xl font-bold tracking-tighter"
              delay={50}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
