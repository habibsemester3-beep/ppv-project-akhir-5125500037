let expenses = [];
// PERBAIKAN KAYSAN: Anggaran awal diset ke 0 agar diketik secara sadar oleh user
let monthlyBudget = 0; 
let idToDelete = null;

// Referensi DOM Home
const budgetInput = document.getElementById('monthlyBudget');
const remainingBalanceEl = document.getElementById('remainingBalance');
const balanceProgressEl = document.getElementById('balanceProgress');
const balanceStatusEl = document.getElementById('balanceStatus');
const dailyAllowanceEl = document.getElementById('dailyAllowance');
const daysLeftEl = document.getElementById('daysLeft');
const frugalBox = document.getElementById('frugalBox');
const txCountEl = document.getElementById('transactionCount');

// Referensi Form & Edit
const expenseForm = document.getElementById('expenseForm');
const formTitle = document.getElementById('formTitle');
const editingIdInput = document.getElementById('editingId');
const nameInput = document.getElementById('expenseName');
const amountInput = document.getElementById('expenseAmount');
const fileInput = document.getElementById('expenseReceipt');
const fileLabelText = document.getElementById('fileName');
const isSplitBillCheck = document.getElementById('isSplitBill');
const splitInputArea = document.getElementById('splitInputArea');
const splitCountInput = document.getElementById('splitCount');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const noteInput = document.getElementById('expenseNote');

// Referensi State
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultState = document.getElementById('resultState');
const expenseList = document.getElementById('expenseList');

// Referensi Laporan & Tambahan Tugas 4
const reportTotalExpenseEl = document.getElementById('reportTotalExpense');
const barChartArea = document.getElementById('barChartArea');
const typeChartArea = document.getElementById('typeChartArea');
const evalTextEl = document.getElementById('evalText');
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view-section');
const successSound = document.getElementById('successSound');

// Modal & Toast
const detailModal = document.getElementById('detailModal');
const closeModalBtn = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');

const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Formatter & Helper
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}
function getRawNumber(str) { return parseInt(String(str).replace(/[^0-9]/g, '')) || 0; }
function formatInputVisual(e) {
    let raw = getRawNumber(e.target.value);
    e.target.value = raw > 0 ? new Intl.NumberFormat('id-ID').format(raw) : '';
}
function getDaysLeftInMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return lastDay - today.getDate() + 1;
}
function getCurrentTimestamp() {
    return new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
}

// Navigasi SPA Tab
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        
        btn.classList.add('active');
        const targetView = document.getElementById(btn.dataset.target);
        targetView.classList.add('active');
        
        if (btn.dataset.target === 'reportView') {
            renderChart();
        }
    });
});

// File Upload & Split Bill Toggle
fileInput.addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
        let name = this.files[0].name;
        if(name.length > 18) name = name.substring(0, 15) + '...';
        fileLabelText.textContent = name;
        fileLabelText.style.color = 'var(--primary)';
    } else {
        // PERBAIKAN ABIL: Penamaan reset foto
        fileLabelText.textContent = 'Pilih Foto / Screenshot...';
        fileLabelText.style.color = 'var(--text-muted)';
    }
});

isSplitBillCheck.addEventListener('change', function() {
    if (this.checked) {
        splitInputArea.classList.remove('hidden');
        splitCountInput.value = '';
    } else {
        splitInputArea.classList.add('hidden');
    }
});

// Modal Detail Logic (Diperbarui dengan ui-pustaka.js)
function openModal(id) {
    const exp = expenses.find(e => e.id === id);
    if(!exp) return;
    
    const noteHtml = exp.note ? `<div class="modal-detail-row"><span class="modal-detail-label">Keterangan</span><span class="modal-detail-value" style="font-weight:500; font-size:0.85rem; max-width:60%; text-align:right;">${exp.note}</span></div>` : '';
    const imgHtml = exp.receipt ? `<img src="${exp.receipt}" class="modal-img-preview" alt="Struk">` : '';
    
    bukaModalDetailHTML(`
        <div class="modal-detail-row"><span class="modal-detail-label">Transaksi</span><span class="modal-detail-value">${exp.name}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Nominal</span><span class="modal-detail-value text-danger">${formatRupiah(exp.amount)}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Waktu</span><span class="modal-detail-value">${exp.timestamp}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Kategori</span><span class="modal-detail-value">${exp.category}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Sifat</span><span class="modal-detail-value">${exp.type}</span></div>
        ${noteHtml}
        ${imgHtml}
    `);
}

