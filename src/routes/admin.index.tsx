import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tv, Radio, Calendar, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [total, live, upcoming, visits] = await Promise.all([
        supabase.from("matches").select("*", { count: "exact", head: true }),
        supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "live"),
        supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("visitors").select("*", { count: "exact", head: true }),
      ]);
      return {
        total: total.count ?? 0,
        live: live.count ?? 0,
        upcoming: upcoming.count ?? 0,
        visits: visits.count ?? 0,
      };
    },
  });
  const stats = [
    { label: "Total streams", value: data?.total ?? 0, icon: Tv },
    { label: "Live now", value: data?.live ?? 0, icon: Radio },
    { label: "Upcoming", value: data?.upcoming ?? 0, icon: Calendar },
    { label: "Visits", value: data?.visits ?? 0, icon: Eye },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl ring-1 ring-black/5">
            <s.icon className="size-5 text-brand-blue mb-3" />
            <div className="text-3xl font-bold tabular-nums text-navy">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-zinc-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
