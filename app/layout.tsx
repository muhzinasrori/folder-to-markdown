import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Impor komponen NextTopLoader dari package yang baru diinstal
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kumpulan Semua Fitur Fitur di NextJs",
  description: "Semua pustaka dan fitur dapat kamu ujicoba disini",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 2. Sisipkan NextTopLoader di sini, tepat di dalam tag body */}
        <NextTopLoader 
          color="#6366f1"        //{/* Warna progress bar (di sini menggunakan warna Indigo Tailwind) */}
          initialPosition={0.08}   //{/* Posisi awal loading (0.08 = 8%) */}
          crawlSpeed={200}         //{/* Kecepatan pergerakan bar dalam milidetik */}
          height={3}               //{/* Ketebalan progress bar dalam satuan pixel */}
          crawl={true}             //{/* Membuat bar otomatis merayap maju saat loading */}
          showSpinner={false}      //{/* Menghilangkan spinner lingkaran berputar di pojok kanan (opsional, set true jika ingin dimunculkan) */}
          easing="ease"            //{/* Efek animasi pergerakan */}
          speed={200}              //{/* Kecepatan animasi bar */}
        />
        
        {children}
      </body>
    </html>
  );
}
