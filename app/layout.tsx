import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================
// VIEWPORT
// Sejak Next.js 15+, themeColor & colorScheme WAJIB di sini
// (dipisah dari metadata), kalau tidak muncul warning di build.
// ============================================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0d1117",
};

// ============================================================
// METADATA SEO LENGKAP
// Semua nilai di bawah ini akan muncul sebagai <meta> tag di
// HTML awal — itulah yang dibaca Googlebot saat pertama kali
// menjelajah halaman kamu.
// ============================================================
export const metadata: Metadata = {
  // Wajib: dasar untuk menyelesaikan semua URL relatif
  // (canonical, og:image, sitemap). Mencegah warning metadataBase.
  metadataBase: new URL(siteConfig.url),

  // Judul di tab browser & hasil pencarian.
  // Template dipakai otomatis kalau nanti ada halaman baru
  // yang punya `export const title` sendiri.
  title: {
    default:
      "FolderToMarkdownV2 — Konverter Folder ke Markdown Online Gratis",
    template: "%s | FolderToMarkdownV2",
  },

  description: siteConfig.description,
  keywords: [...siteConfig.keywords],

  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  applicationName: siteConfig.name,
  category: "developer tools",

  // Canonical: mencegah duplikat index di mata Google.
  alternates: {
    canonical: "/",
  },

  // Preview saat link di-share ke WhatsApp / Facebook / Discord.
  // Gambar og:image TIDAK perlu ditulis manual di sini — file
  // app/opengraph-image.tsx otomatis mengisinya saat build.
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: ["en_US"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },

  // Preview saat di-share di Twitter/X (pakai gambar besar).
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },

  // Perintah eksplisit ke robot Google: boleh indeks, boleh
  // ikut semua link, dan tampilkan cuplikan + gambar sebesar
  // mungkin di hasil pencarian.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // PWA manifest — di-generate oleh app/manifest.ts
  manifest: "/manifest.json",

  // ★ ISI SETELAH DAFTAR DI GOOGLE SEARCH CONSOLE ★
  // 1. Buka https://search.google.com/search-console
  // 2. Tambah property → metode verifikasi "Tag HTML"
  // 3. Salin kode di dalam content="..." lalu buka komentar
  //    blok di bawah dan tempel di sana. Deploy ulang → Verify.
  // verification: {
  //   google: "tempel-kode-verifikasi-kamu-di-sini",
  // },
};

// ============================================================
// STRUCTURED DATA (JSON-LD) — "kartu nama" situs untuk Google.
// Membantu Google memahami bahwa ini adalah aplikasi web
// developer tool yang gratis, dan bisa memunculkan tampilan
// kaya (rich results) di pencarian.
// ============================================================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  inLanguage: "en",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert folder contents into a single Markdown file",
    "GitHub-style folder structure visualization",
    "Filter for ignored folders, files, and extensions",
    "100% processed in-browser, files are never uploaded to a server",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}