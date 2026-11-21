// konsep.js — Konsep Produk Project Akhir: Dompet Anak Kos
const KONSEP = {
  nama: 'Dompet Anak Kos',
  tagline: 'Kendali finansial praktis anti-krisis tanggal tua untuk mahasiswa rantau.',
  persona: {
    nama: 'Kaysan Aziz Abrisam, 19 tahun',
    siapa: 'Mahasiswa rantau semester 3 D3 Teknologi Multimedia dan Broadcasting yang tinggal di kamar kos Surabaya dengan uang saku bulanan pas-pasan.',
    keseharian: 'Kuliah dari pagi hingga sore, mengerjakan tugas proyek di kampus atau kafe, lalu membeli makan harian di warung sekitar kos.',
    masalah: 'Sering kehabisan uang sebelum akhir bulan karena tidak tahu batas aman belanja harian dan malas mencatat pengeluaran kecil di aplikasi keuangan yang rumit.',
  },
  masalah: 'Mahasiswa rantau sering kehabisan uang saku sebelum akhir bulan karena tidak memantau batas pengeluaran harian. Pencatatan manual di buku atau aplikasi keuangan rumit membuat mereka malas mencatat transaksi kecil seperti makan dan fotokopi. Akibatnya, pengeluaran tidak terkendali antara kebutuhan pokok dan keinginan impulsif.',
  solusi: 'Dompet Anak Kos menghadirkan pencatatan pengeluaran cepat yang langsung menghitung sisa saldo dan batas aman jajan harian secara otomatis. Aplikasi ini memisahkan kategori kebutuhan dan keinginan disertai indikator visual status keuangan dari aman hingga mode darurat. Seluruh data tersimpan aman secara lokal di peramban tanpa memerlukan proses masuk akun yang berbelit.',
  fitur: [
    {
      nama: 'Input Anggaran Bulanan & Sisa Saldo Otomatis (Sudah Jadi — tag v0.1.0)',
      prioritas: 'wajib',
      alasan: 'Menjawab masalah utama persona agar langsung mengetahui sisa uang bulanan secara real-time.'
    },
    {
      nama: 'Kalkulator Batas Aman Harian & Indikator Status (Sudah Jadi — tag v0.2.0)',
      prioritas: 'wajib',
      alasan: 'Membantu mahasiswa membatasi jajan harian berdasarkan sisa hari menuju akhir bulan.'
    },
    {
      nama: 'Pencatatan Pengeluaran Kebutuhan vs Keinginan & Grafik (Sudah Jadi — tag v0.1.0 & v0.3.0)',
      prioritas: 'wajib',
      alasan: 'Memudahkan evaluasi pos pemborosan terbesar lewat grafik evaluasi otomatis.'
    },
    {
      nama: 'Penyimpanan Lokal Anti-Banting & Komponen Aman (Sudah Jadi — tag v0.4.0)',
      prioritas: 'wajib',
      alasan: 'Menjamin catatan keuangan tidak hilang dan aplikasi tetap hidup walau data peramban terganggu.'
    },
    {
      nama: 'Ekspor Ringkasan Pengeluaran Bulanan ke PDF',
      prioritas: 'sebaiknya',
      alasan: 'Memudahkan mahasiswa mengirim laporan pertanggungjawaban uang saku kepada orang tua.'
    },
    {
      nama: 'Pengingat Harian Catat Transaksi',
      prioritas: 'sebaiknya',
      alasan: 'Membantu membangun kebiasaan disiplin mencatat pengeluaran setiap malam sebelum tidur.'
    },
    {
      nama: 'Sinkronisasi Otomatis Mutasi Rekening Bank & E-Wallet',
      prioritas: 'belum',
      alasan: 'Membutuhkan server backend dan API perbankan berbayar yang berisiko membocorkan privasi finansial pengguna.'
    }
  ],
  pembanding: [
    {
      nama: 'Money Manager (Realbyte)',
      kelebihan: 'Fitur akuntansi lengkap dengan multi-dompet, transfer antar-akun, dan laporan detail.',
      kekurangan: 'Antarmuka terlalu kompleks dengan banyak istilah akuntansi sehingga terasa berat untuk pencatatan cepat anak kos.'
    },
    {
      nama: 'Catatan Keuangan di Spreadsheet / Excel',
      kelebihan: 'Gratis, fleksibel, dan mudah dibuka melalui laptop maupun ponsel.',
      kekurangan: 'Tidak praktis diisi saat sedang jajan di warung dan pengguna harus menyusun rumus batas harian sendiri.'
    }
  ],
  pembeda: 'Dirancang khusus mengikuti ritme keuangan mahasiswa kos lewat kalkulator batas aman harian otomatis, peringatan visual mode darurat tanggal tua, serta antarmuka web ringan berbasis penyimpanan lokal aman tanpa registrasi akun.',
};