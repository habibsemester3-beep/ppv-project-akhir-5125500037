// src/state.js
// Pengelola State & Logika Data Keuangan "Dompet Anak Kos"

let expenses = [];
let monthlyBudget = 0;
let idToDelete = null;

export function getExpenses() {
    return expenses;
}

export function getMonthlyBudget() {
    return monthlyBudget;
}

export function setMonthlyBudget(amount) {
    monthlyBudget = amount;
}

export function getIdToDelete() {
    return idToDelete;
}

export function setIdToDelete(id) {
    idToDelete = id;
}

export function addExpense(expense) {
    expenses.unshift(expense);
}

export function updateExpense(id, updatedData) {
    const index = expenses.findIndex(e => e.id == id);
    if (index !== -1) {
        expenses[index] = { ...expenses[index], ...updatedData };
    }
}

export function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
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