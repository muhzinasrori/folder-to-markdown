// ============================================================
// KONFIGURASI SITUS — SUMBER TUNGGAL (single source of truth)
// Semua file SEO (layout, sitemap, robots, manifest, og-image)
// membaca dari file ini. Jadi kamu cuma perlu edit DI SINI.
//
// WAJIB GANTI sebelum deploy: baris `url` di bawah!
// ============================================================

export const siteConfig = {
  // ★★★ WAJIB DIGANTI ★★★
  // Domain asli kamu. Pakai https, TANPA garis miring di akhir.
  // Contoh subdomain Vercel : "https://folder-to-markdown.vercel.app"
  // Contoh custom domain    : "https://foldertomarkdown.com"
  url: "https://folder-to-markdown.vercel.app",

  // Nama situs (muncul di tab browser, hasil pencarian Google,
  // dan judul share WhatsApp/Twitter)
  name: "FolderToMarkdownV2",

  // Deskripsi utama — usahakan <= 160 karakter biar tidak
  // terpotong "..." di hasil pencarian Google.
  description:
    "Ubah struktur folder & kode project jadi satu file Markdown dalam sekali klik. Gratis, tanpa upload — semua proses berjalan langsung di browser kamu.",

  // Kata kunci target. Catatan jujur: Google mengabaikan meta
  // keywords, TAPI ini tetap berguna untuk Bing & sebagai
  // panduan konsistensi kata kunci di title/description/konten.
  keywords: [
    "folder to markdown",
    "konverter folder ke markdown",
    "convert folder to markdown",
    "folder to md",
    "repo to markdown",
    "codebase to markdown",
    "kode ke markdown",
    "generator markdown online",
    "dokumentasi kode otomatis",
    "ekstrak kode project",
    "markdown untuk AI LLM",
    "project bundler markdown",
  ],

  // Ganti dengan nama/handle kamu kalau mau (opsional).
  author: "FolderToMarkdownV2",

  locale: "id_ID",
} as const;