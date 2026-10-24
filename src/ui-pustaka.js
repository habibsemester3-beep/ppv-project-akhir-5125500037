// src/ui-pustaka.js
// Berkas pembungkus API JavaScript Bootstrap (Tugas P09)
// Hanya berkas ini yang boleh memanggil fungsi bawaan Bootstrap.

function tampilkanToast(pesan) {
    const toastEl = document.getElementById('liveToast');
    document.getElementById('toastMessage').textContent = pesan;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    toast.show();
}

function bukaModalDetailHTML(htmlContent) {
    const modalEl = document.getElementById('detailModal');
    document.getElementById('modalBody').innerHTML = htmlContent;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function sembunyikanModalDetail() {
    const modalEl = document.getElementById('detailModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if(modal) modal.hide();
}