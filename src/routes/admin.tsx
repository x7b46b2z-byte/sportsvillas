import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, Trophy, Goal, Megaphone, Tv, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen grid place-items-center text-zinc-500">Checking access…</div>;
  }

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/matches", label: "Matches", icon: Tv },
    { to: "/admin/sports", label: "Sports", icon: Goal },
    { to: "/admin/competitions", label: "Competitions", icon: Trophy },
    { to: "/admin/ads", label: "Advertisements", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="md:w-64 bg-navy text-white p-6 md:min-h-screen">
        <Link to="/" className="text-xl font-semibold tracking-tight text-gradient-brand italic block mb-8">
          IDEACLICK
        </Link>
        <nav className="space-y-1">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                  active ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5"
                }`}
              >
                <l.icon className="size-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white mt-8">
          <ArrowLeft className="size-3" /> Back to site
        </Link>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
