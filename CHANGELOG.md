# Changelog - Dompet Anak Kos

Semua perubahan penting proyek didokumentasikan di sini berdasarkan [Keep a Changelog](https://keepachangelog.com/).

## [0.4.0] - 2026-11-13 (Sprint 4)
### Ditambahkan
- Komponen reusable `KartuPengeluaran` di `src/komponen.js` yang memanfaatkan `textContent` untuk mencegah XSS.
- Kunci penyimpanan berversi `dompet-anak-kos:v1` pada modul `state.js`.
- Mekanisme *try/catch* pada `inisialisasiData()` dan `simpanState()` agar aplikasi tahan banting (tidak *crash* saat data korup atau penyimpanan diblokir).

## [0.3.0] - 2026-11-06 (Sprint 3)
### Diubah
- Pemecahan arsitektur monolit menjadi modul ES terpisah (`main.js`, `ui.js`, `state.js`, `ui-pustaka.js`).

## [0.2.0] - 2026-10-31 (Sprint 2)
### Ditambahkan
- Pustaka pihak ketiga Bootstrap Modal dan Toast.
- Fitur peringatan batas saldo harian.

## [0.1.0] - 2026-10-24 (Sprint 1)
### Ditambahkan
- MVP (Minimum Viable Product): Desain UI awal, pencatatan transaksi masuk dan keluar, serta perhitungan saldo sisa.