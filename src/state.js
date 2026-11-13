// src/state.js
// Pengelola State & Logika Data Keuangan "Dompet Anak Kos"

export const KUNCI = 'dompet-anak-kos:v1';
let expenses = [];
let monthlyBudget = 0;
let idToDelete = null;

// Mengambil data secara aman (Anti-Banting)
export function inisialisasiData() {
    try {
        const dataBulan = localStorage.getItem(`${KUNCI}-budget`);
        if (dataBulan) monthlyBudget = parseInt(dataBulan) || 0;

        const dataJSON = localStorage.getItem(KUNCI);
        if (!dataJSON) return;

        const data = JSON.parse(dataJSON);
        if (Array.isArray(data)) {
            // Memastikan data terhindar dari format rusak
            expenses = data.filter(item => item && typeof item === 'object' && typeof item.name === 'string');
        }
    } catch (e) {
        console.error("Data lokal rusak, menggunakan data memori awal.", e);
        expenses = [];
        monthlyBudget = 0;
    }
}

// Menyimpan data secara aman
function simpanState() {
    try {
        localStorage.setItem(KUNCI, JSON.stringify(expenses));
        localStorage.setItem(`${KUNCI}-budget`, monthlyBudget.toString());
    } catch (e) {
        console.warn("Gagal menyimpan ke localStorage. (Mungkin diblokir atau penuh)", e);
    }
}

// Inisialisasi awal saat modul dimuat
inisialisasiData();

export function getExpenses() {
    return expenses;
}

export function getMonthlyBudget() {
    return monthlyBudget;
}

export function setMonthlyBudget(amount) {
    monthlyBudget = amount;
    simpanState();
}

export function getIdToDelete() {
    return idToDelete;
}

export function setIdToDelete(id) {
    idToDelete = id;
}

export function addExpense(expense) {
    expenses.unshift(expense);
    simpanState();
}

export function updateExpense(id, updatedData) {
    const index = expenses.findIndex(e => e.id == id);
    if (index !== -1) {
        expenses[index] = { ...expenses[index], ...updatedData };
        simpanState();
    }
}

export function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    simpanState();
}

export function getExpenseById(id) {
    return expenses.find(e => e.id === id);
}

// Utility / Helper Functions
export function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

export function getRawNumber(str) {
    return parseInt(String(str).replace(/[^0-9]/g, '')) || 0;
}

export function getDaysLeftInMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return lastDay - today.getDate() + 1;
}

export function getCurrentTimestamp() {
    return new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}