// src/main.js
// Titik Masuk Utama (Entry Point) Aplikasi Dompet Anak Kos

import { 
    getExpenses, 
    setMonthlyBudget, 
    getIdToDelete, 
    setIdToDelete, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    getExpenseById, 
    getRawNumber, 
    getCurrentTimestamp 
} from './state.js';

import { 
    updateDashboard, 
    renderChart, 
    openModal 
} from './ui.js';

import { tampilkanToast } from './ui-pustaka.js';

// DOM Elements
const budgetInput = document.getElementById('monthlyBudget');
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
const expenseList = document.getElementById('expenseList');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultState = document.getElementById('resultState');
const successSound = document.getElementById('successSound');

const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view-section');

const detailModal = document.getElementById('detailModal');
const closeModalBtn = document.getElementById('closeModal');

const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Navigation SPA
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        btn.classList.add('active');
        const targetView = document.getElementById(btn.dataset.target);
        if (targetView) targetView.classList.add('active');
        if (btn.dataset.target === 'reportView') {
            renderChart();
        }
    });
});

// File Upload Handler
if (fileInput) {
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            let name = this.files[0].name;
            if (name.length > 18) name = name.substring(0, 15) + '...';
            fileLabelText.textContent = name;
            fileLabelText.style.color = 'var(--primary)';
        } else {
            fileLabelText.textContent = 'Pilih Foto / Screenshot...';
            fileLabelText.style.color = 'var(--text-muted)';
        }
    });
}

// Split Bill Handler
if (isSplitBillCheck) {
    isSplitBillCheck.addEventListener('change', function() {
        if (this.checked) {
            splitInputArea.classList.remove('hidden');
            splitCountInput.value = '';
        } else {
            splitInputArea.classList.add('hidden');
        }
    });
}

// Modal Handlers
if (closeModalBtn) closeModalBtn.addEventListener('click', () => detailModal.classList.add('hidden'));
if (detailModal) detailModal.addEventListener('click', (e) => { if (e.target === detailModal) detailModal.classList.add('hidden'); });

function askDeleteConfirmation(id) {
    setIdToDelete(id);
    if (confirmModal) confirmModal.classList.remove('hidden');
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
        setIdToDelete(null);
        if (confirmModal) confirmModal.classList.add('hidden');
    });
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
        const id = getIdToDelete();
        if (id !== null) {
            deleteExpense(id);
            if (editingIdInput.value == id) resetEditMode();
            updateDashboard();
            renderChart();
            tampilkanToast('Transaksi telah dihapus.');
        }
        setIdToDelete(null);
        if (confirmModal) confirmModal.classList.add('hidden');
    });
}

// Validation & Input Formats
function formatInputVisual(e) {
    let raw = getRawNumber(e.target.value);
    e.target.value = raw > 0 ? new Intl.NumberFormat('id-ID').format(raw) : '';
}

function toggleError(element, message, isValid) {
    const errorEl = document.getElementById(`error-${element.id}`);
    const targetEl = element.id === 'expenseAmount' ? element.parentElement : element;
    
    if (!isValid) {
        targetEl.classList.add('invalid-border');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('active');
        }
    } else {
        targetEl.classList.remove('invalid-border');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('active');
        }
    }
}

function validateInputs() {
    let isValid = true;
    if (nameInput.value.trim() === '') { toggleError(nameInput, 'Nama pengeluaran wajib diisi.', false); isValid = false; }
    if (getRawNumber(amountInput.value) <= 0) { toggleError(amountInput, 'Nominal harus lebih dari Rp 0.', false); isValid = false; }
    return isValid;
}

if (amountInput) amountInput.addEventListener('input', function(e) { formatInputVisual(e); if (getRawNumber(this.value) > 0) toggleError(amountInput, '', true); });
if (budgetInput) budgetInput.addEventListener('input', function(e) { formatInputVisual(e); setMonthlyBudget(getRawNumber(this.value)); updateDashboard(); });
if (nameInput) nameInput.addEventListener('input', () => { if (nameInput.value.trim() !== '') toggleError(nameInput, '', true); });

// Mouse Move Parallax Blobs
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const b1 = document.getElementById('blob1');
    const b2 = document.getElementById('blob2');
    if (b1) b1.style.transform = `translate(${x * 25}px, ${y * 25}px)`;
    if (b2) b2.style.transform = `translate(-${x * 35}px, -${y * 35}px)`;
});

