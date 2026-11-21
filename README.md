# Dompet Anak Kos 💸

Aplikasi pelacak keuangan minimalis dan tangguh untuk mahasiswa rantau, dirancang untuk mencegah krisis "tanggal tua". 

## 1. Cara Menjalankan
1. Pastikan Anda memiliki peramban modern (Google Chrome, Firefox, atau Edge).
2. Kloning repositori ini ke komputer lokal Anda.
3. Gunakan ekstensi **Live Server** di VS Code atau jalankan `python -m http.server` dari terminal.
4. Buka URL lokal yang muncul (misalnya: `http://127.0.0.1:5500/index.html`) di peramban.

## 2. Fitur MVP dan Status
- [x] Menetapkan pagu anggaran (budget) bulanan.
- [x] Menambah, mengedit, dan menghapus catatan transaksi pengeluaran.
- [x] Kalkulasi dinamis untuk sisa saldo bulanan.
- [x] Analisis batas aman harian (status: aman, waspada, kritis).
- [x] Penyimpanan lokal (Local Storage) yang kebal terhadap korupsi data.
- [x] Tampilan berbasis komponen UI *reusable*.

## 3. Struktur Modul Aplikasi
Aplikasi telah menggunakan arsitektur ES Modules (ESM) dengan pemisahan sebagai berikut:
- `src/main.js`: *Entry point* aplikasi dan pendaftaran *event listeners*.
- `src/state.js`: Logika bisnis, pemrosesan data, pengelola *state*, dan persistensi `localStorage`.
- `src/ui.js`: Pengelola perenderan DOM, dasbor, indikator, dan pembaruan grafik UI.
- `src/ui-pustaka.js`: Modul pembungkus (*wrapper*) untuk memanggil komponen pihak ketiga (Bootstrap Modal & Toast).
- `src/komponen.js`: Pabrik komponen antarmuka yang independen (seperti `KartuPengeluaran`).

## 4. Kontrak Komponen dan Penyimpanan
- **Komponen (`KartuPengeluaran(exp, formatRupiah)`):** 
  Fungsi ini menerima dua parameter: objek data pengeluaran (`{ id, name, amount, type, category, timestamp }`) dan fungsi *formatter* Rupiah. Fungsi mengembalikan sebuah elemen HTML murni (`HTMLElement`). Teks dari pengguna (seperti judul transaksi) dirender menggunakan `textContent` alih-alih `innerHTML` untuk mengeliminasi celah kerentanan *Cross-Site Scripting (XSS)*.
- **Penyimpanan (`src/state.js`):** 
  Menggunakan kunci penyimpanan berversi `dompet-anak-kos:v1`. Semua akses penyimpanan (baik fungsi `inisialisasiData()` untuk memuat maupun `simpanState()` untuk menulis) dibungkus menggunakan blok `try/catch`. Jika memori lokal diblokir atau diisi data JSON yang rusak/korup, fungsi inisialisasi hanya memuat *fallback* berupa memori data internal kosong, memastikan aplikasi tetap berjalan (tahan banting).

## 5. Kredit Aset, Pustaka, & Bantuan AI
- **Ikonografi:** FontAwesome (Gratis).
- **Interaksi Antarmuka:** Bootstrap v5.3 (CSS & JS) digunakan untuk fitur Modal dan sistem Toast.
- **Inspirasi Visual:** Palet warna *flat* dan kartu berbayang (Material Design).
- **Catatan Integritas:** Pengembangan struktur kode modular, implementasi `try/catch` penyimpan aman, serta pemenuhan skenario "anti-banting" (*fallback data*) di Sprint 4 ini dipandu dengan bantuan asisten AI Gemini (Google).

- **Templat Halaman Konsep (`docs/konsep/`):** Menggunakan templat `index.html` dan `tampil.js` dari Lampiran Tugas 7 Praktikum Pemrograman Visual PENS (2026) untuk validasi dokumen konsep produk.