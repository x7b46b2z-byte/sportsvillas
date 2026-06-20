import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/sports")({
  component: AdminSports,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminSports() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-sports"],
    queryFn: async () => (await supabase.from("sports").select("*").order("sort_order")).data ?? [],
  });
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const { error } = await supabase.from("sports").insert({ name, slug: slugify(name), icon: icon || null });
    if (error) toast.error(error.message);
    else { toast.success("Added"); setName(""); setIcon(""); qc.invalidateQueries({ queryKey: ["admin-sports"] }); qc.invalidateQueries({ queryKey: ["sports"] }); }
  }
  async function remove(id: string) {
    if (!confirm("Delete sport?")) return;
    const { error } = await supabase.from("sports").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-sports"] }); }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Sports</h1>
      <form onSubmit={add} className="bg-white p-4 rounded-2xl ring-1 ring-black/5 flex flex-wrap gap-2 mb-6">
        <input className="flex-1 min-w-40 p-2.5 rounded-lg border border-zinc-200 text-sm" placeholder="Sport name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-24 p-2.5 rounded-lg border border-zinc-200 text-sm" placeholder="Icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
        <button className="bg-navy text-white px-4 rounded-lg text-sm font-medium flex items-center gap-1"><Plus className="size-4" /> Add</button>
      </form>
      <div className="bg-white rounded-2xl ring-1 ring-black/5 divide-y divide-zinc-100">
        {data?.map((s) => (
          <div key={s.id} className="p-3 flex items-center justify-between">
            <span><span className="mr-2">{s.icon}</span><span className="font-medium">{s.name}</span><span className="text-zinc-400 text-xs ml-2">/{s.slug}</span></span>
            <button onClick={() => remove(s.id)} className="p-1.5 text-zinc-500 hover:text-live-red"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
