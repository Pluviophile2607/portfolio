"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import SplitText from "@/components/ui/SplitText"

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  const hasPlayedRef = useRef(false)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    setMounted(true)
    
    // Prevent scrolling while preloader is active
    document.body.style.overflow = "hidden"

    // Create audio object
    const audio = new Audio("/assets/sound/whoosh-sound-mp3.mp3")
    audio.volume = 0.65
    audio.preload = "auto"

    const playWhoosh = () => {
      if (hasPlayedRef.current) return
      
      audio.currentTime = 0
      audio.play().then(() => {
        hasPlayedRef.current = true
      }).catch(err => {
        // This should not happen now since user has interacted
        console.warn("Audio playback still blocked despite interaction.", err)
      })
    }

    // Attempt to play on mount
    const startTimer = setTimeout(playWhoosh, 300)

    // Simulate loading time
    const exitTimer = setTimeout(() => {
      setLoading(false)
    }, 4000)


    return () => {
      isMounted.current = false
      clearTimeout(startTimer)
      clearTimeout(exitTimer)
      document.body.style.overflow = ""
    }

  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ""
        // Check if the component is still mounted (or was until unmount started)
        // to safely call the parent's completion handler.
        if (onComplete) {
          onComplete()
        }
      }}
    >
      {loading && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <ShaderAnimation />
          </motion.div>
          
          <div className="absolute z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.0, ease: "easeOut" }}
            >
              <SplitText
                text="Hi, I’m Prithvi"
                className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
                delay={80}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
