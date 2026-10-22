import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// ============================================================
// ROBOTS — "rambu lalu lintas" untuk robot Google/Bing.
// Setelah deploy, file ini otomatis tersedia di /robots.txt.
// Isinya: semua robot boleh menjelajah semua halaman,
// dan lokasi sitemap diberitahu di sini.
// ============================================================
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}