// Modal Confirm Delete Logic
function askDeleteConfirmation(id) {
    idToDelete = id;
    confirmModal.classList.remove('hidden');
}

cancelDeleteBtn.addEventListener('click', () => {
    idToDelete = null;
    confirmModal.classList.add('hidden');
});

confirmDeleteBtn.addEventListener('click', () => {
    if (idToDelete !== null) {
        expenses = expenses.filter(exp => exp.id !== idToDelete);
        if (editingIdInput.value == idToDelete) resetEditMode();
        updateDashboard();
        renderChart();
        
        // Memanggil API Toast Bootstrap
        tampilkanToast('Transaksi telah dihapus.');
    }
    idToDelete = null;
    confirmModal.classList.add('hidden');
});

// Validasi
function toggleError(element, message, isValid) {
    const errorEl = document.getElementById(`error-${element.id}`);
    const targetEl = element.id === 'expenseAmount' ? element.parentElement : element;
    
    if (!isValid) {
        targetEl.classList.add('invalid-border');
        errorEl.textContent = message;
        errorEl.classList.add('active');
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion && targetEl.animate) {
            targetEl.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-6px)' },
                { transform: 'translateX(6px)' },
                { transform: 'translateX(-6px)' },
                { transform: 'translateX(6px)' },
                { transform: 'translateX(0)' }
            ], { duration: 400, easing: 'ease-in-out' });
        }
    } else {
        targetEl.classList.remove('invalid-border');
        errorEl.textContent = '';
        errorEl.classList.remove('active');
    }
}

function validateInputs() {
    let isValid = true;
    if (nameInput.value.trim() === '') { toggleError(nameInput, 'Nama pengeluaran wajib diisi.', false); isValid = false; }
    if (getRawNumber(amountInput.value) <= 0) { toggleError(amountInput, 'Nominal harus lebih dari Rp 0.', false); isValid = false; }
    return isValid;
}

// Events
amountInput.addEventListener('input', function(e) { formatInputVisual(e); if (getRawNumber(this.value) > 0) toggleError(amountInput, '', true); });
budgetInput.addEventListener('input', function(e) { formatInputVisual(e); monthlyBudget = getRawNumber(this.value); updateDashboard(); });
nameInput.addEventListener('input', () => { if(nameInput.value.trim() !== '') toggleError(nameInput, '', true); });

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.getElementById('blob1').style.transform = `translate(${x * 25}px, ${y * 25}px)`;
    document.getElementById('blob2').style.transform = `translate(-${x * 35}px, -${y * 35}px)`;
});

expenseForm.addEventListener('submit', function(e) { e.preventDefault(); if (validateInputs()) processNewExpense(); });
expenseForm.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        e.preventDefault(); 
        if (validateInputs()) processNewExpense();
    }
});

// Handling Klik Action Buttons
expenseList.addEventListener('click', function(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    if (e.target.classList.contains('btn-delete')) {
        askDeleteConfirmation(id);
    } else if (e.target.classList.contains('btn-detail')) {
        openModal(id);
    } else if (e.target.classList.contains('btn-edit')) {
        startEditMode(id);
    }
});

function startEditMode(id) {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    editingIdInput.value = exp.id;
    let cleanName = exp.name.replace(/^\[Patungan 1\/\d+\]\s*/, '');
    nameInput.value = cleanName;
    amountInput.value = new Intl.NumberFormat('id-ID').format(exp.amount);
    noteInput.value = exp.note || ''; 

    document.querySelector(`input[name="expenseCategory"][value="${exp.category}"]`).checked = true;
    document.querySelector(`input[name="expenseType"][value="${exp.type}"]`).checked = true;

    formTitle.textContent = 'Edit Transaksi';
    submitBtn.textContent = 'Simpan Perubahan';
    cancelEditBtn.classList.remove('hidden');

    expenseForm.scrollIntoView({ behavior: 'smooth' });
}

