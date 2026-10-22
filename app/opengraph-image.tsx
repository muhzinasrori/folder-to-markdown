import { ImageResponse } from "next/og";

// ============================================================
// OG IMAGE DINAMIS (1200x630 PNG)
// Ini yang muncul sebagai gambar besar saat link kamu
// di-share ke WhatsApp / Twitter/X / Facebook / Discord /
// Telegram. Tidak perlu bikin gambar manual di Canva —
// Next.js merender file ini jadi PNG saat build.
//
// Setelah deploy, cek langsung di browser:
//   https://domain-kamu/opengraph-image
// ============================================================

export const alt =
  "FolderToMarkdownV2 — Konverter Folder ke Markdown Online Gratis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d1117",
          backgroundImage:
            "linear-gradient(135deg, #0d1117 0%, #10161d 55%, #17202b 100%)",
          padding: "60px",
        }}
      >
        {/* Baris brand — meniru header repo ala aplikasinya */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 68, fontWeight: 700, color: "#58a6ff" }}>
            FolderToMarkdown
          </span>
          <span style={{ fontSize: 68, fontWeight: 700, color: "#f0f6fc" }}>
            V2
          </span>
          <span style={{ fontSize: 68, color: "#8b949e" }}>/</span>
          <span style={{ fontSize: 52, color: "#c9d1d9" }}>bundle.md</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 34,
            color: "#c9d1d9",
            marginTop: 40,
            textAlign: "center",
          }}
        >
          Convert project folder contents into a clean Markdown file
        </div>
        <div style={{ fontSize: 28, color: "#8b949e", marginTop: 12 }}>
          One click · Free · No uploads · 100% in-browser
        </div>

        {/* Chips kata kunci */}
        <div style={{ display: "flex", marginTop: 48 }}>
          {["folder to markdown", "repo to markdown", "markdown for AI"].map( // ◄ "untuk" diganti jadi "for"
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  margin: "0 10px",
                  borderRadius: 12,
                  border: "1px solid #30363d",
                  backgroundColor: "#161b22",
                  color: "#58a6ff",
                  fontSize: 24,
                }}
              >
                {chip}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}