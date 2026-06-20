import { Link, useNavigate } from "@tanstack/react-router";
import { Search, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <nav className="sticky top-0 z-50 bg-navy text-white px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold tracking-tight text-gradient-brand italic">
            IDEACLICK
          </Link>
          <div className="hidden md:flex gap-4 text-sm font-medium text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors" activeProps={{ className: "text-white" }} activeOptions={{ exact: true }}>Live</Link>
            <Link to="/upcoming" className="hover:text-white transition-colors" activeProps={{ className: "text-white" }}>Schedule</Link>
            <Link to="/leagues" className="hover:text-white transition-colors" activeProps={{ className: "text-white" }}>Leagues</Link>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
          }}
          className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 flex-1 max-w-sm"
        >
          <Search className="size-4 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search teams, leagues, matches"
            className="bg-transparent text-sm placeholder:text-zinc-500 outline-none flex-1"
          />
        </form>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-cyan hover:text-white transition-colors">
              <Shield className="size-4" /> Admin
            </Link>
          )}
          {user ? (
            <button onClick={() => signOut()} className="p-2 text-zinc-400 hover:text-white" aria-label="Sign out">
              <LogOut className="size-4" />
            </button>
          ) : (
            <Link to="/auth" className="bg-brand-blue hover:opacity-90 transition-opacity text-white text-sm font-medium py-1.5 px-4 rounded-full shadow-lg">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
