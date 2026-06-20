import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/competitions")({
  component: AdminComps,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminComps() {
  const qc = useQueryClient();
  const { data: sports } = useQuery({ queryKey: ["sports-list"], queryFn: async () => (await supabase.from("sports").select("*").order("name")).data ?? [] });
  const { data } = useQuery({
    queryKey: ["admin-comps"],
    queryFn: async () => (await supabase.from("competitions").select("*, sports(name)").order("name")).data ?? [],
  });
  const [name, setName] = useState("");
  const [sportId, setSportId] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !sportId) return;
    const { error } = await supabase.from("competitions").insert({ name, slug: slugify(name), sport_id: sportId });
    if (error) toast.error(error.message);
    else { toast.success("Added"); setName(""); qc.invalidateQueries({ queryKey: ["admin-comps"] }); }
  }
  async function remove(id: string) {
    if (!confirm("Delete competition?")) return;
    const { error } = await supabase.from("competitions").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-comps"] }); }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Competitions</h1>
      <form onSubmit={add} className="bg-white p-4 rounded-2xl ring-1 ring-black/5 flex flex-wrap gap-2 mb-6">
        <input className="flex-1 min-w-40 p-2.5 rounded-lg border border-zinc-200 text-sm" placeholder="Competition name" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="p-2.5 rounded-lg border border-zinc-200 text-sm" value={sportId} onChange={(e) => setSportId(e.target.value)}>
          <option value="">Sport…</option>
          {sports?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="bg-navy text-white px-4 rounded-lg text-sm font-medium flex items-center gap-1"><Plus className="size-4" /> Add</button>
      </form>
      <div className="bg-white rounded-2xl ring-1 ring-black/5 divide-y divide-zinc-100">
        {data?.map((c: any) => (
          <div key={c.id} className="p-3 flex items-center justify-between">
            <span><span className="font-medium">{c.name}</span><span className="text-zinc-400 text-xs ml-2">{c.sports?.name} · /{c.slug}</span></span>
            <button onClick={() => remove(c.id)} className="p-1.5 text-zinc-500 hover:text-live-red"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
