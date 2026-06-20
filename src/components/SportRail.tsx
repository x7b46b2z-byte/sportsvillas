import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SportRail({ activeSlug }: { activeSlug?: string }) {
  const { data: sports } = useQuery({
    queryKey: ["sports"],
    queryFn: async () => {
      const { data } = await supabase.from("sports").select("*").order("sort_order");
      return data ?? [];
    },
  });

  return (
    <div className="bg-white border-b border-zinc-200 overflow-x-auto hide-scrollbar py-3">
      <div className="max-w-screen-xl mx-auto px-4 flex gap-2">
        <Link
          to="/"
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeSlug ? "bg-navy text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          All Sports
        </Link>
        {sports?.map((s) => (
          <Link
            key={s.id}
            to="/sport/$slug"
            params={{ slug: s.slug }}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeSlug === s.slug ? "bg-navy text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
