import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AdType = Database["public"]["Enums"]["ad_type"];

export function AdSlot({ type, className = "" }: { type: AdType; className?: string }) {
  const { data: ad } = useQuery({
    queryKey: ["ad", type],
    queryFn: async () => {
      const { data } = await supabase
        .from("advertisements")
        .select("*")
        .eq("type", type)
        .eq("enabled", true)
        .limit(1)
        .maybeSingle();
      return data;
    },
  });
  if (!ad) return null;
  return (
    <div className={`bg-zinc-200/50 rounded-2xl p-6 border border-zinc-200 ${className}`}>
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
        Sponsored
      </span>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: ad.code }} />
    </div>
  );
}
