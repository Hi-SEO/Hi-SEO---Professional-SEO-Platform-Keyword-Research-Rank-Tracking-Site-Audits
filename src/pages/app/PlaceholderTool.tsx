import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { Construction, ArrowLeft, Sparkles, Zap } from "lucide-react";

export default function PlaceholderTool() {
  const location = useLocation();
  const pageName = location.pathname.split("/").filter(Boolean).pop() ?? "page";
  const formatted = pageName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">{formatted}</h1>
        <p className="text-blue-200/60 text-sm mb-8 leading-relaxed">
          This tool is currently under development and will be available soon. We are working hard to bring you a premium experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/app"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
            <ArrowLeft className="w-4 h-4" />Back to Dashboard
          </Link>
          <Link to="/app/ai-writer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/70 hover:text-white font-semibold text-sm transition-all">
            <Sparkles className="w-4 h-4" />Try AI Writer
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
