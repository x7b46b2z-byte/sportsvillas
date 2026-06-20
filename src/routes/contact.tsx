import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — IdeaClick Sports" },
      { name: "description", content: "Get in touch with the IdeaClick Sports team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    toast.success("Thanks! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-navy mb-2">Contact</h1>
        <p className="text-zinc-600 mb-8">Got a tip, partnership request, or bug to report? Send us a message.</p>
        <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-2xl ring-1 ring-black/5">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <div>
            <label className="text-sm font-medium text-navy block mb-1">Message</label>
            <textarea
              className="w-full p-3 rounded-lg border border-zinc-200 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button className="w-full bg-navy text-white py-3 rounded-lg text-sm font-semibold hover:bg-navy/90 transition">
            Send message
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-navy block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
      />
    </div>
  );
}
