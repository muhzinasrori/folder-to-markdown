import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// ============================================================
// SITEMAP — "daftar isi" situs untuk Google.
// Setelah deploy, file ini otomatis tersedia di /sitemap.xml
// dan nantinya disubmit ke Google Search Console.
// ============================================================
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Kalau nanti ada halaman baru (mis. /tentang, /faq),
    // tambahkan di sini:
    // { url: `${siteConfig.url}/faq`, ... },
  ];
}