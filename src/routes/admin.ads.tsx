import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AdType = Database["public"]["Enums"]["ad_type"];
const TYPES: AdType[] = ["header", "sidebar", "in_content", "sticky_mobile", "popup", "hero"];

export const Route = createFileRoute("/admin/ads")({
  component: AdminAds,
});

function AdminAds() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-ads"],
    queryFn: async () => (await supabase.from("advertisements").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [name, setName] = useState("");
  const [type, setType] = useState<AdType>("in_content");
  const [code, setCode] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    const { error } = await supabase.from("advertisements").insert({ name, type, code });
    if (error) toast.error(error.message);
    else { toast.success("Ad created"); setName(""); setCode(""); qc.invalidateQueries({ queryKey: ["admin-ads"] }); }
  }
  async function toggle(id: string, enabled: boolean) {
    await supabase.from("advertisements").update({ enabled: !enabled }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-ads"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete ad?")) return;
    await supabase.from("advertisements").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-ads"] });
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Advertisements</h1>
      <form onSubmit={add} className="bg-white p-4 rounded-2xl ring-1 ring-black/5 space-y-3 mb-6">
        <div className="flex gap-2">
          <input className="flex-1 p-2.5 rounded-lg border border-zinc-200 text-sm" placeholder="Ad name" value={name} onChange={(e) => setName(e.target.value)} />
          <select className="p-2.5 rounded-lg border border-zinc-200 text-sm" value={type} onChange={(e) => setType(e.target.value as AdType)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <textarea className="w-full p-2.5 rounded-lg border border-zinc-200 text-xs font-mono h-24" placeholder="AdSense code / HTML / iframe" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"><Plus className="size-4" /> Create ad</button>
      </form>
      <div className="bg-white rounded-2xl ring-1 ring-black/5 divide-y divide-zinc-100">
        {data?.map((a) => (
          <div key={a.id} className="p-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-medium truncate">{a.name}</div>
              <div className="text-xs text-zinc-400">{a.type}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(a.id, a.enabled)} className={`text-xs px-3 py-1 rounded-full ${a.enabled ? "bg-success/10 text-success" : "bg-zinc-100 text-zinc-500"}`}>
                {a.enabled ? "Enabled" : "Disabled"}
              </button>
              <button onClick={() => remove(a.id)} className="p-1.5 text-zinc-500 hover:text-live-red"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
