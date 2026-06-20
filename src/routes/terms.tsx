import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — IdeaClick Sports" },
      { name: "description", content: "Terms of service for IdeaClick Sports." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        <h1 className="text-3xl font-bold text-navy">Terms of Service</h1>
        <p className="text-zinc-600 leading-relaxed">
          IdeaClick Sports is an aggregator of publicly available third-party streams. We do not host or
          broadcast any content. All trademarks belong to their respective owners. Use of this site is at
          your own risk and subject to applicable local laws.
        </p>
      </main>
      <Footer />
    </div>
  ),
});
