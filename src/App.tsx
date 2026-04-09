import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";
import LoadingScreen from "./components/ui/LoadingScreen";

const MarketingLayout = lazy(() => import("./layouts/MarketingLayout"));
const AppLayout = lazy(() => import("./layouts/AppLayout"));

const Home = lazy(() => import("./pages/public/Home"));
const Features = lazy(() => import("./pages/public/Features"));
const Pricing = lazy(() => import("./pages/public/Pricing"));
const Compare = lazy(() => import("./pages/public/Compare"));
const Glossary = lazy(() => import("./pages/public/Glossary"));
const Blog = lazy(() => import("./pages/public/Blog"));
const Faq = lazy(() => import("./pages/public/Faq"));
const Contact = lazy(() => import("./pages/public/Contact"));
const About = lazy(() => import("./pages/public/About"));
const Terms = lazy(() => import("./pages/public/Terms"));
const Privacy = lazy(() => import("./pages/public/Privacy"));

const Login = lazy(() => import("./pages/public/Login"));
const Signup = lazy(() => import("./pages/public/Signup"));
const ForgotPassword = lazy(() => import("./pages/public/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/public/ResetPassword"));

const DashboardOverview = lazy(() => import("./pages/app/DashboardOverview"));
const Projects = lazy(() => import("./pages/app/Projects"));
const SiteAudit = lazy(() => import("./pages/app/SiteAudit"));
const KeywordExplorer = lazy(() => import("./pages/app/KeywordExplorer"));
const RankTracker = lazy(() => import("./pages/app/RankTracker"));
const BacklinkAnalytics = lazy(() => import("./pages/app/BacklinkAnalytics"));
const SiteExplorer = lazy(() => import("./pages/app/SiteExplorer"));
const CompetitorAnalysis = lazy(() => import("./pages/app/CompetitorAnalysis"));
const ContentStrategy = lazy(() => import("./pages/app/ContentStrategy"));
const AIWriter = lazy(() => import("./pages/app/AIWriter"));
const SerpAnalysis = lazy(() => import("./pages/app/SerpAnalysis"));
const Reports = lazy(() => import("./pages/app/Reports"));
const ReportDetails = lazy(() => import("./pages/app/ReportDetails"));
const Settings = lazy(() => import("./pages/app/Settings"));
const Billing = lazy(() => import("./pages/app/Billing"));
const PlaceholderTool = lazy(() => import("./pages/app/PlaceholderTool"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
          <span className="text-white font-black text-sm">Hi</span>
        </div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Marketing Routes */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/resources" element={<Navigate to="/glossary" replace />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* App Routes */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path="projects" element={<Projects />} />
              <Route path="site-audit" element={<SiteAudit />} />
              <Route path="keyword-explorer" element={<KeywordExplorer />} />
              <Route path="rank-tracker" element={<RankTracker />} />
              <Route path="backlinks" element={<BacklinkAnalytics />} />
              <Route path="site-explorer" element={<SiteExplorer />} />
              <Route path="competitors" element={<CompetitorAnalysis />} />
              <Route path="content-strategy" element={<ContentStrategy />} />
              <Route path="ai-writer" element={<AIWriter />} />
              <Route path="serp-analysis" element={<SerpAnalysis />} />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/:id" element={<ReportDetails />} />
              <Route path="settings" element={<Settings />} />
              <Route path="billing" element={<Billing />} />
              <Route path="*" element={<PlaceholderTool />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
