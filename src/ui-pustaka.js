// src/ui-pustaka.js
// Pembungkus API Bootstrap (Tugas P09)

export function tampilkanToast(pesan) {
    const toastEl = document.getElementById('liveToast') || document.getElementById('toast');
    const toastMsgEl = document.getElementById('toastMessage');
    if (toastMsgEl) toastMsgEl.textContent = pesan;
    if (window.bootstrap && toastEl) {
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        toast.show();
    } else if (toastEl) {
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2500);
    }
}

export function bukaModalDetailHTML(htmlContent) {
    const modalEl = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    if (modalBody) modalBody.innerHTML = htmlContent;
    if (window.bootstrap && modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    } else if (modalEl) {
        modalEl.classList.remove('hidden');
    }
}

export function sembunyikanModalDetail() {
    const modalEl = document.getElementById('detailModal');
    if (window.bootstrap && modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    } else if (modalEl) {
        modalEl.classList.add('hidden');
    }
}