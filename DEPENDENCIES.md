# Pustaka UI (Dependencies)

* **Nama Pustaka:** Bootstrap
* **Versi Terkunci:** 5.3.3
* **Sumber:** CDN jsDelivr (`https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`)
* **Ukuran Transfer (Network Tab):** CSS ± 31 kB, JS ± 23 kB *(Catatan: Angka ini akan dicek ulang di tab Network)*
* **Komponen yang Dipakai:** Navbar, Card, Modal, Grid System.

## Jawaban 4 Pertanyaan Pemasangan Pustaka:
1. **Mengapa butuh pustaka ini?** Untuk mempercepat pembuatan tata letak responsif (layar HP & Laptop) tanpa menulis ulang CSS *media query* dari nol.
2. **Apakah pustakanya aktif dirawat?** Ya, Bootstrap adalah salah satu kerangka kerja UI paling populer dan terus mendapat pembaruan keamanan/fitur secara rutin dari komunitas.
3. **Apakah ukurannya sesuai dengan proyek?** Ya, berkat penggunaan CDN dan fitur *caching* peramban modern, ukuran ~50 kB sangat ringan untuk aplikasi statis ini.
4. **Apakah dapat diakses dengan baik (Accessibility)?** Ya, Bootstrap sudah dilengkapi dukungan atribut `aria-` bawaan yang baik untuk pembaca layar (*screen reader*).