import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  CreditCard, CheckCircle2, AlertCircle, RefreshCw,
  Download, Clock, Shield, Zap, Star, Crown,
  ArrowUp, ChevronRight, Receipt, BadgeCheck,
  TrendingUp, Users, Globe, Key, BarChart2,
  Sparkles, Lock, X, ExternalLink, Building2
} from "lucide-react";

interface Payment {
  id: string;
  user_id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  paid_at: string;
  created_at: string;
}

interface PlanConfig {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  paystackAmount: number;
  description: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  features: string[];
  limits: { projects: string; keywords: string; audits: string; reports: string };
  popular: boolean;
  cta: string;
}

interface State {
  payments: Payment[];
  paymentsLoading: boolean;
  paymentsError: string | null;
  processingPlan: string | null;
  paymentSuccess: string | null;
  paymentError: string | null;
  billingCycle: "monthly" | "yearly";
  showHistory: boolean;
}

type Action =
  | { type: "SET_PAYMENTS"; payload: Payment[] }
  | { type: "SET_PAYMENTS_LOADING"; payload: boolean }
  | { type: "SET_PAYMENTS_ERROR"; payload: string | null }
  | { type: "SET_PROCESSING"; payload: string | null }
  | { type: "SET_PAYMENT_SUCCESS"; payload: string | null }
  | { type: "SET_PAYMENT_ERROR"; payload: string | null }
  | { type: "SET_BILLING_CYCLE"; payload: "monthly" | "yearly" }
  | { type: "TOGGLE_HISTORY" }
  | { type: "ADD_PAYMENT"; payload: Payment };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PAYMENTS": return { ...state, payments: action.payload };
    case "SET_PAYMENTS_LOADING": return { ...state, paymentsLoading: action.payload };
    case "SET_PAYMENTS_ERROR": return { ...state, paymentsError: action.payload };
    case "SET_PROCESSING": return { ...state, processingPlan: action.payload };
    case "SET_PAYMENT_SUCCESS": return { ...state, paymentSuccess: action.payload };
    case "SET_PAYMENT_ERROR": return { ...state, paymentError: action.payload };
    case "SET_BILLING_CYCLE": return { ...state, billingCycle: action.payload };
    case "TOGGLE_HISTORY": return { ...state, showHistory: !state.showHistory };
    case "ADD_PAYMENT": return { ...state, payments: [action.payload, ...state.payments] };
    default: return state;
  }
}

const initialState: State = {
  payments: [],
  paymentsLoading: true,
  paymentsError: null,
  processingPlan: null,
  paymentSuccess: null,
  paymentError: null,
  billingCycle: "monthly",
  showHistory: true,
};

const PLANS: PlanConfig[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    yearlyPrice: 0,
    currency: "NGN",
    paystackAmount: 0,
    description: "Perfect for individuals getting started with SEO",
    icon: Zap,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    gradient: "from-slate-600/10 to-slate-900/10",
    features: ["3 Projects", "50 Keywords", "5 Audits/month", "Basic Reports", "Keyword Explorer", "Site Audit"],
    limits: { projects: "3", keywords: "50", audits: "5/mo", reports: "10" },
    popular: false,
    cta: "Current Free Plan",
  },
  {
    id: "pro",
    name: "Pro",
    price: 15000,
    yearlyPrice: 144000,
    currency: "NGN",
    paystackAmount: 1500000,
    description: "For growing businesses and serious SEO practitioners",
    icon: Star,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    gradient: "from-blue-600/20 to-blue-900/20",
    features: ["25 Projects", "500 Keywords", "Unlimited Audits", "Advanced Reports", "Rank Tracker", "Backlink Analytics", "Competitor Analysis", "AI Writer (50/mo)", "Priority Support"],
    limits: { projects: "25", keywords: "500", audits: "Unlimited", reports: "Unlimited" },
    popular: true,
    cta: "Upgrade to Pro",
  },
  {
    id: "business",
    name: "Business",
    price: 45000,
    yearlyPrice: 432000,
    currency: "NGN",
    paystackAmount: 4500000,
    description: "For agencies and teams managing multiple clients",
    icon: Building2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    gradient: "from-purple-600/20 to-purple-900/20",
    features: ["100 Projects", "5000 Keywords", "Unlimited Audits", "White-label Reports", "Full AI Writer", "API Access", "Team Members (5)", "Dedicated Support", "Custom Integrations"],
    limits: { projects: "100", keywords: "5,000", audits: "Unlimited", reports: "White-label" },
    popular: false,
    cta: "Upgrade to Business",
  },
  {
    id: "agency",
    name: "Agency",
    price: 0,
    yearlyPrice: 0,
    currency: "NGN",
    paystackAmount: 0,
    description: "Custom enterprise solutions for large agencies",
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    gradient: "from-amber-600/20 to-amber-900/20",
    features: ["Unlimited Projects", "Unlimited Keywords", "Unlimited Everything", "Custom Reporting", "Dedicated Account Manager", "SLA Guarantee", "Custom Integrations", "Team Training", "On-boarding Support"],
    limits: { projects: "Unlimited", keywords: "Unlimited", audits: "Unlimited", reports: "Custom" },
    popular: false,
    cta: "Contact Sales",
  },
];

