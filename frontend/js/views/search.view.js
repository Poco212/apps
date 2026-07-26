/* ==========================================================================
   LOGITRACK PRO WMS - GLOBAL MULTI-PAGE SEARCH & EMPTY STATE CONTROLLER
   File: frontend/js/views/search.view.js
   ========================================================================== */

function handleGlobalSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const db = StorageService.getDB();

  const katalogTbody = document.getElementById('katalogBarangTbody');
  const bmTbody = document.getElementById('barangMasukTbody');
  const bkTbody = document.getElementById('barangKeluarTbody');
  const opTbody = document.getElementById('stokOpnameTbody');
  const minTbody = document.getElementById('stokMinimumTbody');
  const supTbody = document.getElementById('pemasokTbody');
  const empTbody = document.getElementById('karyawanTbody');
  const asetTbody = document.getElementById('asetTbody');
  const actTbody = document.getElementById('recentActivitiesTbody');

  if (katalogTbody) {
    if (!query) { renderKatalogBarang(); return; }
    const filtered = (db.barang || []).filter(i => i.kode_barang.toLowerCase().includes(query) || i.nama_barang.toLowerCase().includes(query) || i.kategori.toLowerCase().includes(query));
    if (filtered.length === 0) { renderEmptyTableState(katalogTbody, 7, `Tidak ada barang yang cocok dengan "${query}"`); return; }
    katalogTbody.textContent = ''; const tpl = document.getElementById('katalogRowTemplate');
    filtered.forEach(i => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.sku').textContent = i.kode_barang;
        const iconSpan = c.querySelector('.icon'); if (iconSpan) iconSpan.setAttribute('data-lucide', InventoryModel.categoryIcons[i.kategori] || 'box');
        c.querySelector('.nama-text').textContent = i.nama_barang; c.querySelector('.kategori').textContent = i.kategori;
        c.querySelector('.stok').textContent = `${i.stok} ${i.satuan}`; c.querySelector('.stok-min').textContent = `${i.stok_minimum} ${i.satuan}`;
        const b = c.querySelector('.status-badge'); b.className = i.stok <= i.stok_minimum ? 'badge badge-danger' : 'badge badge-success'; b.textContent = i.stok <= i.stok_minimum ? 'Kritis' : 'Aman';
        c.querySelector('.btn-edit').setAttribute('data-edit-barang', i.id); c.querySelector('.btn-delete').setAttribute('data-delete-barang', i.id); katalogTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (bmTbody) {
    if (!query) { renderBarangMasuk(); return; }
    const filtered = (db.barang_masuk || []).filter(bm => (bm.nama_barang && bm.nama_barang.toLowerCase().includes(query)) || (bm.nama_pemasok && bm.nama_pemasok.toLowerCase().includes(query)));
    if (filtered.length === 0) { renderEmptyTableState(bmTbody, 7, `Tidak ada barang masuk yang cocok dengan "${query}"`); return; }
    bmTbody.textContent = ''; const tpl = document.getElementById('bmRowTemplate');
    filtered.forEach(bm => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.tanggal').textContent = bm.tanggal;
        c.querySelector('.barang').textContent = bm.nama_barang; c.querySelector('.jumlah').textContent = `+${bm.jumlah} ${bm.satuan || ''}`;
        c.querySelector('.pemasok').textContent = bm.nama_pemasok || '-'; c.querySelector('.petugas').textContent = bm.petugas || 'Admin';
        c.querySelector('.keterangan').textContent = bm.keterangan || '-'; c.querySelector('.btn-delete').setAttribute('data-delete-bm', bm.id); bmTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (bkTbody) {
    if (!query) { renderBarangKeluar(); return; }
    const filtered = (db.barang_keluar || []).filter(bk => (bk.nama_barang && bk.nama_barang.toLowerCase().includes(query)) || (bk.tujuan && bk.tujuan.toLowerCase().includes(query)));
    if (filtered.length === 0) { renderEmptyTableState(bkTbody, 7, `Tidak ada barang keluar yang cocok dengan "${query}"`); return; }
    bkTbody.textContent = ''; const tpl = document.getElementById('bkRowTemplate');
    filtered.forEach(bk => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.tanggal').textContent = bk.tanggal;
        c.querySelector('.barang').textContent = bk.nama_barang; c.querySelector('.jumlah').textContent = `-${bk.jumlah} ${bk.satuan || ''}`;
        c.querySelector('.tujuan').textContent = bk.tujuan || '-'; c.querySelector('.petugas').textContent = bk.petugas || 'Admin';
        c.querySelector('.keterangan').textContent = bk.keterangan || '-'; c.querySelector('.btn-delete').setAttribute('data-delete-bk', bk.id); bkTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (opTbody) {
    if (!query) { renderStokOpname(); return; }
    const filtered = (db.stok_opname || []).filter(so => (so.nama_barang && so.nama_barang.toLowerCase().includes(query)) || (so.keterangan && so.keterangan.toLowerCase().includes(query)));
    if (filtered.length === 0) { renderEmptyTableState(opTbody, 6, `Tidak ada audit opname yang cocok dengan "${query}"`); return; }
    opTbody.textContent = ''; const tpl = document.getElementById('opnameRowTemplate');
    filtered.forEach(so => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.tanggal').textContent = so.tanggal;
        c.querySelector('.barang').textContent = so.nama_barang; c.querySelector('.sistem').textContent = `${so.stok_sistem} ${so.satuan || ''}`;
        c.querySelector('.fisik').textContent = `${so.stok_fisik} ${so.satuan || ''}`;
        const diffTd = c.querySelector('.selisih'); diffTd.textContent = `${so.selisih >= 0 ? '+' : ''}${so.selisih} ${so.satuan || ''}`;
        diffTd.className = `font-mono ${so.selisih === 0 ? 'text-success' : (so.selisih < 0 ? 'text-danger' : 'text-info')}`;
        c.querySelector('.keterangan').textContent = so.keterangan || '-'; opTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (minTbody) {
    if (!query) { renderStokMinimum(); return; }
    const filtered = (db.barang || []).filter(b => b.stok <= b.stok_minimum && (b.kode_barang.toLowerCase().includes(query) || b.nama_barang.toLowerCase().includes(query)));
    if (filtered.length === 0) { renderEmptyTableState(minTbody, 7, `Tidak ada barang kritis yang cocok dengan "${query}"`); return; }
    minTbody.textContent = ''; const tpl = document.getElementById('stokMinRowTemplate');
    filtered.forEach(i => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.sku').textContent = i.kode_barang; c.querySelector('.nama').textContent = i.nama_barang;
        c.querySelector('.kategori').textContent = i.kategori; const satEl = c.querySelector('.satuan'); if (satEl) satEl.textContent = i.satuan;
        c.querySelector('.stok').textContent = `${i.stok} ${i.satuan}`;
        c.querySelector('.stok-min').textContent = `${i.stok_minimum} ${i.satuan}`; c.querySelector('.restok').textContent = `+${i.stok_minimum * 2 - i.stok} ${i.satuan}`; minTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (supTbody) {
    if (!query) { renderPemasok(); return; }
    const filtered = (db.pemasok || []).filter(p => p.nama_pemasok.toLowerCase().includes(query) || p.alamat.toLowerCase().includes(query));
    if (filtered.length === 0) { renderEmptyTableState(supTbody, 6, `Tidak ada pemasok yang cocok dengan "${query}"`); return; }
    supTbody.textContent = ''; const tpl = document.getElementById('pemasokRowTemplate');
    filtered.forEach(p => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.nama').textContent = p.nama_pemasok;
        const catEl = c.querySelector('.kategori'); if (catEl) catEl.textContent = p.kategori || 'Umum';
        c.querySelector('.alamat').textContent = p.alamat; c.querySelector('.telepon').textContent = p.telepon; c.querySelector('.email').textContent = p.email;
        c.querySelector('.btn-edit').setAttribute('data-edit-pemasok', p.id); c.querySelector('.btn-delete').setAttribute('data-delete-pemasok', p.id); supTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (empTbody) {
    if (!query) { renderKaryawan(); return; }
    const filtered = (db.karyawan || []).filter(k => k.nama.toLowerCase().includes(query) || k.jabatan.toLowerCase().includes(query));
    if (filtered.length === 0) { renderEmptyTableState(empTbody, 9, `Tidak ada karyawan yang cocok dengan "${query}"`); return; }
    empTbody.textContent = ''; const tpl = document.getElementById('karyawanRowTemplate');
    filtered.forEach(k => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.nama').textContent = k.nama;
        const umurEl = c.querySelector('.umur'); if (umurEl) umurEl.textContent = `${k.umur || 25} thn`;
        const jkEl = c.querySelector('.jk'); if (jkEl) jkEl.textContent = k.jenis_kelamin || 'Laki-laki';
        c.querySelector('.jabatan').textContent = k.jabatan;
        const almEl = c.querySelector('.alamat'); if (almEl) almEl.textContent = k.alamat || '-';
        c.querySelector('.telepon').textContent = k.telepon; c.querySelector('.email').textContent = k.email;
        const masukEl = c.querySelector('.masuk'); if (masukEl) masukEl.textContent = k.tanggal_masuk || '-';
        c.querySelector('.btn-edit').setAttribute('data-edit-karyawan', k.id); c.querySelector('.btn-delete').setAttribute('data-delete-karyawan', k.id); empTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (asetTbody) {
    if (!query) { renderAset(); return; }
    const filtered = (db.aset || []).filter(a => a.nama_aset.toLowerCase().includes(query) || a.kategori.toLowerCase().includes(query));
    if (filtered.length === 0) { renderEmptyTableState(asetTbody, 7, `Tidak ada aset yang cocok dengan "${query}"`); return; }
    asetTbody.textContent = ''; const tpl = document.getElementById('asetRowTemplate');
    filtered.forEach(a => {
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.nama').textContent = a.nama_aset; c.querySelector('.kategori').textContent = a.kategori;
        c.querySelector('.jumlah').textContent = `${a.jumlah} Unit`; c.querySelector('.nilai').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(a.nilai);
        c.querySelector('.tanggal').textContent = a.tanggal_perolehan;
        const ketEl = c.querySelector('.keterangan'); if (ketEl) ketEl.textContent = a.keterangan || '-';
        c.querySelector('.btn-edit').setAttribute('data-edit-aset', a.id); c.querySelector('.btn-delete').setAttribute('data-delete-aset', a.id); asetTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons(); return;
  }

  if (actTbody) {
    if (!query) { renderRecentActivities(db.aktivitas); return; }
    const filtered = (db.aktivitas || []).filter(act => (act.barang && act.barang.toLowerCase().includes(query)) || (act.petugas && act.petugas.toLowerCase().includes(query)));
    if (filtered.length === 0) { renderEmptyTableState(actTbody, 5, `Tidak ada aktivitas yang cocok dengan "${query}"`); return; }
    actTbody.textContent = ''; const tpl = document.getElementById('recentActivityRowTemplate');
    filtered.forEach(act => {
      const isIn = act.jenis === 'Inbound';
      if (tpl) {
        const c = tpl.content.cloneNode(true); c.querySelector('.waktu').textContent = act.waktu;
        const b = c.querySelector('.badge'); b.className = isIn ? 'badge badge-inbound' : 'badge badge-outbound'; b.textContent = isIn ? '↙ Inbound' : '↗ Outbound';
        c.querySelector('.barang').textContent = act.barang; const q = c.querySelector('.kuantitas'); q.className = `font-mono ${isIn ? 'text-info' : 'text-warning'}`;
        q.textContent = act.kuantitas; c.querySelector('.petugas').textContent = act.petugas; actTbody.appendChild(c);
      }
    }); if (window.lucide) lucide.createIcons();
  }
}
