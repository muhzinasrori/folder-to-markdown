import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// ============================================================
// PWA MANIFEST — identitas aplikasi saat di-install ke
// layar utama HP, dan dibaca juga oleh mesin pencari sebagai
// sinyal kualitas (nama, warna tema, ikon).
// Setelah deploy: tersedia di /manifest.webmanifest
// ============================================================
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d1117",
    theme_color: "#0d1117",
    lang: "id",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}