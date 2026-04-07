import { Routes, Route, Navigate } from "react-router-dom";
import { MarketingLayout } from "./layouts/MarketingLayout";
import { AppLayout } from "./layouts/AppLayout";

// Public Pages
import Home from "./pages/public/Home";
import Features from "./pages/public/Features";
import Pricing from "./pages/public/Pricing";
import Compare from "./pages/public/Compare";
import Glossary from "./pages/public/Glossary";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";

// App Pages
import DashboardOverview from "./pages/app/DashboardOverview";
import SiteExplorer from "./pages/app/SiteExplorer";
import SiteAudit from "./pages/app/SiteAudit";
import KeywordExplorer from "./pages/app/KeywordExplorer";
import RankTracker from "./pages/app/RankTracker";
import BacklinkAnalytics from "./pages/app/BacklinkAnalytics";
import CompetitorAnalysis from "./pages/app/CompetitorAnalysis";
import ContentStrategy from "./pages/app/ContentStrategy";
import AIWriter from "./pages/app/AIWriter";
import SerpAnalysis from "./pages/app/SerpAnalysis";
import Settings from "./pages/app/Settings";
import Billing from "./pages/app/Billing";

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Marketing Routes */}
      <Route path="/" element={<MarketingLayout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="compare" element={<Compare />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="resources" element={<Navigate to="/glossary" />} />
      </Route>

      {/* Auth Routes */}
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

      {/* Protected App Dashboard Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
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
      </Route>

      {/* Catch-all 404 */}
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center text-center">
            <h1 className="text-4xl font-bold">404 - Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}