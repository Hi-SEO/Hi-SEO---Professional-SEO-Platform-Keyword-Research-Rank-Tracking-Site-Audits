import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Mail, Lock } from "lucide-react"

export default function AuthPlaceholder({ type }: { type: "login" | "signup" }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-3xl tracking-tighter">
              <span className="bg-primary text-white rounded-md w-10 h-10 flex items-center justify-center mr-1 shadow-md">Hi</span>
              <span className="text-foreground">SEO</span>
            </Link>
          </div>
          
          <div className="bg-card border shadow-soft rounded-xl p-8">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold tracking-tight">
                {type === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {type === "login" 
                  ? "Enter your credentials to access your dashboard" 
                  : "Start your free 7-day trial. No credit card required."}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    placeholder="you@company.com" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  {type === "login" && (
                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
              
              <Button className="w-full mt-6" variant="premium" asChild>
                <Link to="/app">
                  {type === "login" ? "Sign In" : "Create Account"}
                </Link>
              </Button>
            </div>
            
            <div className="mt-6 text-center text-sm">
              {type === "login" ? (
                <span className="text-muted-foreground">Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link></span>
              ) : (
                <span className="text-muted-foreground">Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link></span>
              )}
            </div>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            By continuing, you agree to Hi-SEO's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
      
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/90 to-blue-900 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-lg z-10 space-y-8">
          <blockquote className="text-2xl font-medium leading-relaxed">
            "Hi-SEO completely transformed how our agency handles client reporting. The AI-assisted content brief generation alone saves us 20 hours a week."
          </blockquote>
          <div>
            <div className="font-bold text-lg">Sarah Jenkins</div>
            <div className="text-white/70">VP of Organic Growth, Elevate Digital</div>
          </div>
        </div>
      </div>
    </div>
  )
}