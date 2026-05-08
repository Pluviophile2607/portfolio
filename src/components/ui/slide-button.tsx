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

const DRAG_CONSTRAINTS = { left: 0, right: 185 }
const DRAG_THRESHOLD = 0.9

const BUTTON_STATES = {
  initial: { width: "15rem" },
  completed: { width: "8rem" },
}


const ANIMATION_CONFIG = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  soft: {
    type: "spring",
    stiffness: 200,
    damping: 25,
  }
} as const


type StatusIconProps = {
  status: string
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<StatusIconProps["status"], JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={20} />,
      success: <Check size={20} />,
      error: <X size={20} />,
    }),
    []
  )

  if (!iconMap[status]) return null

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {iconMap[status]}
    </motion.div>
  )
}

const useButtonStatus = (resolveTo: "success" | "error", onSuccess?: () => void) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const handleSubmit = useCallback(() => {
    setStatus("loading")
    setTimeout(() => {
      setStatus(resolveTo)
      if (resolveTo === "success" && onSuccess) {
        setTimeout(onSuccess, 600)
      }
    }, 1200)
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
    const dragHandleRef = useRef<HTMLDivElement | null>(null)
    const { status, handleSubmit } = useButtonStatus("success", onSuccess)

    const dragX = useMotionValue(0)
    // Use spring only for the progress-dependent visuals, not the handle position itself
    const springX = useSpring(dragX, { stiffness: 200, damping: 25 })
    
    const dragProgress = useTransform(
      dragX, // Use raw drag for progress calculation for better responsiveness
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    )

    const springProgress = useTransform(
      springX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    )

    const clipPath = useTransform(
      dragX,
      [0, DRAG_CONSTRAINTS.right * 0.8],
      ["inset(0 0 0 0%)", "inset(0 0 0 100%)"]
    )
    const bgOpacity = useTransform(springProgress, [0, 1], [0.05, 0.2])

    const handleDragStart = useCallback(() => {
      if (completed) return
      setIsDragging(true)
    }, [completed])

    const handleDragEnd = () => {
      if (completed) return
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true)
        handleSubmit()
        // Snap to end for completion
        dragX.set(DRAG_CONSTRAINTS.right)
      } else {
        dragX.set(0)
      }
    }

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (completed) return
      // The drag component handles the 'x' property internally when drag="x" is used.
      // We just need to sync our MotionValue for other animations.
      dragX.set(info.offset.x)
    }

    const adjustedWidth = useTransform(springX, (x) => x + 48)

    return (
      <motion.div
        animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
        transition={ANIMATION_CONFIG.soft}
        className={cn(
          "relative flex h-14 items-center justify-center rounded-full bg-white/5 border border-white/10 overflow-hidden transition-colors duration-300",
          isDragging && "border-white/20 bg-white/10",
          completed && "border-transparent bg-transparent"
        )}
      >
        {!completed && (
          <motion.div
            style={{
              width: adjustedWidth,
              opacity: bgOpacity,
            }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-white pointer-events-none"
          />
        )}
        
        {!completed && (
          <motion.div 
            style={{ clipPath }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-white/40 text-[10px] font-medium tracking-[0.3em] uppercase">
              Slide to enter
            </span>
          </motion.div>
        )}


        <AnimatePresence>
          {!completed && (
            <motion.div
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0} // Remove elastic to prevent shaking/jitter
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }} // Use raw dragX for the handle to eliminate spring jitter
              className="absolute left-1 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
            >
              <motion.div
                animate={{
                  scale: isDragging ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Button
                  ref={ref}
                  disabled={status === "loading"}
                  {...props}
                  size="icon"
                  className={cn(
                    "h-12 w-12 rounded-full bg-white text-black hover:bg-white border-none shadow-md transition-shadow",
                    isDragging && "shadow-xl",
                    className
                  )}
                >
                  <SendHorizontal className="size-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        <AnimatePresence mode="wait">
          {completed && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={ANIMATION_CONFIG.soft}
            >
              <Button
                ref={ref}
                disabled={status === "loading"}
                {...props}
                className={cn(
                  "h-full w-full rounded-full bg-white text-black hover:bg-white border-none shadow-xl",
                  className
                )}
              >
                <AnimatePresence mode="wait">
                  <StatusIcon status={status} />
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )

  }
)

SlideButton.displayName = "SlideButton"

export { SlideButton }
