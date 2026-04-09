import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const loadingStages = [
  { label: "Initializing", percent: 15 },
  { label: "Loading modules", percent: 35 },
  { label: "Connecting services", percent: 55 },
  { label: "Preparing workspace", percent: 75 },
  { label: "Almost ready", percent: 90 },
  { label: "Ready", percent: 100 },
];

const featureTags = [
  "Keyword Research",
  "Site Audits",
  "Rank Tracking",
  "Backlinks",
  "AI Writer",
  "Competitor Analysis",
];

export default function LoadingScreen() {
  const [stageIndex, setStageIndex] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < loadingStages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = loadingStages[stageIndex].percent;
    const step = setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev >= target) {
          clearInterval(step);
          return target;
        }
        return prev + 1;
      });
    }, 12);
    return () => clearInterval(step);
  }, [stageIndex]);

  const currentStage = loadingStages[stageIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #07111f 0%, #0b1729 50%, #0d1f3c 100%)" }}
    >
      {/* Subtle radial glow in center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Top-left glow */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />
      {/* Bottom-right glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">

        {/* Logo icon - blue rounded square with HI SEO text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(59,130,246,0.4)",
                "0 0 70px rgba(59,130,246,0.7)",
                "0 0 30px rgba(59,130,246,0.4)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-3xl flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)",
            }}
          >
            <span className="text-white font-black text-lg leading-none tracking-tight">HI</span>
            <span className="text-white font-black text-lg leading-none tracking-tight">SEO</span>
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-baseline gap-1 mb-8"
        >
          <span className="text-white font-black text-3xl tracking-tight">Hi-</span>
          <span className="font-black text-3xl tracking-tight" style={{ color: "#06b6d4" }}>SEO</span>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-white font-bold text-lg mb-1">Loading your workspace.</p>
          <p className="text-slate-400 text-sm">Preparing your premium SEO dashboard</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full mb-6"
        >
          {/* Bar container */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${displayPercent}%`,
                background: "linear-gradient(90deg, #1d4ed8, #06b6d4)",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Labels below bar */}
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStage.label}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400 text-xs"
              >
                {currentStage.label}
              </motion.span>
            </AnimatePresence>
            <span className="text-slate-300 text-xs font-bold">{displayPercent}%</span>
          </div>
        </motion.div>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-x-4 gap-y-2"
        >
          {featureTags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.08, duration: 0.4 }}
              className="text-xs font-medium"
              style={{ color: "#06b6d4" }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Bottom watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <span
          className="text-xs font-bold tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          Premium SEO Workflow for Modern Teams
        </span>
      </motion.div>
    </div>
  );
}
