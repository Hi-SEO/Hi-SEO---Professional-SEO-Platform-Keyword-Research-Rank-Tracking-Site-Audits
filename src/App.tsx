import { ArrowRight, BookOpen, CalendarDays, Mail, MessageSquare, Shield, FileText, Users, Target, CheckCircle2, Search } from "lucide-react"
import { Link, Navigate, Route, Routes } from "react-router-dom"
import { MarketingLayout } from "./layouts/MarketingLayout"
import { AppLayout } from "./layouts/AppLayout"

// Public Pages
import Home from "./pages/public/Home"
import Features from "./pages/public/Features"
import Pricing from "./pages/public/Pricing"
import Compare from "./pages/public/Compare"
import Glossary from "./pages/public/Glossary"
import Login from "./pages/public/Login"
import Signup from "./pages/public/Signup"
import ForgotPassword from "./pages/public/ForgotPassword"
import ResetPassword from "./pages/public/ResetPassword"

// New Public Pages
import Blog from "./pages/public/Blog"
import Contact from "./pages/public/Contact"
import Faq from "./pages/public/Faq"
import About from "./pages/public/About"
import Terms from "./pages/public/Terms"
import Privacy from "./pages/public/Privacy"

// App Pages
import DashboardOverview from "./pages/app/DashboardOverview"
import Projects from "./pages/app/Projects"
import Reports from "./pages/app/Reports"
import ReportDetails from "./pages/app/ReportDetails"
import SiteExplorer from "./pages/app/SiteExplorer"
import SiteAudit from "./pages/app/SiteAudit"
import KeywordExplorer from "./pages/app/KeywordExplorer"
import RankTracker from "./pages/app/RankTracker"
import BacklinkAnalytics from "./pages/app/BacklinkAnalytics"
import CompetitorAnalysis from "./pages/app/CompetitorAnalysis"
import ContentStrategy from "./pages/app/ContentStrategy"
import AIWriter from "./pages/app/AIWriter"
import SerpAnalysis from "./pages/app/SerpAnalysis"
import Settings from "./pages/app/Settings"
import Billing from "./pages/app/Billing"

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute"
import GuestRoute from "./components/auth/GuestRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingLayout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="compare" element={<Compare />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<Faq />} />
        <Route path="resources" element={<Navigate to="/glossary" replace />} />
        <Route path="about" element={<About />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
      </Route>

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<ReportDetails />} />
        <Route path="site-explorer" element={<SiteExplorer />} />
        <Route path="site-audit" element={<SiteAudit />} />
        <Route path="keyword-explorer" element={<KeywordExplorer />} />
        <Route path="rank-tracker" element={<RankTracker />} />
        <Route path="backlinks" element={<BacklinkAnalytics />} />
        <Route path="competitors" element={<CompetitorAnalysis />} />
        <Route path="content-strategy" element={<ContentStrategy />} />
        <Route path="ai-writer" element={<AIWriter />} />
        <Route path="serp-analysis" element={<SerpAnalysis />} />
        <Route path="settings" element={<Settings />} />
        <Route path="billing" element={<Billing />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <p className="text-xl font-semibold">Page Not Found</p>
            <p className="text-muted-foreground">The page you are looking for does not exist.</p>
            <Link
              to="/"
              className="mt-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go Home
            </Link>
          </div>
        }
      />
    </Routes>
  )
}