function resetEditMode() {
    editingIdInput.value = '';
    expenseForm.reset();
    noteInput.value = ''; 
    formTitle.textContent = 'Catat Transaksi Baru';
    submitBtn.textContent = 'Rekam Pengeluaran';
    cancelEditBtn.classList.add('hidden');
    splitInputArea.classList.add('hidden');
    
    // PERBAIKAN ABIL: Penamaan reset foto
    fileLabelText.textContent = 'Pilih Foto / Screenshot...';
    fileLabelText.style.color = 'var(--text-muted)';
}

cancelEditBtn.addEventListener('click', resetEditMode);

// State & Core Processing
function processNewExpense() {
    const categorySelected = document.querySelector('input[name="expenseCategory"]:checked').value;
    const typeSelected = document.querySelector('input[name="expenseType"]:checked').value;
    const editingId = editingIdInput.value;
    const note = noteInput.value.trim(); 

    let rawAmount = getRawNumber(amountInput.value);
    let finalAmount = rawAmount;
    let namePrefix = '';

    if (isSplitBillCheck.checked) {
        let splitCount = parseInt(splitCountInput.value) || 2;
        finalAmount = Math.round(rawAmount / splitCount);
        namePrefix = `[Patungan 1/${splitCount}] `;
    }

    let receiptUrl = '';
    if (fileInput.files.length > 0) receiptUrl = URL.createObjectURL(fileInput.files[0]);

    emptyState.classList.add('hidden');
    resultState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    submitBtn.disabled = true;

    setTimeout(() => {
        if (editingId) {
            const index = expenses.findIndex(e => e.id == editingId);
            if (index !== -1) {
                expenses[index].name = namePrefix + nameInput.value.trim();
                expenses[index].amount = finalAmount;
                expenses[index].category = categorySelected;
                expenses[index].type = typeSelected;
                expenses[index].note = note; 
                if (receiptUrl) expenses[index].receipt = receiptUrl;
            }
            // Memanggil API Toast Bootstrap
            tampilkanToast('Transaksi diperbarui!');
            resetEditMode();
        } else {
            const newExpense = {
                id: Date.now(),
                name: namePrefix + nameInput.value.trim(),
                amount: finalAmount,
                category: categorySelected,
                type: typeSelected,
                note: note, 
                receipt: receiptUrl,
                timestamp: getCurrentTimestamp()
            };
            expenses.unshift(newExpense);
            // Memanggil API Toast Bootstrap
            tampilkanToast('Transaksi dicatat.');
            expenseForm.reset();
            noteInput.value = '';
        }

        splitInputArea.classList.add('hidden');
        
        // PERBAIKAN ABIL: Penamaan reset foto
        fileLabelText.textContent = 'Pilih Foto / Screenshot...';
        fileLabelText.style.color = 'var(--text-muted)';
        
        submitBtn.disabled = false;
        loadingState.classList.add('hidden');
        
        if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => console.log('Autoplay ditahan browser'));
        }

        updateDashboard();
    }, 800);
}

