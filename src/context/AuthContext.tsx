import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  plan: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  error: null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  async function fetchProfile(userId: string) {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (profileError) {
        if (profileError.code !== "PGRST116") {
          console.error("Profile fetch error:", profileError);
        }
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error("Profile fetch exception:", err);
      return null;
    }
  }

  async function refreshProfile() {
    if (!user) return;
    const data = await fetchProfile(user.id);
    if (mountedRef.current) setProfile(data);
  }

  useEffect(() => {
    mountedRef.current = true;

    let authTimeout: ReturnType<typeof setTimeout>;

    async function initAuth() {
      try {
        authTimeout = setTimeout(() => {
          if (mountedRef.current) {
            setLoading(false);
          }
        }, 5000);

        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        clearTimeout(authTimeout);

        if (!mountedRef.current) return;

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          const profileData = await fetchProfile(initialSession.user.id);
          if (mountedRef.current) {
            setProfile(profileData);
          }
        }

        if (mountedRef.current) {
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Auth init error:", err);
        if (mountedRef.current) {
          setError(err?.message ?? "Auth initialization failed");
          setLoading(false);
        }
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mountedRef.current) return;

      if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const profileData = await fetchProfile(newSession.user.id);
          if (mountedRef.current) {
            setProfile(profileData);
          }
        }
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }

      if (mountedRef.current) {
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      if (mountedRef.current) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, error, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
