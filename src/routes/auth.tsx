import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

const credSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Sign in — IdeaClick Sports" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="min-h-screen bg-navy grid place-items-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <Link to="/" className="text-xl font-semibold tracking-tight text-gradient-brand italic block mb-6">
          IDEACLICK
        </Link>
        <h1 className="text-2xl font-bold text-navy mb-1">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          {mode === "signin" ? "Sign in to manage your streams." : "First account becomes the admin."}
        </p>

        <button
          onClick={google}
          type="button"
          className="w-full border border-zinc-200 rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-50 transition mb-4"
        >
          Continue with Google
        </button>

        <div className="relative my-4 text-center text-xs text-zinc-400">
          <span className="bg-white px-2 relative z-10">or with email</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-200 -z-0" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <button
            disabled={loading}
            className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold hover:bg-navy/90 transition disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-xs text-zinc-500 mt-4 hover:text-navy"
        >
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
