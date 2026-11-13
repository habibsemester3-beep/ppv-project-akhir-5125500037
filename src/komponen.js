// src/komponen.js
// Komponen UI yang bisa dipakai berulang

export function KartuPengeluaran(exp, formatRupiah) {
    const typeBadge = exp.type === 'Kebutuhan' ? 'need' : 'want';
    
    // Gunakan document.createElement dan textContent untuk keamanan
    const li = document.createElement('li');
    li.className = 'expense-item';
    
    // Bagian Kiri (Info)
    const itemLeft = document.createElement('div');
    itemLeft.className = 'item-left';
    
    const h4 = document.createElement('h4');
    h4.textContent = exp.name; // Aman dari injeksi
    
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';
    
    const spanType = document.createElement('span');
    spanType.className = `badge ${typeBadge}`;
    spanType.textContent = exp.type;
    
    const spanCat = document.createElement('span');
    spanCat.className = 'badge cat';
    spanCat.textContent = exp.category;
    
    tagsDiv.append(spanType, spanCat);
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'timestamp';
    timeDiv.innerHTML = `<i class="fa-regular fa-clock"></i> ${exp.timestamp}`;
    
    itemLeft.append(h4, tagsDiv, timeDiv);
    
    // Bagian Kanan (Aksi & Nominal)
    const itemRight = document.createElement('div');
    itemRight.className = 'item-right';
    
    const amountDiv = document.createElement('div');
    amountDiv.className = 'expense-amount';
    amountDiv.textContent = `- ${formatRupiah(exp.amount)}`;
    
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-btns';
    
    const btnDetail = document.createElement('button');
    btnDetail.className = 'btn-sm btn-detail';
    btnDetail.dataset.id = exp.id;
    btnDetail.textContent = 'Detail';
    
    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-sm btn-edit';
    btnEdit.dataset.id = exp.id;
    btnEdit.textContent = 'Edit';
    
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-sm btn-delete';
    btnDelete.dataset.id = exp.id;
    btnDelete.textContent = 'Hapus';
    
    actionDiv.append(btnDetail, btnEdit, btnDelete);
    itemRight.append(amountDiv, actionDiv);
    
    li.append(itemLeft, itemRight);
    
    return li;
}