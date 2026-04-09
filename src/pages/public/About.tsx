import React from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const TEAM = [
  {
    name: "Emeka Okafor",
    role: "Co-Founder and CEO",
    bio: "Former growth lead at two Y Combinator startups. 10 years of SEO experience helping brands from zero to millions in organic traffic.",
    color: "#3b82f6",
    avatar: "EO",
  },
  {
    name: "Fatima Aliyu",
    role: "Co-Founder and CTO",
    bio: "Full-stack engineer with deep expertise in data pipelines, search algorithms, and building scalable SaaS infrastructure used by thousands.",
    color: "#06b6d4",
    avatar: "FA",
  },
  {
    name: "Chidi Nwosu",
    role: "Head of Product",
    bio: "Product designer and strategist who has shipped tools used by over 50,000 marketers. Obsessed with turning complex data into simple decisions.",
    color: "#f97316",
    avatar: "CN",
  },
  {
    name: "Adaeze Ibe",
    role: "Head of Growth",
    bio: "Growth marketer with a background in SEO content at scale. Has helped SaaS companies across Africa and Europe build sustainable organic channels.",
    color: "#10b981",
    avatar: "AI",
  },
  {
    name: "Seun Adeyemi",
    role: "Lead Engineer",
    bio: "Backend specialist focused on performance, reliability, and data accuracy. Keeps Hi-SEO fast, accurate, and running at 99.9 percent uptime.",
    color: "#a855f7",
    avatar: "SA",
  },
  {
    name: "Ngozi Eze",
    role: "Head of Customer Success",
    bio: "Dedicated to making every Hi-SEO user successful. Former SEO consultant who brings real-world experience to our support and onboarding processes.",
    color: "#f59e0b",
    avatar: "NE",
  },
]

const VALUES = [
  {
    icon: "target",
    title: "Results over vanity",
    desc: "We build tools that drive real ranking improvements, traffic growth, and business outcomes. Not just dashboards full of numbers.",
    color: "#3b82f6",
  },
  {
    icon: "users",
    title: "Built for our market",
    desc: "Hi-SEO is designed specifically for Nigerian and African businesses. Naira pricing, local payment methods, and tools tuned for our reality.",
    color: "#f97316",
  },
  {
    icon: "shield",
    title: "Trust through transparency",
    desc: "We are honest about what our tools can and cannot do. No exaggerated claims, no fake data. Just accurate insights you can act on.",
    color: "#10b981",
  },
  {
    icon: "zap",
    title: "Speed and simplicity",
    desc: "SEO should not require a PhD. We design every feature to be fast, clear, and actionable for users at every experience level.",
    color: "#06b6d4",
  },
  {
    icon: "heart",
    title: "Customer obsession",
    desc: "Every product decision starts with our users. We listen to feedback, ship improvements fast, and measure success by user outcomes.",
    color: "#ef4444",
  },
  {
    icon: "trending",
    title: "Continuous improvement",
    desc: "SEO changes constantly. We stay ahead of algorithm updates, industry trends, and emerging best practices so you never fall behind.",
    color: "#a855f7",
  },
]

const MILESTONES = [
  { year: "2023", title: "The idea", desc: "Hi-SEO was born out of frustration with expensive, dollar-priced SEO tools that ignored the African market entirely." },
  { year: "Q1 2024", title: "First build", desc: "The founding team shipped the first version of Hi-SEO with keyword research, site audit, and rank tracking." },
  { year: "Q3 2024", title: "Beta launch", desc: "We opened Hi-SEO to 500 beta users across Nigeria, Ghana, and Kenya. Feedback was overwhelming and positive." },
  { year: "Q4 2024", title: "Public launch", desc: "Hi-SEO launched publicly with Naira pricing, Paystack integration, and the full suite of 9 SEO tools." },
  { year: "2025", title: "Scaling up", desc: "Thousands of users, new AI features shipping monthly, and expanding our reach across the African continent and beyond." },
]

