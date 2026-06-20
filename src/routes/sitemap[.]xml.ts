import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/upcoming", "/leagues", "/about", "/contact", "/privacy", "/terms"];
        const entries: { path: string; lastmod?: string; changefreq?: string; priority?: string }[] = staticPaths.map((p) => ({
          path: p,
          changefreq: p === "/" ? "hourly" : "weekly",
          priority: p === "/" ? "1.0" : "0.6",
        }));

        const [sports, comps, matches] = await Promise.all([
          supabaseAdmin.from("sports").select("slug"),
          supabaseAdmin.from("competitions").select("slug"),
          supabaseAdmin.from("matches").select("slug, updated_at").limit(5000),
        ]);
        sports.data?.forEach((s) => entries.push({ path: `/sport/${s.slug}`, changefreq: "daily", priority: "0.7" }));
        comps.data?.forEach((c) => entries.push({ path: `/competition/${c.slug}`, changefreq: "daily", priority: "0.7" }));
        matches.data?.forEach((m) =>
          entries.push({ path: `/watch/${m.slug}`, lastmod: m.updated_at, changefreq: "hourly", priority: "0.8" }),
        );

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
