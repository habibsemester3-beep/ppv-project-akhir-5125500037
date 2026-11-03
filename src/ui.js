// src/ui.js
// Modul Render Tampilan DOM, Dashboard, Chart, & Modal

import { 
    getExpenses, 
    getMonthlyBudget, 
    formatRupiah, 
    getDaysLeftInMonth 
} from './state.js';
import { bukaModalDetailHTML } from './ui-pustaka.js';

export function updateDashboard() {
    const expenses = getExpenses();
    const monthlyBudget = getMonthlyBudget();

    const remainingBalanceEl = document.getElementById('remainingBalance');
    const reportTotalExpenseEl = document.getElementById('reportTotalExpense');
    const daysLeftEl = document.getElementById('daysLeft');
    const dailyAllowanceEl = document.getElementById('dailyAllowance');
    const txCountEl = document.getElementById('transactionCount');
    const balanceProgressEl = document.getElementById('balanceProgress');
    const balanceStatusEl = document.getElementById('balanceStatus');
    const emptyState = document.getElementById('emptyState');
    const resultState = document.getElementById('resultState');
    const expenseList = document.getElementById('expenseList');

    const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);
    const remaining = monthlyBudget - totalExpenses;
    const percentageLeft = monthlyBudget > 0 ? (remaining / monthlyBudget) * 100 : 0;
    
    const daysLeft = getDaysLeftInMonth();
    const dailyAllowance = remaining > 0 ? Math.floor(remaining / daysLeft) : 0;

    if (remainingBalanceEl) remainingBalanceEl.textContent = formatRupiah(remaining);
    if (reportTotalExpenseEl) reportTotalExpenseEl.textContent = formatRupiah(totalExpenses);
    if (daysLeftEl) daysLeftEl.textContent = daysLeft;
    if (dailyAllowanceEl) dailyAllowanceEl.textContent = `${formatRupiah(dailyAllowance)} / hari`;
    if (txCountEl) txCountEl.textContent = `${expenses.length} Item`;

    if (balanceProgressEl) {
        balanceProgressEl.style.width = `${Math.max(0, Math.min(percentageLeft, 100))}%`;
        balanceProgressEl.className = 'progress-bar'; 

        if (percentageLeft > 40) {
            balanceProgressEl.classList.add('safe');
            balanceStatusEl.innerHTML = 'Aman terkendali! <i class="fa-solid fa-rocket"></i>';
            balanceStatusEl.className = 'status-text text-safe';
            if (dailyAllowanceEl) dailyAllowanceEl.className = 'text-safe';
        } else if (percentageLeft > 20) {
            balanceProgressEl.classList.add('warning');
            balanceStatusEl.innerHTML = 'Waspada, saldo mulai menipis! <i class="fa-solid fa-eye"></i>';
            balanceStatusEl.className = 'status-text text-warning';
            if (dailyAllowanceEl) dailyAllowanceEl.className = 'text-warning';
        } else {
            balanceProgressEl.classList.add('critical');
            balanceStatusEl.innerHTML = 'Kritis! Mode Indomie diaktifkan! <i class="fa-solid fa-triangle-exclamation"></i>';
            balanceStatusEl.className = 'status-text text-danger';
            if (dailyAllowanceEl) dailyAllowanceEl.className = 'text-danger';
        }
    }

    if (expenses.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (resultState) resultState.classList.add('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        if (resultState) resultState.classList.remove('hidden');
        
        if (expenseList) {
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
            });
        }
    }
}

export function renderChart() {
    const expenses = getExpenses();
    const chartEmptyState = document.getElementById('chartEmptyState');
    const chartContainer = document.getElementById('chartContainer');
    const barChartArea = document.getElementById('barChartArea');
    const typeChartArea = document.getElementById('typeChartArea');
    const evalTextEl = document.getElementById('evalText');
    
    if (expenses.length === 0) {
        if (chartEmptyState) chartEmptyState.classList.remove('hidden');
        if (chartContainer) chartContainer.classList.add('hidden');
        if (evalTextEl) evalTextEl.textContent = 'Belum ada transaksi untuk dievaluasi.';
        if (typeChartArea) typeChartArea.innerHTML = '';
        return;
    }
    
    if (chartEmptyState) chartEmptyState.classList.add('hidden');
    if (chartContainer) chartContainer.classList.remove('hidden');
    
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

    if (barChartArea) {
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
            setTimeout(() => {
                const fill = row.querySelector('.chart-bar-fill');
                if (fill) fill.style.width = `${item.percentage}%`;
            }, 100);
        });
    }

    const needPct = ((totalNeed / totalAll) * 100).toFixed(1);
    const wantPct = ((totalWant / totalAll) * 100).toFixed(1);

    if (typeChartArea) {
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
    }

    const topCat = sortedCategories[0];
    if (evalTextEl) {
        if (wantPct > 40) {
            evalTextEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--danger);"></i> Pengeluaran untuk <strong>Keinginan</strong> cukup tinggi (${wantPct}%). Coba rem sedikit jajanmu, pos terbanyak ada di <strong>${topCat.name}</strong> (${formatRupiah(topCat.amount)}).`;
        } else {
            evalTextEl.innerHTML = `<i class="fa-solid fa-award" style="color: var(--safe);"></i> Bagus! Pengeluaranmu didominasi oleh <strong>Kebutuhan</strong> (${needPct}%). Pengeluaran terbesarmu bulan ini adalah pos <strong>${topCat.name}</strong>.`;
        }
    }
}

export function openModal(exp) {
    if (!exp) return;
    
    const noteHtml = exp.note ? `<div class="modal-detail-row"><span class="modal-detail-label">Keterangan</span><span class="modal-detail-value" style="font-weight:500; font-size:0.85rem; max-width:60%; text-align:right;">${exp.note}</span></div>` : '';
    const imgHtml = exp.receipt ? `<img src="${exp.receipt}" class="modal-img-preview" alt="Struk">` : '';
    
    const isiHTML = `
        <div class="modal-detail-row"><span class="modal-detail-label">Transaksi</span><span class="modal-detail-value">${exp.name}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Nominal</span><span class="modal-detail-value text-danger">${formatRupiah(exp.amount)}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Waktu</span><span class="modal-detail-value">${exp.timestamp}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Kategori</span><span class="modal-detail-value">${exp.category}</span></div>
        <div class="modal-detail-row"><span class="modal-detail-label">Sifat</span><span class="modal-detail-value">${exp.type}</span></div>
        ${noteHtml}
        ${imgHtml}
    `;

    bukaModalDetailHTML(isiHTML);
}