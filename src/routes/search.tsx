import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional().default("") }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const term = q.trim();
  const { data } = useQuery({
    queryKey: ["search", term],
    enabled: term.length > 0,
    queryFn: async () => {
      const like = `%${term}%`;
      const { data } = await supabase
        .from("matches")
        .select("*, competitions(name, slug)")
        .or(`title.ilike.${like},team_a.ilike.${like},team_b.ilike.${like}`)
        .limit(40);
      return data ?? [];
    },
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-navy">
          {term ? <>Results for "{term}"</> : "Search"}
        </h1>
        {!term ? (
          <p className="text-sm text-zinc-500">Type a team, league, or match name above.</p>
        ) : !data?.length ? (
          <p className="text-sm text-zinc-500">No matches found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((m: any) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
