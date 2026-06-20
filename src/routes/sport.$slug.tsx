import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SportRail } from "@/components/SportRail";
import { MatchCard } from "@/components/MatchCard";

export const Route = createFileRoute("/sport/$slug")({
  component: SportPage,
});

function SportPage() {
  const { slug } = Route.useParams();
  const { data: sport } = useQuery({
    queryKey: ["sport", slug],
    queryFn: async () => {
      const { data } = await supabase.from("sports").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });
  const { data: matches } = useQuery({
    queryKey: ["sport-matches", sport?.id],
    enabled: !!sport?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("*, competitions(name, slug)")
        .eq("sport_id", sport!.id)
        .order("match_date", { ascending: true });
      return data ?? [];
    },
  });

  const live = matches?.filter((m) => m.status === "live") ?? [];
  const upcoming = matches?.filter((m) => m.status === "upcoming") ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SportRail activeSlug={slug} />
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <h1 className="text-3xl font-bold text-navy">{sport?.name ?? slug}</h1>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">Live now</h2>
          {live.length === 0 ? (
            <p className="text-sm text-zinc-500">No live matches.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {live.map((m: any) => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-zinc-500">No upcoming matches scheduled.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((m: any) => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
        </section>
        <Link to="/" className="inline-block text-sm text-brand-blue">← Back to all sports</Link>
      </main>
      <Footer />
    </div>
  );
}
