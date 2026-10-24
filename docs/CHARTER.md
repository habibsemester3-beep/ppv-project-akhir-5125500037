# Project Charter: Dompet Anak Kos

## 1. Latar Belakang Masalah
Mahasiswa rantau sering kehabisan uang saku sebelum akhir bulan karena tidak menyadari batas pengeluaran harian dan kesulitan melacak alokasi dana secara visual.

## 2. Pengguna Sasaran (Persona)
* **Siapa:** Kaysan (19 tahun), mahasiswa tingkat dua yang indekos.
* **Keseharian:** Berangkat kuliah pagi, sering makan di warung atau pesan antar, dan sering nongkrong/patungan tugas dengan teman.
* **Masalah:** Malas mencatat pengeluaran karena aplikasi yang ada terlalu rumit, dan sering bingung saat harus patungan bayar makan.

## 3. Fitur MVP (Prioritas MoSCoW)
* **Must (Harus Ada):** Form pencatatan pengeluaran kilat & kalkulasi sisa saldo otomatis.
* **Should (Sebaiknya Ada):** Kalkulator pembagian tagihan otomatis (*Split Bill*).
* **Could (Bisa Ditambahkan):** Diagram persentase pengeluaran Kebutuhan vs Keinginan.
* **Won't (Sengaja Tidak Dibuat Saat Ini):** Fitur *Login* akun dan sinkronisasi *database cloud* (difokuskan agar aplikasi tetap ringan, cepat, dan berjalan murni di sisi klien/browser pada Sprint 1).

## 4. Kriteria Sukses
* Pengguna baru dapat mencatat 1 transaksi harian dalam waktu **≤ 10 detik**.
* Pengguna dapat langsung mengetahui batas aman jatah uang hariannya dalam sekali lihat di Beranda.

## 5. Risiko & Antisipasi
1. **Risiko:** Pengguna malas mencatat karena butuh banyak klik. 
   **Antisipasi:** Membuat fitur pintasan *keyboard* (tombol `Enter`) untuk pengiriman form instan.
2. **Risiko:** Data transaksi hilang jika pengguna membersihkan *cache browser*.
   **Antisipasi:** Mengimplementasikan fitur penyimpanan persisten (*Local Storage*) dan ekspor data di Sprint P12.
3. **Risiko:** Tampilan *form* hancur atau terpotong saat dibuka di HP yang layarnya kecil.
   **Antisipasi:** Menggunakan Pustaka UI (misal: Bootstrap) yang sudah terjamin sistem *grid* responsifnya.