// Form Submission & Edit Mode
if (expenseForm) {
    expenseForm.addEventListener('submit', function(e) { e.preventDefault(); if (validateInputs()) processNewExpense(); });
    expenseForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
            e.preventDefault(); 
            if (validateInputs()) processNewExpense();
        }
    });
}

// Event Delegation for Transaction List
if (expenseList) {
    expenseList.addEventListener('click', function(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (!id) return;
        if (e.target.classList.contains('btn-delete')) {
            askDeleteConfirmation(id);
        } else if (e.target.classList.contains('btn-detail')) {
            const exp = getExpenseById(id);
            openModal(exp);
        } else if (e.target.classList.contains('btn-edit')) {
            startEditMode(id);
        }
    });
}

function startEditMode(id) {
    const exp = getExpenseById(id);
    if (!exp) return;

    editingIdInput.value = exp.id;
    let cleanName = exp.name.replace(/^\[Patungan 1\/\d+\]\s*/, '');
    nameInput.value = cleanName;
    amountInput.value = new Intl.NumberFormat('id-ID').format(exp.amount);
    noteInput.value = exp.note || ''; 

    const catEl = document.querySelector(`input[name="expenseCategory"][value="${exp.category}"]`);
    if (catEl) catEl.checked = true;
    const typeEl = document.querySelector(`input[name="expenseType"][value="${exp.type}"]`);
    if (typeEl) typeEl.checked = true;

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
    fileLabelText.textContent = 'Pilih Foto / Screenshot...';
    fileLabelText.style.color = 'var(--text-muted)';
}

if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetEditMode);

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

    if (emptyState) emptyState.classList.add('hidden');
    if (resultState) resultState.classList.add('hidden');
    if (loadingState) loadingState.classList.remove('hidden');
    submitBtn.disabled = true;

    setTimeout(() => {
        if (loadingState) loadingState.classList.add('hidden');
        submitBtn.disabled = false;

        if (editingId) {
            updateExpense(editingId, {
                name: namePrefix + nameInput.value.trim(),
                amount: finalAmount,
                category: categorySelected,
                type: typeSelected,
                note: note,
                ...(receiptUrl && { receipt: receiptUrl })
            });
            
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
            addExpense(newExpense);
            
            tampilkanToast('Transaksi berhasil dicatat!');
            expenseForm.reset();
            noteInput.value = '';
        }

        splitInputArea.classList.add('hidden');
        fileLabelText.textContent = 'Pilih Foto / Screenshot...';
        fileLabelText.style.color = 'var(--text-muted)';
        
        if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => console.log('Autoplay ditahan browser'));
        }

        updateDashboard();
    }, 800);
}

// Profile Section Handlers
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
    if (profileDisplay) profileDisplay.classList.remove('hidden');
    if (profileEditForm) profileEditForm.classList.add('hidden');
    if (editPhotoBtn) editPhotoBtn.classList.add('hidden');
    if (cancelEditProfileBtn) cancelEditProfileBtn.classList.add('hidden');
    if (toggleEditProfileBtn) {
        toggleEditProfileBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit Profil';
        toggleEditProfileBtn.style.background = 'var(--primary)';
    }
    
    if (profileNameInput) profileNameInput.classList.remove('invalid-border');
    if (profileNrpInput) profileNrpInput.classList.remove('invalid-border');
}

if (toggleEditProfileBtn) {
    toggleEditProfileBtn.addEventListener('click', () => {
        if (!isEditingProfile) {
            isEditingProfile = true;
            if (profileNameInput) profileNameInput.value = profileNameDisplay.textContent;
            if (profileNrpInput) profileNrpInput.value = profileNrpDisplay.textContent.replace('NRP: ', '');

            if (profileDisplay) profileDisplay.classList.add('hidden');
            if (profileEditForm) profileEditForm.classList.remove('hidden');
            if (editPhotoBtn) editPhotoBtn.classList.remove('hidden');
            if (cancelEditProfileBtn) cancelEditProfileBtn.classList.remove('hidden');
            
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
                if (profileNameDisplay) profileNameDisplay.textContent = newName;
                if (profileNrpDisplay) profileNrpDisplay.textContent = 'NRP: ' + newNrp;
                exitProfileEditMode();
            }
        }
    });
}

if (cancelEditProfileBtn) cancelEditProfileBtn.addEventListener('click', exitProfileEditMode);

if (profileUpload) {
    profileUpload.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            profileImg.src = URL.createObjectURL(this.files[0]);
        }
    });
}

// Inisialisasi awal
updateDashboard();