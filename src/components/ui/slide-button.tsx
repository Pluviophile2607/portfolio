"use client"

import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  type JSX,
} from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { Check, Loader2, SendHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

const DRAG_CONSTRAINTS = { left: 0, right: 222 }
const DRAG_THRESHOLD = 0.85

const BUTTON_STATES = {
  initial: { width: "18rem", opacity: 1 },
  completed: { width: "4rem", opacity: 1 },
}

const ANIMATION_CONFIG = {
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 1,
  },
  soft: {
    type: "spring",
    stiffness: 250,
    damping: 25,
    mass: 0.8,
  }
} as const


type StatusIconProps = {
  status: string
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<StatusIconProps["status"], JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={22} />,
      success: <Check size={22} />,
      error: <X size={22} />,
    }),
    []
  )

  if (!iconMap[status]) return null

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {iconMap[status]}
    </motion.div>
  )
}

const useButtonStatus = (resolveTo: "success" | "error", onSuccess?: () => void) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  
  const isMounted = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSubmit = useCallback(() => {
    setStatus("loading")
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      if (!isMounted.current) return
      setStatus(resolveTo)
      
      if (resolveTo === "success" && onSuccess) {
        timeoutRef.current = setTimeout(() => {
          if (isMounted.current) onSuccess()
        }, 800)
      }
    }, 1500)
  }, [resolveTo, onSuccess])

  return { status, handleSubmit }
}

export interface SlideButtonProps extends ButtonProps {
  onSuccess?: () => void
}

const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ className, onSuccess, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [completed, setCompleted] = useState(false)
    const { status, handleSubmit } = useButtonStatus("success", onSuccess)

    const dragX = useMotionValue(0)
    // Smooth trailing spring for the background fill and text opacity
    const smoothX = useSpring(dragX, { stiffness: 150, damping: 20 })
    
    const dragProgress = useTransform(dragX, [0, DRAG_CONSTRAINTS.right], [0, 1])
    const smoothProgress = useTransform(smoothX, [0, DRAG_CONSTRAINTS.right], [0, 1])

    const textOpacity = useTransform(dragProgress, [0, 0.4], [1, 0])
    const bgOpacity = useTransform(smoothProgress, [0, 1], [0.05, 0.25])
    const adjustedWidth = useTransform(smoothX, (x) => x + 56)

    const handleDragStart = () => {
      if (completed) return
      setIsDragging(true)
    }

    const handleDragEnd = () => {
      if (completed) return
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true)
        handleSubmit()
        dragX.set(DRAG_CONSTRAINTS.right)
      } else {
        dragX.set(0)
      }
    }

    return (
      <motion.div
        animate={completed ? "completed" : "initial"}
        variants={BUTTON_STATES}
        transition={ANIMATION_CONFIG.soft}
        className={cn(
          "relative flex h-16 items-center justify-center rounded-full bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm",
          isDragging && "border-white/20 bg-white/10",
          completed && "border-transparent bg-white shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        )}
      >
        {/* Fill Background */}
        {!completed && (
          <motion.div
            style={{
              width: adjustedWidth,
              opacity: bgOpacity,
            }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-white pointer-events-none"
          />
        )}
        
        {/* Text Prompt */}
        {!completed && (
          <motion.div 
            style={{ opacity: textOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 whitespace-nowrap"
          >
            <span className="text-white/60 text-xs font-semibold tracking-[0.25em] uppercase ml-[0.125em]">
              Slide to enter
            </span>
          </motion.div>
        )}

        {/* Drag Handle Wrapper */}
        <AnimatePresence>
          {!completed && (
            <motion.div
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              className="absolute left-1 z-20 flex cursor-grab items-center justify-start active:cursor-grabbing"
            >
              <motion.div
                animate={{
                  scale: isDragging ? 1.1 : 1,
                  rotate: isDragging ? 5 : 0,
                }}
                transition={ANIMATION_CONFIG.spring}
              >
                <Button
                  ref={ref}
                  disabled={status === "loading"}
                  {...props}
                  size="icon"
                  className={cn(
                    "h-14 w-14 rounded-full bg-white text-black hover:bg-white border-none shadow-lg transition-shadow",
                    isDragging && "shadow-2xl brightness-110",
                    className
                  )}
                >
                  <SendHorizontal className="size-6 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success/Loading State Container */}
        <AnimatePresence mode="wait">
          {completed && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={ANIMATION_CONFIG.soft}
            >
              <div className="flex items-center justify-center w-full h-full text-black">
                <StatusIcon status={status} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )

  }
)

SlideButton.displayName = "SlideButton"

export { SlideButton }
