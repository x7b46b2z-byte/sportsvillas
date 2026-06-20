import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type MatchRow = Database["public"]["Tables"]["matches"]["Row"];
type MatchStatus = Database["public"]["Enums"]["match_status"];

export const Route = createFileRoute("/admin/matches")({
  component: AdminMatches,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminMatches() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<MatchRow | null>(null);
  const [open, setOpen] = useState(false);
  const { data: matches } = useQuery({
    queryKey: ["admin-matches"],
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("*, sports(name), competitions(name)")
        .order("match_date", { ascending: false });
      return data ?? [];
    },
  });

  async function remove(id: string) {
    if (!confirm("Delete this match?")) return;
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-matches"] });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Matches</h1>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="inline-flex items-center gap-1.5 bg-navy text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus className="size-4" /> New match
        </button>
      </div>
      <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3 hidden md:table-cell">Sport</th>
              <th className="text-left p-3 hidden md:table-cell">Date</th>
              <th className="text-left p-3">Status</th>
              <th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {matches?.map((m: any) => (
              <tr key={m.id} className="border-t border-zinc-100">
                <td className="p-3 font-medium">{m.title}</td>
                <td className="p-3 hidden md:table-cell text-zinc-500">{m.sports?.name}</td>
                <td className="p-3 hidden md:table-cell text-zinc-500">
                  {new Date(m.match_date).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="p-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(m); setOpen(true); }} className="p-1.5 text-zinc-500 hover:text-navy">
                    <Pencil className="size-4" />
                  </button>
                  <button onClick={() => remove(m.id)} className="p-1.5 text-zinc-500 hover:text-live-red">
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {matches?.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-zinc-400">No matches yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {open && <MatchForm initial={editing} onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["admin-matches"] })} />}
    </div>
  );
}

function StatusBadge({ status }: { status: MatchStatus }) {
  const cls = status === "live"
    ? "bg-live-red/10 text-live-red"
    : status === "upcoming"
    ? "bg-brand-blue/10 text-brand-blue"
    : "bg-zinc-100 text-zinc-500";
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${cls}`}>{status}</span>;
}

function MatchForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: MatchRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: sports } = useQuery({
    queryKey: ["all-sports"],
    queryFn: async () => (await supabase.from("sports").select("*").order("name")).data ?? [],
  });
  const { data: comps } = useQuery({
    queryKey: ["all-comps-admin"],
    queryFn: async () => (await supabase.from("competitions").select("*").order("name")).data ?? [],
  });

  const [f, setF] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    sport_id: initial?.sport_id ?? "",
    competition_id: initial?.competition_id ?? "",
    team_a: initial?.team_a ?? "",
    team_b: initial?.team_b ?? "",
    team_a_logo: initial?.team_a_logo ?? "",
    team_b_logo: initial?.team_b_logo ?? "",
    match_date: initial ? new Date(initial.match_date).toISOString().slice(0, 16) : "",
    status: initial?.status ?? ("upcoming" as MatchStatus),
    embed_code: initial?.embed_code ?? "",
    description: initial?.description ?? "",
    is_featured: initial?.is_featured ?? false,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...f,
      slug: f.slug || slugify(f.title),
      match_date: new Date(f.match_date).toISOString(),
      competition_id: f.competition_id || null,
      team_a_logo: f.team_a_logo || null,
      team_b_logo: f.team_b_logo || null,
      embed_code: f.embed_code || null,
      description: f.description || null,
    };
    if (!payload.title || !payload.sport_id || !payload.team_a || !payload.team_b || !payload.match_date) {
      toast.error("Fill in all required fields");
      return;
    }
    const op = initial
      ? supabase.from("matches").update(payload).eq("id", initial.id)
      : supabase.from("matches").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      onSaved();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4" onClick={onClose}>
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-3"
      >
        <h2 className="text-lg font-bold text-navy">{initial ? "Edit match" : "New match"}</h2>
        <Field label="Title *"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) })} /></Field>
        <Field label="Slug"><input className={inputCls} value={f.slug} onChange={(e) => setF({ ...f, slug: slugify(e.target.value) })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sport *">
            <select className={inputCls} value={f.sport_id} onChange={(e) => setF({ ...f, sport_id: e.target.value })}>
              <option value="">—</option>
              {sports?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Competition">
            <select className={inputCls} value={f.competition_id ?? ""} onChange={(e) => setF({ ...f, competition_id: e.target.value })}>
              <option value="">—</option>
              {comps?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Team A *"><input className={inputCls} value={f.team_a} onChange={(e) => setF({ ...f, team_a: e.target.value })} /></Field>
          <Field label="Team B *"><input className={inputCls} value={f.team_b} onChange={(e) => setF({ ...f, team_b: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Team A logo URL"><input className={inputCls} value={f.team_a_logo ?? ""} onChange={(e) => setF({ ...f, team_a_logo: e.target.value })} /></Field>
          <Field label="Team B logo URL"><input className={inputCls} value={f.team_b_logo ?? ""} onChange={(e) => setF({ ...f, team_b_logo: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date & time *">
            <input type="datetime-local" className={inputCls} value={f.match_date} onChange={(e) => setF({ ...f, match_date: e.target.value })} />
          </Field>
          <Field label="Status">
            <select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as MatchStatus })}>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </select>
          </Field>
        </div>
        <Field label="Embed code (iframe HTML)">
          <textarea className={`${inputCls} font-mono text-xs h-24`} value={f.embed_code ?? ""} onChange={(e) => setF({ ...f, embed_code: e.target.value })} placeholder='<iframe src="..."></iframe>' />
        </Field>
        <Field label="Description">
          <textarea className={`${inputCls} h-20`} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.is_featured} onChange={(e) => setF({ ...f, is_featured: e.target.checked })} />
          Featured on homepage hero
        </label>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-sm">Cancel</button>
          <button className="flex-1 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold">Save</button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full p-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy block mb-1">{label}</label>
      {children}
    </div>
  );
}
