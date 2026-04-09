import React, { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface LoadingScreenProps {
  message?: string
  submessage?: string
  progress?: number
  showProgress?: boolean
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading your workspace",
  submessage = "Preparing your premium SEO dashboard",
  progress,
  showProgress = true,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [internalProgress, setInternalProgress] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (progress !== undefined) {
      setInternalProgress(progress)
      return
    }
    const timer = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 85) {
          clearInterval(timer)
          return prev
        }
        const increment = Math.random() * 12 + 3
        return Math.min(prev + increment, 85)
      })
    }, 400)
    return () => clearInterval(timer)
  }, [progress])

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(timer)
  }, [])

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } },
  }

  const logoVariants = shouldReduceMotion
    ? {}
    : {
        initial: { scale: 0.7, opacity: 0, y: 20 },
        animate: {
          scale: 1,
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
        },
      }

  const textVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
        },
      }

  const progressVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.5, ease: "easeOut" },
        },
      }

  return (
    <AnimatePresence>
      <motion.div
        key="loading-screen"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #07123f 0%, #0b1729 50%, #07111f 100%)",
        }}
      >
        {/* Background blobs */}
        {!shouldReduceMotion && (
          <>
            <div
              className="hero-blob hero-blob-blue animate-blob"
              style={{
                width: "600px",
                height: "600px",
                top: "-200px",
                right: "-100px",
                opacity: 0.3,
              }}
            />
            <div
              className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2"
              style={{
                width: "500px",
                height: "500px",
                bottom: "-150px",
                left: "-100px",
                opacity: 0.25,
              }}
            />
            <div
              className="hero-blob hero-blob-orange animate-blob-slow animate-blob-delay-1"
              style={{
                width: "300px",
                height: "300px",
                top: "50%",
                left: "60%",
                opacity: 0.15,
              }}
            />
          </>
        )}

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-overlay opacity-40" />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-8 max-w-sm w-full">

          {/* Logo mark */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center gap-4"
          >
            {/* Logo icon */}
            <div className="relative">
              {/* Outer glow ring */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59,130,246,0.4)",
                      "0 0 50px rgba(59,130,246,0.7)",
                      "0 0 20px rgba(59,130,246,0.4)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0ea5e9 100%)",
                  boxShadow: "0 8px 32px rgba(59,130,246,0.5)",
                }}
              >
                {/* Inner shimmer */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
                  }}
                />

                {/* HI text */}
                <div className="relative z-10 flex flex-col items-center leading-none">
                  <span
                    className="text-white font-black"
                    style={{ fontSize: "13px", letterSpacing: "0.15em" }}
                  >
                    HI
                  </span>
                  <span
                    className="text-white font-black"
                    style={{ fontSize: "18px", letterSpacing: "-0.02em", lineHeight: 1 }}
                  >
                    SEO
                  </span>
                </div>
              </div>
            </div>

            {/* Brand name */}
            <div className="flex items-baseline gap-1">
              <span
                className="text-white font-black tracking-tight"
                style={{ fontSize: "28px" }}
              >
                Hi-
              </span>
              <span
                className="font-black tracking-tight"
                style={{
                  fontSize: "28px",
                  background: "linear-gradient(135deg, #60a5fa, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SEO
              </span>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="text-center space-y-2"
          >
            <p className="text-white font-semibold text-base">
              {message}
              <span className="inline-block w-6 text-left">{dots}</span>
            </p>
            <p className="text-white/40 text-sm font-medium">{submessage}</p>
          </motion.div>

          {/* Progress bar */}
          {showProgress && (
            <motion.div
              variants={progressVariants}
              initial="initial"
              animate="animate"
              className="w-full space-y-2"
            >
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${internalProgress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Shimmer on progress bar */}
                  <div
                    className="absolute inset-0 animate-shimmer"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </motion.div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/30 text-xs font-medium">
                  Initializing
                </span>
                <span className="text-white/40 text-xs font-semibold">
                  {Math.round(internalProgress)}%
                </span>
              </div>
            </motion.div>
          )}

          {/* Feature pills */}
          <motion.div
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="flex flex-wrap justify-center gap-2"
          >
            {[
              "Keyword Research",
              "Site Audits",
              "Rank Tracking",
              "Backlinks",
            ].map((feature, i) => (
              <motion.span
                key={feature}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "rgba(147,197,253,0.9)",
                }}
              >
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-0 right-0 text-center"
        >
          <p className="text-white/20 text-xs font-medium tracking-widest uppercase">
            Premium SEO Workflow for Modern Teams
          </p>
        </motion.div>

        {/* Corner decorations */}
        <div
          className="absolute top-0 left-0 w-64 h-64 opacity-20"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(59,130,246,0.4), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 opacity-20"
          style={{
            background:
              "radial-gradient(circle at bottom right, rgba(6,182,212,0.4), transparent 70%)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default LoadingScreen
