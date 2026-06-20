import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — IdeaClick Sports" },
      { name: "description", content: "How IdeaClick Sports handles your data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <h1 className="text-3xl font-bold text-navy">Privacy Policy</h1>
        <p className="text-zinc-600 leading-relaxed">
          This page is maintained by IdeaClick Sports to summarize how we handle visitor data on this platform.
          We log anonymous page visits to understand traffic patterns. We do not sell personal data.
          Third-party embedded video players may set their own cookies — refer to those providers for their policies.
        </p>
      </main>
      <Footer />
    </div>
  ),
});
