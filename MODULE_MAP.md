# MODULE MAP - PROJECT AKHIR (SPRINT 3)

## Diagram Alur & Dependensi Modul ES (Satu Arah)

index.html
└── src/main.js (Titik Masuk Utama)
├── src/state.js (Pengelola State Data & Utilitas)
├── src/ui.js (Penyaji Tampilan & Chart)
│      ├── src/state.js
│      └── src/ui-pustaka.js
└── src/ui-pustaka.js (Pembungkus API UI / Bootstrap Toast & Modal)

## Tanggung Jawab Per Modul (Satu Kalimat)

1. **`src/main.js`**: Titik masuk utama aplikasi yang mengatur inisialisasi, penanganan event listener DOM, serta koordinasi alur logika pengguna.
2. **`src/state.js`**: Tempat penyimpanan tunggal untuk state aplikasi (`expenses`, `monthlyBudget`, `idToDelete`) dan fungsi manipulasi data keuangan.
3. **`src/ui.js`**: Pengelola perenderan elemen visual ke DOM seperti kartu saldo, daftar riwayat transaksi, serta diagram evaluasi pengeluaran.
4. **`src/ui-pustaka.js`**: Pembungkus API eksternal Bootstrap untuk menampilkan elemen interaktif modal detail dan toast notifikasi.

## Bagian yang Belum Dimodulkan & Alasannya
- **Gaya CSS (`src/style.css`)**: Disimpan sebagai berkas lembar gaya terpisah karena dimuat langsung oleh HTML lewat tag `<link>` dan tidak mengandung logika JavaScript.