/* ==========================================================================
   LOGITRACK PRO WMS - DASHBOARD VIEW CONTROLLER & PURE DOM RENDER
   File: frontend/js/views/dashboard.view.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const session = StorageService.getSession();
  if (!session && !window.location.pathname.includes('login.html')) { window.location.href = 'login.html'; return; }
  if (session) {
    const avatar = document.getElementById('userAvatar'); const name = document.getElementById('userNameDisplay');
    if (avatar) avatar.textContent = session.name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (name) name.textContent = session.name;
  }
  initDashboardEvents(); renderDashboardOverview(); renderKatalogBarang(); renderBarangMasuk(); renderBarangKeluar(); renderStokMinimum(); renderPemasok(); renderKaryawan(); renderAset(); if (typeof renderStokOpname === 'function') renderStokOpname();
  if (window.lucide) lucide.createIcons();
});

function initDashboardEvents() {
  const logoutBtn = document.getElementById('logoutBtn'); if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  const refreshBtn = document.getElementById('refreshDataBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', () => { renderDashboardOverview(); renderKatalogBarang(); ToastComponent.show('Data berhasil diperbarui!', 'success'); });
  const notifBtn = document.getElementById('notificationBtn');
  if (notifBtn) notifBtn.addEventListener('click', () => ToastComponent.show('System notifikasi siap diintegrasikan', 'info'));
  const groupToggle = document.getElementById('persediaanGroupToggle');
  if (groupToggle) groupToggle.addEventListener('click', () => { const g = document.getElementById('persediaanGroup'); if (g) g.classList.toggle('open'); });

  // Period Filter Buttons
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); const period = btn.getAttribute('data-period'); const db = StorageService.getDB();
      if (typeof ChartComponent !== 'undefined') {
        if (period === '30') ChartComponent.render('barChartContainer', db.chartMutation30Days || db.chartMutation7Days);
        else if (period === 'custom') ToastComponent.show('Custom Range Filter: Fitur filter kustom siap diintegrasikan', 'info');
        else ChartComponent.render('barChartContainer', db.chartMutation7Days);
      }
    });
  });

  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.addEventListener('input', (e) => {
    if (typeof handleGlobalSearch === 'function') handleGlobalSearch(e);
  });

  document.querySelectorAll('[data-open-modal]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(btn.getAttribute('data-open-modal')); }));
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal'))));

  // Form Submit Bindings
  const barangForm = document.getElementById('barangForm'); if (barangForm) barangForm.addEventListener('submit', handleBarangSubmit);
  const inboundForm = document.getElementById('inboundForm'); if (inboundForm) inboundForm.addEventListener('submit', handleInboundSubmit);
  const outboundForm = document.getElementById('outboundForm'); if (outboundForm) outboundForm.addEventListener('submit', handleOutboundSubmit);
  const pemasokForm = document.getElementById('pemasokForm'); if (pemasokForm) pemasokForm.addEventListener('submit', handlePemasokSubmit);
  const karyawanForm = document.getElementById('karyawanForm'); if (karyawanForm) karyawanForm.addEventListener('submit', handleKaryawanSubmit);
  const asetForm = document.getElementById('asetForm'); if (asetForm) asetForm.addEventListener('submit', handleAsetSubmit);
  const opnameForm = document.getElementById('opnameForm'); if (opnameForm) opnameForm.addEventListener('submit', handleOpnameSubmit);

  // Global Click Event Delegation for Edit & Delete Actions
  document.addEventListener('click', (e) => {
    const editBarang = e.target.closest('[data-edit-barang]'); const delBarang = e.target.closest('[data-delete-barang]');
    const editPemasok = e.target.closest('[data-edit-pemasok]'); const delPemasok = e.target.closest('[data-delete-pemasok]');
    const editKaryawan = e.target.closest('[data-edit-karyawan]'); const delKaryawan = e.target.closest('[data-delete-karyawan]');
    const editAset = e.target.closest('[data-edit-aset]'); const delAset = e.target.closest('[data-delete-aset]');
    const delBM = e.target.closest('[data-delete-bm]'); const delBK = e.target.closest('[data-delete-bk]');

    if (editBarang) openEditBarangModal(editBarang.getAttribute('data-edit-barang'));
    if (editPemasok) openEditPemasokModal(editPemasok.getAttribute('data-edit-pemasok'));
    if (editKaryawan) openEditKaryawanModal(editKaryawan.getAttribute('data-edit-karyawan'));
    if (editAset) openEditAsetModal(editAset.getAttribute('data-edit-aset'));

    if (delBarang && confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      const res = InventoryService.deleteBarang(delBarang.getAttribute('data-delete-barang'));
      if (res.success) { renderKatalogBarang(); renderDashboardOverview(); ToastComponent.show(res.message, 'success'); }
    }
    if (delPemasok && confirm('Apakah Anda yakin ingin menghapus data pemasok ini?')) {
      const res = InventoryService.deletePemasok(delPemasok.getAttribute('data-delete-pemasok'));
      if (res.success) { renderPemasok(); ToastComponent.show(res.message, 'success'); }
    }
    if (delKaryawan && confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) {
      const res = InventoryService.deleteKaryawan(delKaryawan.getAttribute('data-delete-karyawan'));
      if (res.success) { renderKaryawan(); ToastComponent.show(res.message, 'success'); }
    }
    if (delAset && confirm('Apakah Anda yakin ingin menghapus data aset ini?')) {
      const res = InventoryService.deleteAset(delAset.getAttribute('data-delete-aset'));
      if (res.success) { renderAset(); ToastComponent.show(res.message, 'success'); }
    }
    if (delBM && confirm('Apakah Anda yakin ingin menghapus transaksi barang masuk ini?')) {
      const res = InventoryService.deleteBarangMasuk(delBM.getAttribute('data-delete-bm'));
      if (res.success) { renderBarangMasuk(); renderDashboardOverview(); ToastComponent.show(res.message, 'success'); }
    }
    if (delBK && confirm('Apakah Anda yakin ingin menghapus transaksi barang keluar ini?')) {
      const res = InventoryService.deleteBarangKeluar(delBK.getAttribute('data-delete-bk'));
      if (res.success) { renderBarangKeluar(); renderDashboardOverview(); ToastComponent.show(res.message, 'success'); }
    }
  });
}

function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar dari sistem LogiTrack Pro?')) {
    StorageService.clearSession(); window.location.href = 'login.html';
  }
}

function renderDashboardOverview() {
  const db = StorageService.getDB();
  const barangList = db.barang || []; const criticalItems = barangList.filter(b => b.stok <= b.stok_minimum);
  const bmList = db.barang_masuk || []; const bkList = db.barang_keluar || [];

  const totalBarangEl = document.getElementById('statTotalBarang');
  const stokKritisEl = document.getElementById('statStokKritis');
  const barangMasukEl = document.getElementById('statBarangMasuk');
  const barangKeluarEl = document.getElementById('statBarangKeluar');

  if (totalBarangEl) totalBarangEl.textContent = barangList.length;
  if (stokKritisEl) stokKritisEl.textContent = criticalItems.length;
  if (barangMasukEl) barangMasukEl.textContent = bmList.length;
  if (barangKeluarEl) barangKeluarEl.textContent = bkList.length;

  const trendTotal = document.getElementById('trendTotalBarang');
  const trendKritis = document.getElementById('trendStokKritis');
  const trendBM = document.getElementById('trendBarangMasuk');
  const trendBK = document.getElementById('trendBarangKeluar');

  if (trendTotal) trendTotal.textContent = barangList.length === 0 ? '0 SKU aktif' : `↑ ${barangList.length} SKU aktif`;
  if (trendKritis) {
    if (criticalItems.length === 0) {
      trendKritis.textContent = '✓ Stok Aman (0 SKU)'; trendKritis.className = 'kpi-trend up-good';
    } else {
      trendKritis.textContent = `↓ ${criticalItems.length} SKU kritis`; trendKritis.className = 'kpi-trend danger';
    }
  }
  if (trendBM) trendBM.textContent = bmList.length === 0 ? '0 transaksi' : `↑ ${bmList.length} transaksi`;
  if (trendBK) trendBK.textContent = bkList.length === 0 ? '0 transaksi' : `↑ ${bkList.length} transaksi`;

  if (typeof ChartComponent !== 'undefined') ChartComponent.render('barChartContainer', db.chartMutation7Days || []);
  renderCapacityWidget(db.capacityZones || []);
  renderCriticalList(criticalItems);
  renderRecentActivities(db.aktivitas || []);
}

function renderCapacityWidget(zones) {
  const container = document.getElementById('warehouseCapacityList'); if (!container) return;
  container.textContent = '';
  if (!Array.isArray(zones) || zones.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.padding = '24px'; emptyMsg.style.textAlign = 'center'; emptyMsg.style.color = 'var(--text-tertiary)'; emptyMsg.style.fontSize = '13px';
    emptyMsg.textContent = 'Belum ada data kapasitas zona gudang terdaftar';
    container.appendChild(emptyMsg); return;
  }
  zones.forEach(z => {
    const item = document.createElement('div'); item.className = 'capacity-item';
    const header = document.createElement('div'); header.className = 'capacity-item-header';
    const nameSpan = document.createElement('span'); nameSpan.className = 'capacity-item-name'; nameSpan.textContent = z.name;
    const valSpan = document.createElement('span'); valSpan.className = 'capacity-item-val'; valSpan.textContent = `${z.percent}% (${z.used})`;
    header.appendChild(nameSpan); header.appendChild(valSpan);
    const track = document.createElement('div'); track.className = 'capacity-bar-track';
    const fill = document.createElement('div'); fill.className = `capacity-bar-fill ${z.percent > 80 ? 'high' : ''}`; fill.style.width = `${z.percent}%`;
    track.appendChild(fill); item.appendChild(header); item.appendChild(track); container.appendChild(item);
  });
}

function renderCriticalList(items) {
  const container = document.getElementById('criticalStockList'); if (!container) return;
  container.textContent = '';
  if (!items || items.length === 0) {
    const msg = document.createElement('div'); msg.style.padding = '24px'; msg.style.textAlign = 'center'; msg.className = 'text-success'; msg.textContent = 'Stok dalam kondisi aman';
    container.appendChild(msg); return;
  }
  items.slice(0, 4).forEach(item => {
    const card = document.createElement('div'); card.className = 'critical-item';
    const left = document.createElement('div'); left.className = 'critical-item-left';
    const name = document.createElement('span'); name.className = 'critical-item-name'; name.textContent = item.nama_barang;
    left.appendChild(name);
    const right = document.createElement('div'); right.className = 'critical-item-right';
    const qty = document.createElement('span'); qty.className = 'critical-item-qty'; qty.textContent = `${item.stok} ${item.satuan}`;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn-ghost-sm'; btn.textContent = 'Restok';
    btn.setAttribute('data-open-modal', 'inboundModal'); btn.addEventListener('click', () => openModal('inboundModal'));
    right.appendChild(qty); right.appendChild(btn); card.appendChild(left); card.appendChild(right); container.appendChild(card);
  });
}

function renderRecentActivities(activities) {
  const tbody = document.getElementById('recentActivitiesTbody'); const template = document.getElementById('recentActivityRowTemplate');
  if (!tbody) return;
  tbody.textContent = '';
  if (!Array.isArray(activities) || activities.length === 0) {
    renderEmptyTableState(tbody, 5, 'Belum ada riwayat aktivitas gudang'); return;
  }
  const sorted = [...activities].sort((a, b) => (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0));
  sorted.slice(0, 7).forEach(act => {
    const isIn = act.jenis === 'Inbound';
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.waktu').textContent = act.waktu;
      const badge = clone.querySelector('.badge');
      badge.className = isIn ? 'badge badge-inbound' : 'badge badge-outbound';
      badge.textContent = isIn ? '↙ Inbound' : '↗ Outbound';
      clone.querySelector('.barang').textContent = act.barang;
      const qtyTd = clone.querySelector('.kuantitas');
      qtyTd.className = `font-mono ${isIn ? 'text-info' : 'text-warning'}`;
      qtyTd.textContent = act.kuantitas;
      clone.querySelector('.petugas').textContent = act.petugas;
      tbody.appendChild(clone);
    }
  });
}
