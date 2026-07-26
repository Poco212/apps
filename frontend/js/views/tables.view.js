/* ==========================================================================
   LOGITRACK PRO WMS - SECONDARY TABLES & PURE JS DOM RENDER CONTROLLER
   File: frontend/js/views/tables.view.js
   ========================================================================== */

function renderEmptyTableState(tbody, colspan, message) {
  tbody.textContent = '';
  const tr = document.createElement('tr'); const td = document.createElement('td');
  td.colSpan = colspan; td.className = 'empty-state text-muted'; td.style.textAlign = 'center'; td.style.padding = '24px';
  td.textContent = message; tr.appendChild(td); tbody.appendChild(tr);
}

// 1. Katalog Barang Table (No Auto ID, Only SKU)
function renderKatalogBarang() {
  const db = StorageService.getDB(); const tbody = document.getElementById('katalogBarangTbody'); const template = document.getElementById('katalogRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  if (!db.barang || db.barang.length === 0) { renderEmptyTableState(tbody, 7, 'Belum ada barang di katalog.'); return; }

  db.barang.forEach(item => {
    const isCritical = item.stok <= item.stok_minimum;
    const catIconName = InventoryModel.categoryIcons[item.kategori] || 'box';
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.sku').textContent = item.kode_barang;
      const iconSpan = clone.querySelector('.icon');
      if (iconSpan) { iconSpan.setAttribute('data-lucide', catIconName); iconSpan.style.width = '16px'; iconSpan.style.height = '16px'; }
      clone.querySelector('.nama-text').textContent = item.nama_barang;
      clone.querySelector('.kategori').textContent = item.kategori;
      const stokTd = clone.querySelector('.stok');
      stokTd.textContent = `${item.stok} ${item.satuan}`;
      if (isCritical) stokTd.classList.add('text-danger');
      clone.querySelector('.stok-min').textContent = `${item.stok_minimum} ${item.satuan}`;
      const badge = clone.querySelector('.status-badge');
      badge.className = isCritical ? 'badge badge-danger' : 'badge badge-success';
      badge.textContent = isCritical ? 'Kritis' : 'Aman';
      clone.querySelector('.btn-edit').setAttribute('data-edit-barang', item.id);
      clone.querySelector('.btn-delete').setAttribute('data-delete-barang', item.id);
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}

// 2. Barang Masuk Table (No BM ID)
function renderBarangMasuk() {
  const db = StorageService.getDB(); const tbody = document.getElementById('barangMasukTbody'); const template = document.getElementById('bmRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  const records = db.barang_masuk || [];
  if (records.length === 0) { renderEmptyTableState(tbody, 7, 'Belum ada riwayat transaksi barang masuk.'); return; }

  records.forEach(bm => {
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.tanggal').textContent = bm.tanggal;
      clone.querySelector('.barang').textContent = bm.nama_barang;
      clone.querySelector('.jumlah').textContent = `+${bm.jumlah} ${bm.satuan || ''}`;
      clone.querySelector('.pemasok').textContent = bm.nama_pemasok || '-';
      clone.querySelector('.petugas').textContent = bm.petugas || 'Admin';
      clone.querySelector('.keterangan').textContent = bm.keterangan || '-';
      clone.querySelector('.btn-delete').setAttribute('data-delete-bm', bm.id);
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}

// 3. Barang Keluar Table (No BK ID)
function renderBarangKeluar() {
  const db = StorageService.getDB(); const tbody = document.getElementById('barangKeluarTbody'); const template = document.getElementById('bkRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  const records = db.barang_keluar || [];
  if (records.length === 0) { renderEmptyTableState(tbody, 7, 'Belum ada riwayat transaksi barang keluar.'); return; }

  records.forEach(bk => {
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.tanggal').textContent = bk.tanggal;
      clone.querySelector('.barang').textContent = bk.nama_barang;
      clone.querySelector('.jumlah').textContent = `-${bk.jumlah} ${bk.satuan || ''}`;
      clone.querySelector('.tujuan').textContent = bk.tujuan || '-';
      clone.querySelector('.petugas').textContent = bk.petugas || 'Admin';
      clone.querySelector('.keterangan').textContent = bk.keterangan || '-';
      clone.querySelector('.btn-delete').setAttribute('data-delete-bk', bk.id);
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}

// 4. Stok Minimum Table
function renderStokMinimum() {
  const db = StorageService.getDB(); const tbody = document.getElementById('stokMinimumTbody'); const template = document.getElementById('stokMinRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  const criticalItems = (db.barang || []).filter(b => b.stok <= b.stok_minimum);
  if (criticalItems.length === 0) { renderEmptyTableState(tbody, 7, 'Tidak ada barang dengan stok kritis! Semua stok aman.'); return; }

  criticalItems.forEach(item => {
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.sku').textContent = item.kode_barang;
      clone.querySelector('.nama').textContent = item.nama_barang;
      clone.querySelector('.kategori').textContent = item.kategori;
      const satEl = clone.querySelector('.satuan'); if (satEl) satEl.textContent = item.satuan;
      clone.querySelector('.stok').textContent = `${item.stok} ${item.satuan}`;
      clone.querySelector('.stok-min').textContent = `${item.stok_minimum} ${item.satuan}`;
      clone.querySelector('.restok').textContent = `+${item.stok_minimum * 2 - item.stok} ${item.satuan}`;
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}

// 5. Pemasok Table (No SUP ID, Added Kategori)
function renderPemasok() {
  const db = StorageService.getDB(); const tbody = document.getElementById('pemasokTbody'); const template = document.getElementById('pemasokRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  if (!db.pemasok || db.pemasok.length === 0) { renderEmptyTableState(tbody, 6, 'Belum ada data pemasok.'); return; }

  db.pemasok.forEach(p => {
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.nama').textContent = p.nama_pemasok;
      const catEl = clone.querySelector('.kategori'); if (catEl) catEl.textContent = p.kategori || 'Umum';
      clone.querySelector('.alamat').textContent = p.alamat;
      clone.querySelector('.telepon').textContent = p.telepon;
      clone.querySelector('.email').textContent = p.email;
      clone.querySelector('.btn-edit').setAttribute('data-edit-pemasok', p.id);
      clone.querySelector('.btn-delete').setAttribute('data-delete-pemasok', p.id);
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}

// 6. Karyawan Table (No EMP ID, Added Umur, JK, Tanggal Masuk, Alamat)
function renderKaryawan() {
  const db = StorageService.getDB(); const tbody = document.getElementById('karyawanTbody'); const template = document.getElementById('karyawanRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  if (!db.karyawan || db.karyawan.length === 0) { renderEmptyTableState(tbody, 9, 'Belum ada data karyawan.'); return; }

  db.karyawan.forEach(k => {
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.nama').textContent = k.nama;
      const umurEl = clone.querySelector('.umur'); if (umurEl) umurEl.textContent = `${k.umur || 25} thn`;
      const jkEl = clone.querySelector('.jk'); if (jkEl) jkEl.textContent = k.jenis_kelamin || 'Laki-laki';
      clone.querySelector('.jabatan').textContent = k.jabatan;
      const almEl = clone.querySelector('.alamat'); if (almEl) almEl.textContent = k.alamat || '-';
      clone.querySelector('.telepon').textContent = k.telepon;
      clone.querySelector('.email').textContent = k.email;
      const masukEl = clone.querySelector('.masuk'); if (masukEl) masukEl.textContent = k.tanggal_masuk || '-';
      clone.querySelector('.btn-edit').setAttribute('data-edit-karyawan', k.id);
      clone.querySelector('.btn-delete').setAttribute('data-delete-karyawan', k.id);
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}

// 7. Aset Table (Added Keterangan)
function renderAset() {
  const db = StorageService.getDB(); const tbody = document.getElementById('asetTbody'); const template = document.getElementById('asetRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  if (!db.aset || db.aset.length === 0) { renderEmptyTableState(tbody, 7, 'Belum ada data aset gudang.'); return; }

  db.aset.forEach(a => {
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.nama').textContent = a.nama_aset;
      clone.querySelector('.kategori').textContent = a.kategori;
      clone.querySelector('.jumlah').textContent = `${a.jumlah} Unit`;
      clone.querySelector('.nilai').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(a.nilai);
      clone.querySelector('.tanggal').textContent = a.tanggal_perolehan;
      const ketEl = clone.querySelector('.keterangan'); if (ketEl) ketEl.textContent = a.keterangan || '-';
      clone.querySelector('.btn-edit').setAttribute('data-edit-aset', a.id);
      clone.querySelector('.btn-delete').setAttribute('data-delete-aset', a.id);
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}

// 8. Stok Opname Table
function renderStokOpname() {
  const db = StorageService.getDB(); const tbody = document.getElementById('stokOpnameTbody'); const template = document.getElementById('opnameRowTemplate');
  if (!tbody) return; tbody.textContent = '';
  let records = db.stok_opname || [];

  const catFilter = document.getElementById('opnameCategoryFilter') ? document.getElementById('opnameCategoryFilter').value : 'all';
  const statusFilter = document.getElementById('opnameStatusFilter') ? document.getElementById('opnameStatusFilter').value : 'all';
  const periodFilter = document.getElementById('opnamePeriodFilter') ? document.getElementById('opnamePeriodFilter').value : 'all';

  if (catFilter && catFilter !== 'all') {
    records = records.filter(so => {
      const item = (db.barang || []).find(b => b.id === so.id_barang || b.nama_barang === so.nama_barang);
      return item && item.kategori === catFilter;
    });
  }

  if (statusFilter && statusFilter !== 'all') {
    if (statusFilter === 'match') records = records.filter(so => so.selisih === 0);
    else if (statusFilter === 'surplus') records = records.filter(so => so.selisih > 0);
    else if (statusFilter === 'deficit') records = records.filter(so => so.selisih < 0);
  }

  if (periodFilter && periodFilter !== 'all') {
    const now = new Date();
    if (periodFilter === 'this-week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      records = records.filter(so => new Date(so.tanggal) >= weekAgo);
    } else if (periodFilter === 'this-month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      records = records.filter(so => new Date(so.tanggal) >= monthAgo);
    }
  }

  if (records.length === 0) { renderEmptyTableState(tbody, 6, 'Tidak ada data stok opname yang sesuai dengan filter.'); return; }

  records.forEach(so => {
    if (template) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.tanggal').textContent = so.tanggal;
      clone.querySelector('.barang').textContent = so.nama_barang;
      clone.querySelector('.sistem').textContent = `${so.stok_sistem} ${so.satuan || ''}`;
      clone.querySelector('.fisik').textContent = `${so.stok_fisik} ${so.satuan || ''}`;
      const diffTd = clone.querySelector('.selisih');
      diffTd.textContent = `${so.selisih >= 0 ? '+' : ''}${so.selisih} ${so.satuan || ''}`;
      diffTd.className = `font-mono ${so.selisih === 0 ? 'text-success' : (so.selisih < 0 ? 'text-danger' : 'text-info')}`;
      clone.querySelector('.keterangan').textContent = so.keterangan || '-';
      tbody.appendChild(clone);
    }
  });
  if (window.lucide) lucide.createIcons();
}
