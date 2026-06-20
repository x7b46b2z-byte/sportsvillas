import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";

export const Route = createFileRoute("/competition/$slug")({
  component: CompPage,
});

function CompPage() {
  const { slug } = Route.useParams();
  const { data: comp } = useQuery({
    queryKey: ["comp", slug],
    queryFn: async () => {
      const { data } = await supabase.from("competitions").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });
  const { data: matches } = useQuery({
    queryKey: ["comp-matches", comp?.id],
    enabled: !!comp?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("*, competitions(name, slug)")
        .eq("competition_id", comp!.id)
        .order("match_date", { ascending: true });
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-navy">{comp?.name ?? slug}</h1>
        {!matches?.length ? (
          <p className="text-sm text-zinc-500">No matches yet for this competition.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m: any) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
        <Link to="/" className="inline-block text-sm text-brand-blue">← Home</Link>
      </main>
      <Footer />
    </div>
  );
}
