import { Link } from "@tanstack/react-router";
import type { Tables } from "@/integrations/supabase/types";

type Match = Tables<"matches"> & { competitions?: { name: string } | null };

function teamInitial(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function MatchCard({ match }: { match: Match }) {
  const live = match.status === "live";
  const upcoming = match.status === "upcoming";
  const time = new Date(match.match_date);
  return (
    <Link
      to="/watch/$slug"
      params={{ slug: match.slug }}
      className="block bg-white p-4 rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider truncate">
          {match.competitions?.name ?? "—"}
        </span>
        {live ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-live-red">
            <span className="size-1.5 bg-live-red rounded-full animate-pulse-soft" />
            LIVE
          </span>
        ) : upcoming ? (
          <span className="text-[10px] font-bold text-brand-blue">
            {time.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        ) : (
          <span className="text-[10px] font-bold text-zinc-400">ENDED</span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Row name={match.team_a} logo={match.team_a_logo} />
        <Row name={match.team_b} logo={match.team_b_logo} />
      </div>
    </Link>
  );
}

function Row({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex items-center gap-3">
      {logo ? (
        <img src={logo} alt="" className="size-8 rounded-full object-cover" loading="lazy" />
      ) : (
        <div className="size-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan grid place-items-center text-white text-[10px] font-bold">
          {teamInitial(name)}
        </div>
      )}
      <span className="font-medium text-sm truncate">{name}</span>
    </div>
  );
}