function updateDashboard() {
    const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);
    const remaining = monthlyBudget - totalExpenses;
    const percentageLeft = monthlyBudget > 0 ? (remaining / monthlyBudget) * 100 : 0;
    
    const daysLeft = getDaysLeftInMonth();
    const dailyAllowance = remaining > 0 ? Math.floor(remaining / daysLeft) : 0;

    remainingBalanceEl.textContent = formatRupiah(remaining);
    reportTotalExpenseEl.textContent = formatRupiah(totalExpenses);
    daysLeftEl.textContent = daysLeft;
    dailyAllowanceEl.textContent = `${formatRupiah(dailyAllowance)} / hari`;
    txCountEl.textContent = `${expenses.length} Item`;

    balanceProgressEl.style.width = `${Math.max(0, Math.min(percentageLeft, 100))}%`;
    balanceProgressEl.className = 'progress-bar'; 

    if (percentageLeft > 40) {
        balanceProgressEl.classList.add('safe');
        balanceStatusEl.innerHTML = 'Aman terkendali! <i class="fa-solid fa-rocket"></i>';
        balanceStatusEl.className = 'status-text text-safe';
        dailyAllowanceEl.className = 'text-safe';
    } else if (percentageLeft > 20) {
        balanceProgressEl.classList.add('warning');
        balanceStatusEl.innerHTML = 'Waspada, saldo mulai menipis! <i class="fa-solid fa-eye"></i>';
        balanceStatusEl.className = 'status-text text-warning';
        dailyAllowanceEl.className = 'text-warning';
    } else {
        balanceProgressEl.classList.add('critical');
        balanceStatusEl.innerHTML = 'Kritis! Mode Indomie diaktifkan! <i class="fa-solid fa-triangle-exclamation"></i>';
        balanceStatusEl.className = 'status-text text-danger';
        dailyAllowanceEl.className = 'text-danger';
    }

    if (expenses.length === 0) {
        emptyState.classList.remove('hidden');
        resultState.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        resultState.classList.remove('hidden');
        
        expenseList.innerHTML = '';
        expenses.forEach(exp => {
            const typeBadge = exp.type === 'Kebutuhan' ? 'need' : 'want';
            const li = document.createElement('li');
            li.className = 'expense-item';
            li.innerHTML = `
                <div class="item-left">
                    <h4>${exp.name}</h4>
                    <div class="tags">
                        <span class="badge ${typeBadge}">${exp.type}</span>
                        <span class="badge cat">${exp.category}</span>
                    </div>
                    <div class="timestamp"><i class="fa-regular fa-clock"></i> ${exp.timestamp}</div>
                </div>
                <div class="item-right">
                    <div class="expense-amount">- ${formatRupiah(exp.amount)}</div>
                    <div class="action-btns">
                        <button class="btn-sm btn-detail" data-id="${exp.id}">Detail</button>
                        <button class="btn-sm btn-edit" data-id="${exp.id}">Edit</button>
                        <button class="btn-sm btn-delete" data-id="${exp.id}">Hapus</button>
                    </div>
                </div>
            `;
            expenseList.appendChild(li);

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion && li.animate) {
                li.animate([
                    { opacity: 0, transform: 'translateY(15px)' },
                    { opacity: 1, transform: 'none' }
                ], { duration: 350, easing: 'ease-out', fill: 'both' });
            }
        });
    }
}

function renderChart() {
    const chartEmptyState = document.getElementById('chartEmptyState');
    const chartContainer = document.getElementById('chartContainer');
    
    if (expenses.length === 0) {
        chartEmptyState.classList.remove('hidden');
        chartContainer.classList.add('hidden');
        evalTextEl.textContent = 'Belum ada transaksi untuk dievaluasi.';
        typeChartArea.innerHTML = '';
        return;
    }
    
    chartEmptyState.classList.add('hidden');
    chartContainer.classList.remove('hidden');
    
    let totalAll = 0;
    let categoryTotals = {};
    let totalNeed = 0;
    let totalWant = 0;

    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        if (exp.type === 'Kebutuhan') totalNeed += exp.amount;
        else totalWant += exp.amount;
        totalAll += exp.amount;
    });

    const sortedCategories = Object.keys(categoryTotals).map(cat => ({
        name: cat,
        amount: categoryTotals[cat],
        percentage: ((categoryTotals[cat] / totalAll) * 100).toFixed(1)
    })).sort((a, b) => b.amount - a.amount);

    barChartArea.innerHTML = '';
    sortedCategories.forEach(item => {
        const row = document.createElement('div');
        row.className = 'chart-row';
        row.innerHTML = `
            <div class="chart-info">
                <span>${item.name} <span style="color:var(--text-muted); font-size:0.8rem">(${item.percentage}%)</span></span>
                <span>${formatRupiah(item.amount)}</span>
            </div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: 0%"></div>
            </div>
        `;
        barChartArea.appendChild(row);
        setTimeout(() => row.querySelector('.chart-bar-fill').style.width = `${item.percentage}%`, 100);
    });

    const needPct = ((totalNeed / totalAll) * 100).toFixed(1);
    const wantPct = ((totalWant / totalAll) * 100).toFixed(1);

    typeChartArea.innerHTML = `
        <div class="chart-row">
            <div class="chart-info">
                <span>Kebutuhan <span style="color:var(--text-muted); font-size:0.8rem">(${needPct}%)</span></span>
                <span>${formatRupiah(totalNeed)}</span>
            </div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: 0%"></div>
            </div>
        </div>
        <div class="chart-row">
            <div class="chart-info">
                <span>Keinginan <span style="color:var(--text-muted); font-size:0.8rem">(${wantPct}%)</span></span>
                <span>${formatRupiah(totalWant)}</span>
            </div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill want-bar" style="width: 0%"></div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const typeFills = typeChartArea.querySelectorAll('.chart-bar-fill');
        if (typeFills[0]) typeFills[0].style.width = `${needPct}%`;
        if (typeFills[1]) typeFills[1].style.width = `${wantPct}%`;
    }, 100);

    const topCat = sortedCategories[0];
    if (wantPct > 40) {
        evalTextEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--danger);"></i> Pengeluaran untuk <strong>Keinginan</strong> cukup tinggi (${wantPct}%). Coba rem sedikit jajanmu, pos terbanyak ada di <strong>${topCat.name}</strong> (${formatRupiah(topCat.amount)}).`;
    } else {
        evalTextEl.innerHTML = `<i class="fa-solid fa-award" style="color: var(--safe);"></i> Bagus! Pengeluaranmu didominasi oleh <strong>Kebutuhan</strong> (${needPct}%). Pengeluaran terbesarmu bulan ini adalah pos <strong>${topCat.name}</strong>.`;
    }
}

