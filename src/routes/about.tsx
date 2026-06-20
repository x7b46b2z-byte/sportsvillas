import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — IdeaClick Sports" },
      { name: "description", content: "IdeaClick Sports is a global sports streaming aggregator — every major league in one place." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-zinc">
        <h1 className="text-3xl font-bold text-navy mb-4">About IdeaClick Sports</h1>
        <p className="text-zinc-600 leading-relaxed">
          IdeaClick Sports is a premium aggregator for live and upcoming sports streams worldwide.
          We don't host or broadcast streams ourselves — instead, we curate publicly available embeddable
          players from third parties and present them in one fast, mobile-friendly interface.
        </p>
        <p className="text-zinc-600 leading-relaxed mt-4">
          Our coverage spans football, cricket, basketball, tennis, Formula 1, UFC, boxing, rugby,
          volleyball, esports and more — from the Premier League to the IPL, NBA to the F1 World Championship.
        </p>
      </main>
      <Footer />
    </div>
  );
}
