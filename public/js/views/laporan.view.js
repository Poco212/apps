/* ==========================================================================
   LOGITRACK PRO WMS - INTEGRATED REPORTS VIEW CONTROLLER
   File: frontend/js/views/laporan.view.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initReportTabEvents();
  renderLaporanStok();
  renderLaporanTransaksi();
  renderLaporanKeuangan();
  if (window.lucide) lucide.createIcons();
});

function initReportTabEvents() {
  const tabBtns = document.querySelectorAll('.report-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.report-tab-pane').forEach(pane => pane.style.display = 'none');
      const activePane = document.getElementById(targetTab);
      if (activePane) activePane.style.display = 'block';
    });
  });
}

function renderLaporanStok() {
  const db = StorageService.getDB();
  const tbody = document.getElementById('laporanStokTbody');
  if (!tbody) return;
  tbody.textContent = '';
  const barangList = db.barang || [];

  if (barangList.length === 0) {
    renderEmptyTableState(tbody, 6, 'Belum ada data barang untuk laporan stok.');
    return;
  }

  barangList.forEach(b => {
    const isCritical = b.stok <= b.stok_minimum;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-mono text-info" style="font-weight: 500;">${b.kode_barang}</td>
      <td style="font-weight: 600;">${b.nama_barang}</td>
      <td>${b.kategori}</td>
      <td class="font-mono">${b.satuan}</td>
      <td class="font-mono" style="font-weight: 600;">${b.stok}</td>
      <td><span class="badge ${isCritical ? 'badge-danger' : 'badge-success'}">${isCritical ? 'Kritis' : 'Aman'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderLaporanTransaksi() {
  const db = StorageService.getDB();
  const tbody = document.getElementById('laporanTransaksiTbody');
  if (!tbody) return;
  tbody.textContent = '';

  const bmList = (db.barang_masuk || []).map(bm => ({ ...bm, type: 'Inbound' }));
  const bkList = (db.barang_keluar || []).map(bk => ({ ...bk, type: 'Outbound' }));
  const combined = [...bmList, ...bkList].sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));

  if (combined.length === 0) {
    renderEmptyTableState(tbody, 6, 'Belum ada transaksi barang masuk maupun keluar.');
    return;
  }

  combined.forEach(t => {
    const isIn = t.type === 'Inbound';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-mono">${t.tanggal || '-'}</td>
      <td><span class="badge ${isIn ? 'badge-inbound' : 'badge-outbound'}">${isIn ? '↙ Masuk' : '↗ Keluar'}</span></td>
      <td style="font-weight: 600;">${t.nama_barang}</td>
      <td class="font-mono ${isIn ? 'text-info' : 'text-warning'}">${isIn ? '+' : '-'}${t.jumlah} ${t.satuan || ''}</td>
      <td>${t.petugas || 'Admin'}</td>
      <td class="text-muted">${t.keterangan || (isIn ? t.nama_pemasok : t.tujuan) || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderLaporanKeuangan() {
  const db = StorageService.getDB();
  const asetList = db.aset || [];
  const totalFinancialEl = document.getElementById('reportTotalFinancialAset');
  const totalItemEl = document.getElementById('reportTotalJenisAset');
  const totalUnitEl = document.getElementById('reportTotalUnitAset');
  const tbody = document.getElementById('laporanKeuanganTbody');

  let totalNilai = 0;
  let totalUnit = 0;
  asetList.forEach(a => {
    totalNilai += (Number(a.nilai) || 0) * (Number(a.jumlah) || 1);
    totalUnit += (Number(a.jumlah) || 1);
  });

  const formattedNilai = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalNilai);

  if (totalFinancialEl) totalFinancialEl.textContent = formattedNilai;
  if (totalItemEl) totalItemEl.textContent = asetList.length;
  if (totalUnitEl) totalUnitEl.textContent = `${totalUnit} Unit`;

  if (!tbody) return;
  tbody.textContent = '';

  if (asetList.length === 0) {
    renderEmptyTableState(tbody, 5, 'Belum ada data aset finansial terdaftar.');
    return;
  }

  asetList.forEach(a => {
    const subtotal = (Number(a.nilai) || 0) * (Number(a.jumlah) || 1);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${a.nama_aset}</td>
      <td>${a.kategori}</td>
      <td class="font-mono">${a.jumlah} Unit</td>
      <td class="font-mono">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(a.nilai)}</td>
      <td class="font-mono text-info" style="font-weight: 600;">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal)}</td>
    `;
    tbody.appendChild(tr);
  });
}
