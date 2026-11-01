# LOG DEBUGGING - PROJECT AKHIR SPRINT 2

## BUG P1: Teks Nominal Raksasa Tumpah (Overflow)
*   **Gejala (Reproduksi):** Jika diisi dengan nominal angka mencapai triliunan (digit sangat panjang), teks angka akan menabrak batas kotak container dan meleber ke kanan layar.
*   **Hipotesis:** Container teks tidak memiliki aturan CSS pemutusan kata, sehingga deretan angka (tanpa spasi) dianggap sebagai satu string tidak terputus.
*   **Bukti Alat (DevTools):** Lewat tab *Elements*, teks angka yang melampaui batas *width* pembungkusnya tidak dipaksa turun baris.
*   **Penyebab & Perbaikan (style.css):** Tidak adanya pembatasan overflow teks. Diperbaiki dengan menambahkan properti `word-break: break-all;` dan `overflow-wrap: break-word;` pada *class* tipografi teks saldo/nominal.
*   **Uji Ulang:** Saat diisi angka triliunan, angka otomatis turun ke baris baru dan tetap rapi di dalam kotak.

## BUG P2: Foto Profil Tidak Melingkar Sempurna
*   **Gejala (Reproduksi):** Pada halaman Profil, foto pengguna tampil dengan sudut kotak atau terpotong tidak rata, tidak mengikuti bingkai lingkaran animasi dengan halus.
*   **Hipotesis:** Aset gambar sumber memiliki rasio aspek persegi panjang (bukan 1:1) dan mengalami distorsi ukuran/kompresi piksel yang merusak batas border-radius pada elemen penampil.
*   **Bukti Alat (DevTools):** Melalui panel *Elements*, tag `<img>` sudah memiliki styling pembulatan, tetapi file gambar aslinya memaksa area render melebar dan merusak kontainer *overflow: hidden*.
*   **Penyebab & Perbaikan:** Ketidaksesuaian dimensi file aset gambar fisik. Diperbaiki dengan mengganti ulang aset gambar profil dengan ukuran kompresi yang proporsional (format kuadrat/persegi) serta memastikan properti `object-fit: cover` diterapkan dengan benar pada CSS.
*   **Uji Ulang:** Foto profil kini terpotong dan melingkar mulus di dalam bingkai animasi tanpa ada bagian gambar yang keluar jalur.

## Catatan Integritas Pengerjaan
*   Bantuan Asisten AI digunakan untuk proses analisis galeri DevTools, perbaikan logika *overflow* teks nominal, serta penyesuaian styling pemotongan foto profil (*object-fit* dan *border-radius*) pada Project Akhir Sprint 2.