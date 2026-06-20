import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/leagues")({
  head: () => ({
    meta: [
      { title: "All Leagues & Competitions — IdeaClick Sports" },
      { name: "description", content: "Browse every league and competition we cover, from the Premier League to the NBA, IPL, F1 and more." },
      { property: "og:url", content: "/leagues" },
    ],
    links: [{ rel: "canonical", href: "/leagues" }],
  }),
  component: Leagues,
});

function Leagues() {
  const { data } = useQuery({
    queryKey: ["all-comps"],
    queryFn: async () => {
      const { data } = await supabase.from("competitions").select("*, sports(name, slug)").order("name");
      return data ?? [];
    },
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-navy">All leagues & competitions</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data?.map((c: any) => (
            <Link
              key={c.id}
              to="/competition/$slug"
              params={{ slug: c.slug }}
              className="bg-white p-4 rounded-2xl ring-1 ring-black/5 hover:shadow-md transition-shadow"
            >
              <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{c.sports?.name}</div>
              <div className="text-sm font-semibold text-navy">{c.name}</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
