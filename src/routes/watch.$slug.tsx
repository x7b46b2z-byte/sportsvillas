import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmbedPlayer } from "@/components/EmbedPlayer";
import { MatchCard } from "@/components/MatchCard";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/watch/$slug")({
  component: Watch,
});

function Watch() {
  const { slug } = Route.useParams();
  const { data: match, isLoading } = useQuery({
    queryKey: ["match", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*, competitions(name, slug), sports(name, slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: related } = useQuery({
    queryKey: ["related", match?.sport_id],
    enabled: !!match?.sport_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("*, competitions(name, slug)")
        .eq("sport_id", match!.sport_id)
        .neq("id", match!.id)
        .order("match_date", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  if (isLoading) return <div className="min-h-screen grid place-items-center text-zinc-500">Loading…</div>;
  if (!match) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-screen-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-2">Stream not found</h1>
          <Link to="/" className="text-brand-blue">← Back home</Link>
        </div>
      </div>
    );
  }

  const time = new Date(match.match_date);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <AdSlot type="header" />
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            {match.status === "live" && (
              <span className="bg-live-red text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1.5">
                <span className="size-1.5 bg-white rounded-full animate-pulse-soft" /> LIVE
              </span>
            )}
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              {(match as any).competitions?.name}
            </span>
            <span className="text-xs text-zinc-500">
              {time.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-navy">
            {match.team_a} <span className="text-zinc-400 mx-2">vs</span> {match.team_b}
          </h1>
        </div>

        <EmbedPlayer html={match.embed_code} />

        {match.description && (
          <div className="bg-white p-6 rounded-2xl ring-1 ring-black/5">
            <h2 className="text-sm font-semibold text-navy mb-2">About this match</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">{match.description}</p>
          </div>
        )}

        <AdSlot type="in_content" />

        {related && related.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">Related streams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((m: any) => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}