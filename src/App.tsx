import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { MarketingLayout } from "./layouts/MarketingLayout"
import { AppLayout } from "./layouts/AppLayout"

// Public Pages
import Home from "./pages/public/Home"
import Features from "./pages/public/Features"
import Pricing from "./pages/public/Pricing"
import Compare from "./pages/public/Compare"
import Glossary from "./pages/public/Glossary"
import AuthPlaceholder from "./pages/public/AuthPlaceholder"

// App Pages
import DashboardOverview from "./pages/app/DashboardOverview"
import SiteExplorer from "./pages/app/SiteExplorer"
import KeywordExplorer from "./pages/app/KeywordExplorer"
import RankTracker from "./pages/app/RankTracker"
import BacklinkAnalytics from "./pages/app/BacklinkAnalytics"
import PlaceholderTool from "./pages/app/PlaceholderTool"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/" element={<MarketingLayout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="compare" element={<Compare />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="resources" element={<Navigate to="/glossary" />} />
          {/* Add hundreds of other programmatic routes logically later */}
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<AuthPlaceholder type="login" />} />
        <Route path="/signup" element={<AuthPlaceholder type="signup" />} />

        {/* App Dashboard Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="site-explorer" element={<SiteExplorer />} />
          <Route path="keyword-explorer" element={<KeywordExplorer />} />
          <Route path="rank-tracker" element={<RankTracker />} />
          <Route path="backlinks" element={<BacklinkAnalytics />} />
          
          {/* Use placeholders for the rest of the extensive tool suite initially */}
          <Route path="site-audit" element={<PlaceholderTool title="Site Audit" description="Comprehensive technical SEO scanning." />} />
          <Route path="competitors" element={<PlaceholderTool title="Competitor Analysis" description="Uncover competitor strategies and content gaps." />} />
          <Route path="content-strategy" element={<PlaceholderTool title="Content Strategy" description="Plan topical clusters and topical authority." />} />
          <Route path="ai-writer" element={<PlaceholderTool title="AI Writer" description="Generate SEO-optimized content briefs and articles." />} />
          <Route path="serp-analysis" element={<PlaceholderTool title="SERP Analysis" description="Analyze zero-click opportunities and snippets." />} />
          <Route path="settings" element={<PlaceholderTool title="Settings" description="Manage your workspace and billing." />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<div className="flex h-screen items-center justify-center text-center"><h1 className="text-4xl font-bold">404 - Not Found</h1></div>} />
      </Routes>
    </Router>
  )
}