// Inisialisasi awal
updateDashboard();

// ==========================================
// LOGIKA EDIT PROFIL 
// ==========================================
const toggleEditProfileBtn = document.getElementById('toggleEditProfileBtn');
const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
const profileDisplay = document.getElementById('profileDisplay');
const profileEditForm = document.getElementById('profileEditForm');
const profileNameDisplay = document.getElementById('profileNameDisplay');
const profileNrpDisplay = document.getElementById('profileNrpDisplay');
const profileNameInput = document.getElementById('profileNameInput');
const profileNrpInput = document.getElementById('profileNrpInput');
const editPhotoBtn = document.getElementById('editPhotoBtn');
const profileUpload = document.getElementById('profileUpload');
const profileImg = document.getElementById('profileImg');

let isEditingProfile = false;

function exitProfileEditMode() {
    isEditingProfile = false;
    profileDisplay.classList.remove('hidden');
    profileEditForm.classList.add('hidden');
    editPhotoBtn.classList.add('hidden');
    cancelEditProfileBtn.classList.add('hidden');
    toggleEditProfileBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit Profil';
    toggleEditProfileBtn.style.background = 'var(--primary)';
    
    profileNameInput.classList.remove('invalid-border');
    profileNrpInput.classList.remove('invalid-border');
}

toggleEditProfileBtn.addEventListener('click', () => {
    if (!isEditingProfile) {
        isEditingProfile = true;
        
        profileNameInput.value = profileNameDisplay.textContent;
        profileNrpInput.value = profileNrpDisplay.textContent.replace('NRP: ', '');

        profileDisplay.classList.add('hidden');
        profileEditForm.classList.remove('hidden');
        editPhotoBtn.classList.remove('hidden');
        cancelEditProfileBtn.classList.remove('hidden');
        
        toggleEditProfileBtn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Profil';
        toggleEditProfileBtn.style.background = 'var(--safe)';
    } else {
        const newName = profileNameInput.value.trim();
        const newNrp = profileNrpInput.value.trim();
        let isValid = true;
        
        if (!newName) {
            profileNameInput.classList.add('invalid-border');
            isValid = false;
        } else {
            profileNameInput.classList.remove('invalid-border');
        }
        
        if (!newNrp) {
            profileNrpInput.classList.add('invalid-border');
            isValid = false;
        } else {
            profileNrpInput.classList.remove('invalid-border');
        }

        if (isValid) {
            profileNameDisplay.textContent = newName;
            profileNrpDisplay.textContent = 'NRP: ' + newNrp;
            exitProfileEditMode();
        } else {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion && profileEditForm.animate) {
                profileEditForm.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-6px)' },
                    { transform: 'translateX(6px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 400 });
            }
        }
    }
});

cancelEditProfileBtn.addEventListener('click', exitProfileEditMode);

profileUpload.addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
        profileImg.src = URL.createObjectURL(this.files[0]);
    }
});