import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SportRail } from "@/components/SportRail";
import { MatchCard } from "@/components/MatchCard";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IdeaClick Sports — Live Football, Cricket, NBA, F1 Streams" },
      { name: "description", content: "Watch live sports streams from around the world. Football, cricket, basketball, F1, UFC, tennis and more. Free, instant, mobile-friendly." },
      { property: "og:title", content: "IdeaClick Sports — Live Streams" },
      { property: "og:description", content: "Live sports streams across every major league, all in one place." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { data: matches } = useQuery({
    queryKey: ["home-matches"],
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("*, competitions(name, slug)")
        .order("match_date", { ascending: true })
        .limit(40);
      return data ?? [];
    },
  });

  const { data: comps } = useQuery({
    queryKey: ["home-competitions"],
    queryFn: async () => {
      const { data } = await supabase.from("competitions").select("*").limit(8);
      return data ?? [];
    },
  });

  const live = matches?.filter((m) => m.status === "live") ?? [];
  const upcoming = matches?.filter((m) => m.status === "upcoming") ?? [];
  const featured = matches?.find((m) => m.is_featured && m.status === "live") ?? live[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <SportRail />
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-12">
        {featured && (
          <section>
            <div className="relative overflow-hidden bg-navy rounded-3xl shadow-2xl ring-1 ring-black/5">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/25 to-brand-cyan/20" />
              <div className="relative px-6 py-10 md:py-16 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-live-red text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1.5">
                    <span className="size-1.5 bg-white rounded-full animate-pulse-soft" />
                    LIVE NOW
                  </span>
                  <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                    {(featured as any).competitions?.name ?? "Featured"}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full max-w-2xl gap-4 md:gap-12 mb-10">
                  <HeroTeam name={featured.team_a} logo={featured.team_a_logo} />
                  <div className="text-white text-4xl md:text-6xl font-medium tracking-tighter">
                    VS
                  </div>
                  <HeroTeam name={featured.team_b} logo={featured.team_b_logo} />
                </div>
                <Link
                  to="/watch/$slug"
                  params={{ slug: featured.slug }}
                  className="flex items-center gap-2 bg-white text-navy font-semibold px-8 py-3.5 rounded-full hover:bg-zinc-100 transition-all active:scale-95 shadow-xl"
                >
                  <Play className="size-5 fill-current" />
                  Watch Stream
                </Link>
              </div>
            </div>
          </section>
        )}

        <Section title="Live Events" emptyText="No live matches right now.">
          {live.slice(0, 6).map((m: any) => <MatchCard key={m.id} match={m} />)}
        </Section>

        <AdSlot type="in_content" />

        <Section title="Upcoming" emptyText="Nothing scheduled yet.">
          {upcoming.slice(0, 6).map((m: any) => <MatchCard key={m.id} match={m} />)}
        </Section>

        <section className="pb-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Top Competitions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {comps?.map((c) => (
              <Link
                to="/competition/$slug"
                params={{ slug: c.slug }}
                key={c.id}
                className="flex flex-col items-center p-4 bg-white rounded-2xl ring-1 ring-black/5 hover:shadow-md transition-shadow"
              >
                <div className="size-12 bg-gradient-to-br from-brand-blue/10 to-brand-cyan/10 rounded-full mb-3 grid place-items-center text-[10px] font-bold text-navy">
                  {c.name.split(" ").map((w) => w[0]).join("").slice(0, 3)}
                </div>
                <span className="text-xs font-medium text-center">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function HeroTeam({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      {logo ? (
        <img src={logo} alt={name} className="size-20 md:size-28 rounded-full object-cover mb-4 bg-white/10" />
      ) : (
        <div className="size-20 md:size-28 bg-white/10 rounded-full outline-1 -outline-offset-1 outline-white/10 grid place-items-center mb-4 text-white text-2xl font-bold">
          {name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
      )}
      <h2 className="text-white font-semibold text-lg md:text-2xl tracking-tight text-center">{name}</h2>
    </div>
  );
}

function Section({
  title,
  children,
  emptyText,
}: {
  title: string;
  children: React.ReactNode;
  emptyText: string;
}) {
  const arr = Array.isArray(children) ? children : [children];
  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold tracking-tight text-navy">{title}</h3>
      {arr.filter(Boolean).length === 0 ? (
        <p className="text-sm text-zinc-500">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
      )}
    </section>
  );
}
