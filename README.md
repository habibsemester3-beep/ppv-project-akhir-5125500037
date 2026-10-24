# Dompet Anak Kos - Aplikasi Pencatat Keuangan Mahasiswa (Tugas 4)

Aplikasi web interaktif bergaya *Glassmorphism* untuk pengelolaan keuangan harian mahasiswa kos dengan kalkulasi jatah harian otomatis, analisis diagram, dan kustomisasi profil pengguna.

---

## Fitur Utama (Pembaruan Tugas 4)
1. **Tiga Tampilan SPA (Single Page Application):** Navigasi mulus tanpa muat ulang (*reload*) antar halaman Beranda, Laporan, dan Profil.
2. **Kalkulator & Pos Lengkap:** Termasuk fitur *Split Bill* dan 9 kategori pos pengeluaran (Makan, Minuman, Kos, Transportasi, Kuliah, Belanja, Tagihan, Hiburan, Kesehatan).
3. **Kustomisasi Profil Editable:** Pengguna dapat mengubah nama, NRP, dan mengunggah foto profil secara *real-time*.
4. **Animasi Modern & Responsif:** Dilengkapi animasi transisi kartu, efek gradien berputar pada profil, serta getaran umpan balik (*error state*) yang mendukung `prefers-reduced-motion`. 
5. **Media Terintegrasi:** Menggunakan efek audio interaktif saat data berhasil disimpan dan penanganan *fallback* gambar profil (*onerror*).

---

## Daftar Event Handling
1. `click`: Navigasi tab SPA, interaksi modal detail/hapus, *toggle* form edit profil, dan aksi tombol.
2. `input`: Format otomatis visual angka Rupiah secara *real-time* saat mengetik nominal/anggaran.
3. `change`: Mendeteksi unggahan foto/dokumentasi, foto profil, dan *toggle* checkbox *Split Bill*.
4. `submit`: Eksekusi pemrosesan, validasi, dan penyimpanan data form pengeluaran.
5. `keydown`: (Pintasan Keyboard) Menekan tombol `Enter` untuk menyimpan transaksi dengan cepat.
6. `mousemove`: Efek animasi Parallax dinamis pada latar belakang halaman.

---

## Aturan Validasi Input
1. **Nama Pengeluaran:** Wajib diisi (akan memunculkan efek getar jika kosong).
2. **Nominal Biaya:** Wajib diisi angka dan harus lebih besar dari Rp 0.
3. **Edit Profil:** Nama dan NRP tidak boleh dikosongkan saat menekan tombol simpan profil.

---

## Cara Menjalankan Aplikasi
1. Ekstrak file ZIP proyek.
2. Buka berkas `index.html` menggunakan peramban web modern (Google Chrome / Safari / Edge).
3. Aplikasi siap digunakan secara interaktif tanpa perlu instalasi *server* lokal.

---

## H. CATATAN INTEGRITAS PENGERJAAN

**1. Log Modifikasi (Git Log)**
Berikut adalah riwayat modifikasi (*commit*) selama pengerjaan dan perbaikan *bug*:
d1a95f4 Menyelesaikan Tugas 4 Dompet Anak Kos lengkap dengan revisi

**2. Atribusi & Referensi Kode**
- **Asisten AI (Gemini):** Digunakan sebagai *thought partner* untuk melakukan *refactoring* UI/UX, mengimplementasikan animasi `element.animate()`, dan memastikan tata letak terisolasi sempurna antar-tab (SPA).
- **Ikon Antarmuka:** Menggunakan pustaka pihak ketiga FontAwesome CDN.
- **Avatar Fallback:** Menggunakan UI Avatars API jika gambar utama profil gagal dimuat.

**3. Hasil Uji Coba ke Pengguna (User Testing)**
Aplikasi telah diuji coba kepada 2 orang pengguna dengan catatan temuan sebagai berikut:

* **Penguji 1:** Kaysan (Mahasiswa Kos / Teman Satu Kelas)
* **Waktu Uji:** Sabtu, 17 Oktober 2026 (Pukul 21.00 WIB)
* **Temuan Bingung:** Penguji melewatkan pengisian Plafon Anggaran karena nilai awalnya sudah terisi (Rp 1.500.000). Selain itu, penguji bingung dengan maksud dan cara penggunaan fitur "Split Bill".
* **Perbaikan:** Menghapus nilai *default* anggaran menjadi kosong (Rp 0) agar pengguna secara sadar mengetik sendiri uang sakunya di awal. Label fitur *Split Bill* diperjelas secara awam menjadi "Bagi Tagihan (Patungan Sama Teman)?" dan disisipkan teks panduan pemakaian berukuran kecil di bawahnya.

* **Penguji 2:** Abil (Mahasiswa Pulang Pergi / Teman Satu Kelas)
* **Waktu Uji:** Sabtu, 17 Oktober 2026 (Pukul 21.00 WIB)
* **Temuan Bingung:** Penguji mencoba mengunggah foto acak pada kolom "Foto Struk" dengan ekspektasi aplikasi akan mengeluarkan format nota layaknya struk kasir, lalu bingung di mana hasil unggahan tersebut disimpan.
* **Perbaikan:** Mengubah penamaan label fitur menjadi "Dokumentasi / Bukti" agar lebih merangkul semua jenis gambar (screenshot bukti bayar, foto produk). Ditambahkan teks keterangan kecil yang menginformasikan bahwa gambar berfungsi murni untuk dokumentasi, serta di mana gambar tersebut bisa diakses kembali (via tombol "Detail" di menu Riwayat).