function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}

function formatAmount(amount: number, currency: string): string {
  if (currency === "NGN") return formatNaira(amount / 100);
  return `${currency} ${(amount / 100).toFixed(2)}`;
}

function PlanBadge({ plan }: { plan: string }) {
  const cfg = {
    starter: "text-slate-400 bg-slate-500/15 border-slate-500/25",
    pro: "text-blue-400 bg-blue-500/15 border-blue-500/25",
    business: "text-purple-400 bg-purple-500/15 border-purple-500/25",
    agency: "text-amber-400 bg-amber-500/15 border-amber-500/25",
    deactivated: "text-red-400 bg-red-500/15 border-red-500/25",
  };
  const color = cfg[plan as keyof typeof cfg] ?? cfg.starter;
  return (
    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${color}`}>
      {plan}
    </span>
  );
}

export default function Billing() {
  const { user, profile, refreshProfile } = useAuth();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentPlan = profile?.plan ?? "starter";
  const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? "";

  useEffect(() => {
    if (!user) return;
    loadPayments();
  }, [user]);

  async function loadPayments() {
    dispatch({ type: "SET_PAYMENTS_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      dispatch({ type: "SET_PAYMENTS", payload: data ?? [] });
    } catch (err: any) {
      dispatch({ type: "SET_PAYMENTS_ERROR", payload: err.message ?? "Failed to load payment history." });
    } finally {
      dispatch({ type: "SET_PAYMENTS_LOADING", payload: false });
    }
  }

  function handlePaystack(plan: PlanConfig) {
    if (!paystackKey) {
      dispatch({ type: "SET_PAYMENT_ERROR", payload: "Payment system not configured. Please contact support." });
      return;
    }
    if (plan.paystackAmount === 0) return;

    dispatch({ type: "SET_PROCESSING", payload: plan.id });
    dispatch({ type: "SET_PAYMENT_ERROR", payload: null });

    const amount = state.billingCycle === "yearly" ? plan.yearlyPrice * 100 : plan.paystackAmount;
    const reference = `hiseo_${plan.id}_${Date.now()}`;

    const handler = (window as any).PaystackPop?.setup({
      key: paystackKey,
      email: user?.email ?? "",
      amount,
      currency: "NGN",
      ref: reference,
      metadata: {
        user_id: user!.id,
        plan: plan.id,
        billing_cycle: state.billingCycle,
        custom_fields: [
          { display_name: "Plan", variable_name: "plan", value: plan.name },
          { display_name: "Billing Cycle", variable_name: "billing_cycle", value: state.billingCycle },
        ],
      },
      callback: async (response: any) => {
        dispatch({ type: "SET_PROCESSING", payload: null });
        if (response.status === "success") {
          try {
            const { data, error } = await supabase.functions.invoke("verify-paystack-payment", {
              body: { reference: response.reference, plan: plan.id, user_id: user!.id },
            });
            if (error) throw error;
            await refreshProfile();
            await loadPayments();
            dispatch({ type: "SET_PAYMENT_SUCCESS", payload: plan.name });
            setTimeout(() => dispatch({ type: "SET_PAYMENT_SUCCESS", payload: null }), 5000);
          } catch (err: any) {
            dispatch({ type: "SET_PAYMENT_ERROR", payload: "Payment verified but plan update failed. Please contact support." });
          }
        } else {
          dispatch({ type: "SET_PAYMENT_ERROR", payload: "Payment was not completed. Please try again." });
        }
      },
      onClose: () => {
        dispatch({ type: "SET_PROCESSING", payload: null });
      },
    });

    handler?.openIframe();
  }

  function handleContactSales() {
    window.location.href = "/contact?subject=Agency+Plan+Inquiry";
  }

  function exportCSV() {
    if (state.payments.length === 0) return;
    const rows = [
      ["Reference", "Amount", "Currency", "Plan", "Status", "Date"],
      ...state.payments.map(p => [
        p.reference,
        (p.amount / 100).toFixed(2),
        p.currency,
        p.plan,
        p.status,
        new Date(p.paid_at ?? p.created_at).toLocaleDateString("en-NG"),
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "hi-seo-payment-history.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const currentPlanData = PLANS.find(p => p.id === currentPlan) ?? PLANS[0];
  const totalSpent = state.payments.filter(p => p.status === "success").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Billing</h1>
        <p className="text-blue-200/70 text-sm mt-1">Manage your subscription, upgrade your plan, and view payment history</p>
      </motion.div>

      {/* Success Banner */}
      <AnimatePresence>
        {state.paymentSuccess && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Payment Successful!</p>
              <p className="text-xs text-emerald-400/70 mt-0.5">Your account has been upgraded to the <strong>{state.paymentSuccess}</strong> plan. Enjoy your new features!</p>
            </div>
            <button onClick={() => dispatch({ type: "SET_PAYMENT_SUCCESS", payload: null })} className="ml-auto text-emerald-400/60 hover:text-emerald-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Banner */}
      <AnimatePresence>
        {state.paymentError && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{state.paymentError}</p>
            <button onClick={() => dispatch({ type: "SET_PAYMENT_ERROR", payload: null })} className="ml-auto text-red-400/60 hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Plan Card */}
      <motion.div {...fadeUp} className={`mb-8 rounded-2xl border p-6 bg-gradient-to-br ${currentPlanData.gradient} ${currentPlanData.border} backdrop-blur-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${currentPlanData.bg} ${currentPlanData.border}`}>
            <currentPlanData.icon className={`w-7 h-7 ${currentPlanData.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <PlanBadge plan={currentPlan} />
              <span className="text-xs text-blue-200/40">Active Plan</span>
            </div>
            <h2 className="text-xl font-black text-white">{currentPlanData.name} Plan</h2>
            <p className="text-sm text-blue-200/50 mt-0.5">{currentPlanData.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            {currentPlanData.price > 0 ? (
              <>
                <div className="text-2xl font-black text-white">{formatNaira(currentPlanData.price)}</div>
                <div className="text-xs text-blue-200/40">per month</div>
              </>
            ) : currentPlan === "agency" ? (
              <div className="text-lg font-black text-amber-400">Custom Pricing</div>
            ) : (
              <div className="text-lg font-black text-slate-400">Free Forever</div>
            )}
          </div>
        </div>

        {/* Usage Summary */}
        <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Projects", value: currentPlanData.limits.projects, icon: Globe },
            { label: "Keywords", value: currentPlanData.limits.keywords, icon: Key },
            { label: "Audits", value: currentPlanData.limits.audits, icon: BarChart2 },
            { label: "Reports", value: currentPlanData.limits.reports, icon: Receipt },
          ].map(item => (
            <div key={item.label} className="text-center">
              <item.icon className={`w-4 h-4 ${currentPlanData.color} mx-auto mb-1`} />
              <div className="text-sm font-black text-white">{item.value}</div>
              <div className="text-xs text-blue-200/40">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Billing Cycle Toggle */}
      <motion.div {...fadeUp} className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm font-semibold transition-colors ${state.billingCycle === "monthly" ? "text-white" : "text-blue-200/40"}`}>Monthly</span>
        <button
          onClick={() => dispatch({ type: "SET_BILLING_CYCLE", payload: state.billingCycle === "monthly" ? "yearly" : "monthly" })}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${state.billingCycle === "yearly" ? "bg-blue-600" : "bg-white/10"}`}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ left: state.billingCycle === "yearly" ? "calc(100% - 1.375rem)" : "4px" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-semibold transition-colors ${state.billingCycle === "yearly" ? "text-white" : "text-blue-200/40"}`}>Yearly</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">Save 20%</span>
        </div>
      </motion.div>

      {/* Plan Cards */}
      <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {PLANS.map((plan, i) => {
          const isCurrent = currentPlan === plan.id;
          const isUpgrade = PLANS.findIndex(p => p.id === currentPlan) < PLANS.findIndex(p => p.id === plan.id);
          const isProcessing = state.processingPlan === plan.id;
          const displayPrice = state.billingCycle === "yearly" ? plan.yearlyPrice : plan.price;
          const monthlyEquiv = state.billingCycle === "yearly" && plan.price > 0 ? Math.round(plan.yearlyPrice / 12) : null;

          return (
            <motion.div key={plan.id}
              initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative group flex flex-col bg-white/5 border rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? "border-blue-500/40 shadow-lg shadow-blue-500/10"
                  : isCurrent
                  ? `${plan.border} shadow-lg`
                  : "border-white/10 hover:border-blue-500/20"
              }`}
            >
              {/* Top accent */}
              <div className={`h-1 w-full ${plan.popular ? "bg-gradient-to-r from-blue-500 to-cyan-400" : isCurrent ? `bg-gradient-to-r ${plan.gradient}` : "bg-white/5"}`} />

              {plan.popular && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">Most Popular</span>
                </div>
              )}
              {isCurrent && !plan.popular && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white">Current</span>
                </div>
              )}

              <div className="p-5 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${plan.bg} ${plan.border} group-hover:scale-110 transition-transform`}>
                  <plan.icon className={`w-5 h-5 ${plan.color}`} />
                </div>

                <h3 className="text-base font-black text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-blue-200/50 mb-4 leading-relaxed">{plan.description}</p>

                <div className="mb-4">
                  {plan.id === "agency" ? (
                    <div className="text-2xl font-black text-amber-400">Custom</div>
                  ) : plan.price === 0 ? (
                    <div className="text-2xl font-black text-white">Free</div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-white">{formatNaira(displayPrice === 0 ? plan.price : (state.billingCycle === "yearly" ? Math.round(plan.yearlyPrice / 12) : plan.price))}</span>
                        <span className="text-xs text-blue-200/40 mb-1">/mo</span>
                      </div>
                      {state.billingCycle === "yearly" && (
                        <p className="text-xs text-emerald-400 mt-0.5">Billed {formatNaira(plan.yearlyPrice)}/yr</p>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-blue-200/60">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${plan.color}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 pb-5">
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-bold text-blue-200/50">
                    Current Plan
                  </div>
                ) : plan.id === "agency" ? (
                  <button onClick={handleContactSales}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400`}>
                    Contact Sales <ChevronRight className="w-4 h-4" />
                  </button>
                ) : plan.price === 0 ? (
                  <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-bold text-blue-200/40">
                    Free Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handlePaystack(plan)}
                    disabled={!!state.processingPlan || isProcessing}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-105 hover:shadow-blue-600/50"
                        : "bg-white/10 hover:bg-white/15 border border-white/20 text-white hover:scale-105"
                    }`}
                  >
                    {isProcessing
                      ? <><RefreshCw className="w-4 h-4 animate-spin" />Processing...</>
                      : isUpgrade
                      ? <><ArrowUp className="w-4 h-4" />{plan.cta}</>
                      : <>{plan.cta}</>}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Billing Summary Cards */}
      <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Payments", value: state.payments.filter(p => p.status === "success").length, icon: Receipt, color: "text-blue-400", sub: "successful transactions" },
          { label: "Total Spent", value: formatNaira(totalSpent / 100), icon: CreditCard, color: "text-emerald-400", sub: "lifetime value" },
          { label: "Current Cycle", value: state.billingCycle === "yearly" ? "Annual" : "Monthly", icon: Clock, color: "text-amber-400", sub: "billing frequency" },
        ].map(card => (
          <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm">
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <div className={`text-xl font-black ${card.color}`}>{state.paymentsLoading ? "--" : card.value}</div>
              <div className="text-xs text-blue-200/40">{card.label}</div>
              <div className="text-xs text-blue-200/25 mt-0.5">{card.sub}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Payment History */}
      <motion.div {...fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" />Payment History
          </h2>
          <div className="flex gap-2">
            <button onClick={loadPayments}
              className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/50 hover:text-white text-xs font-semibold transition-all hover:bg-white/10 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />Refresh
            </button>
            <button onClick={exportCSV} disabled={state.payments.length === 0}
              className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/50 hover:text-white text-xs font-semibold transition-all hover:bg-white/10 flex items-center gap-1.5 disabled:opacity-40">
              <Download className="w-3.5 h-3.5" />Export CSV
            </button>
          </div>
        </div>

        {/* Loading */}
        {state.paymentsLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!state.paymentsLoading && state.paymentsError && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{state.paymentsError}
          </div>
        )}

        {/* Empty */}
        {!state.paymentsLoading && !state.paymentsError && state.payments.length === 0 && (
          <div className="text-center py-12 bg-white/3 border border-white/8 rounded-2xl">
            <Receipt className="w-10 h-10 text-blue-400/20 mx-auto mb-3" />
            <p className="text-blue-200/50 text-sm font-semibold">No payments yet</p>
            <p className="text-blue-200/30 text-xs mt-1">Your payment history will appear here after your first upgrade</p>
          </div>
        )}

        {/* Table */}
        {!state.paymentsLoading && !state.paymentsError && state.payments.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/5 bg-white/3 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
              <span>Reference</span><span>Plan</span><span>Amount</span><span>Status</span><span>Date</span>
            </div>
            <div className="divide-y divide-white/5">
              {state.payments.map((payment, i) => {
                const isSuccess = payment.status === "success";
                return (
                  <motion.div key={payment.id}
                    initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group px-6 py-4 hover:bg-white/5 transition-colors"
                  >
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSuccess ? "bg-emerald-500/15 border border-emerald-500/25" : "bg-red-500/15 border border-red-500/25"}`}>
                          {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                        </div>
                        <span className="text-sm font-mono text-blue-200/60 truncate">{payment.reference}</span>
                      </div>
                      <PlanBadge plan={payment.plan ?? "starter"} />
                      <span className="text-sm font-black text-white">{formatAmount(payment.amount, payment.currency)}</span>
                      <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border w-fit capitalize ${isSuccess ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" : "text-red-400 bg-red-500/15 border-red-500/25"}`}>
                        {payment.status}
                      </span>
                      <span className="text-xs text-blue-200/40">
                        {new Date(payment.paid_at ?? payment.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${isSuccess ? "bg-emerald-500/15 border-emerald-500/25" : "bg-red-500/15 border-red-500/25"}`}>
                        {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <PlanBadge plan={payment.plan ?? "starter"} />
                          <span className={`text-xs font-bold capitalize ${isSuccess ? "text-emerald-400" : "text-red-400"}`}>{payment.status}</span>
                        </div>
                        <p className="text-xs text-blue-200/40 font-mono truncate">{payment.reference}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-black text-white">{formatAmount(payment.amount, payment.currency)}</div>
                        <div className="text-xs text-blue-200/30">{new Date(payment.paid_at ?? payment.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Trust Badges */}
      <motion.div {...fadeUp} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Shield, title: "Secure Payments", desc: "All transactions are encrypted and processed securely via Paystack" },
          { icon: BadgeCheck, title: "Instant Activation", desc: "Your plan upgrades instantly after payment confirmation" },
          { icon: Lock, title: "Cancel Anytime", desc: "No long-term contracts. Downgrade or cancel your plan at any time" },
        ].map(item => (
          <div key={item.title} className="flex items-start gap-3 px-5 py-4 bg-white/3 border border-white/8 rounded-2xl">
            <item.icon className="w-5 h-5 text-blue-400/60 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs text-blue-200/40 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
