import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SportRail } from "@/components/SportRail";
import { MatchCard } from "@/components/MatchCard";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { title: "Upcoming Matches — IdeaClick Sports" },
      { name: "description", content: "Full schedule of upcoming live sports streams across every league." },
      { property: "og:url", content: "/upcoming" },
    ],
    links: [{ rel: "canonical", href: "/upcoming" }],
  }),
  component: Upcoming,
});

function Upcoming() {
  const { data: matches } = useQuery({
    queryKey: ["upcoming-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("*, competitions(name, slug)")
        .eq("status", "upcoming")
        .order("match_date", { ascending: true })
        .limit(60);
      return data ?? [];
    },
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SportRail />
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-navy">Upcoming matches</h1>
        {!matches?.length ? (
          <p className="text-sm text-zinc-500">Nothing scheduled yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m: any) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