function ValueIcon({ type, color }: { type: string; color: string }) {
  const props = { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
      {type === "target" && <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>}
      {type === "users" && <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
      {type === "shield" && <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
      {type === "zap" && <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
      {type === "heart" && <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
      {type === "trending" && <svg {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>}
    </div>
  )
}

export default function About() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section
        className="relative py-28 lg:py-36 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.25) 0%, transparent 70%)" }} />
        <div className="hero-blob hero-blob-blue animate-blob" style={{ width: "600px", height: "600px", top: "-200px", right: "-150px", opacity: 0.3 }} />
        <div className="hero-blob hero-blob-orange animate-blob animate-blob-delay-1" style={{ width: "350px", height: "350px", bottom: "-100px", left: "-80px", opacity: 0.2 }} />

        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Built in Nigeria for the world
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            We are on a mission to make{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              world-class SEO
            </span>{" "}
            accessible to everyone
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed font-medium mb-10"
          >
            Hi-SEO was built because the best SEO tools were too expensive, too complicated, and completely ignored the African market. We decided to change that.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {[
              { value: "10K+", label: "Active users" },
              { value: "50K+", label: "Audits run" },
              { value: "2M+", label: "Keywords tracked" },
              { value: "4.9", label: "Average rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/45 font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp()}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{ background: "rgba(59,130,246,0.08)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                Our story
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Born from frustration. Built with purpose.
              </h2>
              <div className="space-y-4 text-slate-500 text-base leading-relaxed">
                <p>
                  In 2023, our founders were running a digital agency in Lagos. Every month they were paying hundreds of dollars in subscriptions to Ahrefs, SEMrush, and Moz just to do basic SEO work for their clients.
                </p>
                <p>
                  The tools were powerful but the pricing was designed for the US market, the interfaces were overcomplicated, and none of them offered Naira payments. Every month the dollar-to-Naira exchange rate made the bills even more painful.
                </p>
                <p>
                  So they decided to build Hi-SEO. A premium SEO platform with the same depth of data and insights as the big tools, but designed specifically for how African businesses and agencies actually work, priced in Naira, and built to be genuinely easy to use.
                </p>
                <p>
                  Two years later, thousands of founders, marketers, and agencies across Nigeria and beyond are using Hi-SEO to grow their organic traffic without the dollar-priced pain.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="space-y-4">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className="flex gap-5 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="shrink-0">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-xs font-black text-center leading-tight"
                      style={{
                        background: i === MILESTONES.length - 1
                          ? "linear-gradient(135deg, #1d4ed8, #06b6d4)"
                          : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                        color: i === MILESTONES.length - 1 ? "white" : "#64748b",
                        border: i === MILESTONES.length - 1 ? "none" : "1px solid #e2e8f0",
                      }}
                    >
                      {m.year}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-1">{m.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24" style={{ background: "#f8fafc" }}>
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(249,115,22,0.08)", color: "#f97316", border: "1px solid rgba(249,115,22,0.15)" }}
            >
              What we stand for
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Our values guide everything we build
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              These are not corporate buzzwords. They are the principles that drive every product decision, support interaction, and feature we ship.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                {...fadeUp(i * 0.08)}
                className="group p-7 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-[0_16px_48px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-2"
              >
                <ValueIcon type={value.icon} color={value.color} />
                <h3 className="text-lg font-black text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(59,130,246,0.08)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.15)" }}
            >
              The team
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Meet the people building Hi-SEO
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              A small but mighty team of engineers, designers, and SEO specialists obsessed with building the best SEO platform for our market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                {...fadeUp(i * 0.08)}
                className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-[0_16px_48px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${member.color}, ${member.color}cc)`,
                      boxShadow: `0 4px 16px ${member.color}40`,
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{member.name}</h3>
                    <p className="text-xs font-semibold" style={{ color: member.color }}>{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #07111f 0%, #0b1729 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-20" />
        <div className="section-container relative z-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Why teams trust Hi-SEO
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              We earn trust by being transparent, reliable, and genuinely focused on user success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "shield",
                title: "Enterprise-grade security",
                desc: "All data encrypted at rest and in transit. Row-level security ensures your data is always private. Built on Supabase with SOC 2 compliant infrastructure.",
                color: "#06b6d4",
              },
              {
                icon: "zap",
                title: "99.9% uptime guarantee",
                desc: "Hi-SEO is built for reliability. Our infrastructure is monitored 24/7 and we maintain a public status page so you always know the state of the platform.",
                color: "#3b82f6",
              },
              {
                icon: "heart",
                title: "Real human support",
                desc: "Every support request is handled by a real person on our team who understands SEO. No bots, no canned responses, just genuine help from people who care.",
                color: "#f97316",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.1)}
                className="p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                >
                  {item.icon === "shield" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                  {item.icon === "zap" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                  {item.icon === "heart" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-orange animate-blob" style={{ width: "400px", height: "400px", top: "-80px", right: "-80px", opacity: 0.2 }} />
        <div className="section-container relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Join us on this mission
            </h2>
            <p className="text-blue-200/60 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Start using Hi-SEO today and be part of a growing community of African businesses winning at organic search.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 28px rgba(249,115,22,0.5)" }}
              >
                Start Free Today
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Talk to the Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
