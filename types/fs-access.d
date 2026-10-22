/**
 * Deklarasi tipe untuk File System Access API
 * (https://developer.mozilla.org/docs/Web/API/Window/showDirectoryPicker)
 *
 * Alasan file ini ada: metode `window.showDirectoryPicker` BELUM terdaftar
 * di `lib.dom.d.ts` bawaan TypeScript 5.x, sehingga `next build` gagal
 * type-check dengan error TS2339.
 *
 * Catatan: jika suatu saat Anda meng-upgrade TypeScript ke versi yang sudah
 * menyediakan tipe ini secara bawaan, file ini bisa dihapus dengan aman.
 */

export {};

type WellKnownDirectory =
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos';

interface DirectoryPickerOptions {
  /** ID unik untuk mengingat direktori terakhir yang dipilih pengguna. */
  id?: string;
  /** Hak akses yang diminta: 'read' (baca) atau 'readwrite' (baca & tulis). */
  mode?: 'read' | 'readwrite';
  /** Direktori awal saat dialog dibuka. */
  startIn?: FileSystemHandle | WellKnownDirectory;
}

declare global {
  interface Window {
    showDirectoryPicker?: (
      options?: DirectoryPickerOptions
    ) => Promise<FileSystemDirectoryHandle>;
  }
}