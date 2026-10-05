/* ==========================================================================
   LOGITRACK PRO WMS - MODALS & FORM HANDLERS VIEW CONTROLLER
   File: frontend/js/views/modals.view.js
   ========================================================================== */

function openModal(modalId) {
  populateDropdowns();
  const todayStr = new Date().toISOString().substring(0, 10);
  const inDate = document.getElementById('inboundDateInput'); if (inDate && !inDate.value) inDate.value = todayStr;
  const outDate = document.getElementById('outboundDateInput'); if (outDate && !outDate.value) outDate.value = todayStr;
  const opDate = document.getElementById('opnameDateInput'); if (opDate && !opDate.value) opDate.value = todayStr;

  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function setTodayDate(inputId) {
  const el = document.getElementById(inputId);
  if (el) el.value = new Date().toISOString().substring(0, 10);
}

function populateDropdowns() {
  const db = StorageService.getDB();
  const inSel = document.getElementById('inboundItemSelect');
  const outSel = document.getElementById('outboundItemSelect');
  const opSel = document.getElementById('opnameItemSelect');
  const supSel = document.getElementById('inboundSupplierSelect');

  const optionsHTML = (db.barang || []).map(b => `<option value="${b.id}">${b.kode_barang} - ${b.nama_barang} (Stok: ${b.stok} ${b.satuan})</option>`).join('');
  if (inSel) inSel.innerHTML = optionsHTML;
  if (outSel) outSel.innerHTML = optionsHTML;
  if (opSel) opSel.innerHTML = optionsHTML;
  if (supSel && db.pemasok) supSel.innerHTML = db.pemasok.map(p => `<option value="${p.id}">${p.nama_pemasok}</option>`).join('');
}

function openEditBarangModal(id) {
  const db = StorageService.getDB(); const item = db.barang.find(b => b.id === Number(id)); if (!item) return;
  document.getElementById('barangIdInput').value = item.id;
  document.getElementById('barangKodeInput').value = item.kode_barang;
  document.getElementById('barangNamaInput').value = item.nama_barang;
  document.getElementById('barangKategoriInput').value = item.kategori;
  document.getElementById('barangSatuanInput').value = item.satuan;
  document.getElementById('barangStokInput').value = item.stok;
  document.getElementById('barangStokMinInput').value = item.stok_minimum;
  document.getElementById('barangModalTitle').textContent = 'Edit Data Barang';
  document.getElementById('barangSubmitBtn').textContent = 'Update Barang';
  openModal('barangModal');
}

function openEditPemasokModal(id) {
  const db = StorageService.getDB(); const item = db.pemasok.find(p => p.id === Number(id)); if (!item) return;
  document.getElementById('pemasokIdInput').value = item.id;
  document.getElementById('pemasokNamaInput').value = item.nama_pemasok;
  if (document.getElementById('pemasokKatInput')) document.getElementById('pemasokKatInput').value = item.kategori || 'Umum';
  document.getElementById('pemasokAlamatInput').value = item.alamat;
  document.getElementById('pemasokTeleponInput').value = item.telepon;
  document.getElementById('pemasokEmailInput').value = item.email;
  document.getElementById('pemasokModalTitle').textContent = 'Edit Data Pemasok';
  document.getElementById('pemasokSubmitBtn').textContent = 'Update Pemasok';
  openModal('pemasokModal');
}

function openEditKaryawanModal(id) {
  const db = StorageService.getDB(); const item = db.karyawan.find(k => k.id === Number(id)); if (!item) return;
  document.getElementById('karyawanIdInput').value = item.id;
  document.getElementById('karyawanNamaInput').value = item.nama;
  if (document.getElementById('karyawanUmurInput')) document.getElementById('karyawanUmurInput').value = item.umur || 25;
  if (document.getElementById('karyawanJkSelect')) document.getElementById('karyawanJkSelect').value = item.jenis_kelamin || 'Laki-laki';
  document.getElementById('karyawanJabatanInput').value = item.jabatan;
  if (document.getElementById('karyawanMasukInput')) document.getElementById('karyawanMasukInput').value = item.tanggal_masuk || '';
  document.getElementById('karyawanAlamatInput').value = item.alamat;
  document.getElementById('karyawanTeleponInput').value = item.telepon;
  document.getElementById('karyawanEmailInput').value = item.email;
  document.getElementById('karyawanModalTitle').textContent = 'Edit Data Karyawan';
  document.getElementById('karyawanSubmitBtn').textContent = 'Update Karyawan';
  openModal('karyawanModal');
}

function openEditAsetModal(id) {
  const db = StorageService.getDB(); const item = db.aset.find(a => a.id === Number(id)); if (!item) return;
  document.getElementById('asetIdInput').value = item.id;
  document.getElementById('asetNamaInput').value = item.nama_aset;
  const katEl = document.getElementById('asetKategoriSelect') || document.getElementById('asetKategoriInput');
  if (katEl) katEl.value = item.kategori;
  document.getElementById('asetJumlahInput').value = item.jumlah;
  document.getElementById('asetNilaiInput').value = item.nilai;
  document.getElementById('asetTanggalInput').value = item.tanggal_perolehan;
  if (document.getElementById('asetKetInput')) document.getElementById('asetKetInput').value = item.keterangan || '';
  document.getElementById('asetModalTitle').textContent = 'Edit Data Aset';
  document.getElementById('asetSubmitBtn').textContent = 'Update Aset';
  openModal('asetModal');
}

function handleBarangSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('barangIdInput').value;
  const kode = document.getElementById('barangKodeInput').value;
  const nama = document.getElementById('barangNamaInput').value;
  const kat = document.getElementById('barangKategoriInput').value;
  const sat = document.getElementById('barangSatuanInput').value;
  const stok = document.getElementById('barangStokInput').value;
  const min = document.getElementById('barangStokMinInput').value;
  const res = id ? InventoryService.updateBarang(id, kode, nama, kat, sat, stok, min) : InventoryService.addBarang(kode, nama, kat, sat, stok, min);
  if (res.success) { closeModal('barangModal'); document.getElementById('barangForm').reset(); document.getElementById('barangIdInput').value = ''; renderKatalogBarang(); renderDashboardOverview(); ToastComponent.show(res.message, 'success'); }
  else ToastComponent.show(res.message, 'danger');
}

function handleInboundSubmit(e) {
  e.preventDefault();
  const item = document.getElementById('inboundItemSelect').value;
  const supplierId = document.getElementById('inboundSupplierSelect') ? document.getElementById('inboundSupplierSelect').value : null;
  const qty = document.getElementById('inboundQtyInput').value;
  const dateStr = document.getElementById('inboundDateInput') ? document.getElementById('inboundDateInput').value : null;
  const notes = document.getElementById('inboundKetInput') ? document.getElementById('inboundKetInput').value : null;
  const res = InventoryService.processInbound(item, qty, supplierId, notes, 'Budi S.', dateStr);
  if (res.success) { closeModal('inboundModal'); renderDashboardOverview(); renderBarangMasuk(); ToastComponent.show(res.message, 'success'); }
}

function handleOutboundSubmit(e) {
  e.preventDefault();
  const item = document.getElementById('outboundItemSelect').value;
  const qty = document.getElementById('outboundQtyInput').value;
  const destination = document.getElementById('outboundTujuanInput') ? document.getElementById('outboundTujuanInput').value : 'Proyek Cabang';
  const dateStr = document.getElementById('outboundDateInput') ? document.getElementById('outboundDateInput').value : null;
  const notes = document.getElementById('outboundKetInput') ? document.getElementById('outboundKetInput').value : null;
  const res = InventoryService.processOutbound(item, qty, destination, notes, 'Budi S.', dateStr);
  if (res.success) { closeModal('outboundModal'); renderDashboardOverview(); renderBarangKeluar(); ToastComponent.show(res.message, 'success'); }
  else ToastComponent.show(res.message, 'danger');
}

function handlePemasokSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('pemasokIdInput').value;
  const nama = document.getElementById('pemasokNamaInput').value;
  const kat = document.getElementById('pemasokKatInput') ? document.getElementById('pemasokKatInput').value : 'Umum';
  const alamat = document.getElementById('pemasokAlamatInput').value;
  const telp = document.getElementById('pemasokTeleponInput').value;
  const email = document.getElementById('pemasokEmailInput').value;
  const res = id ? InventoryService.updatePemasok(id, nama, alamat, telp, email, kat) : InventoryService.addPemasok(nama, alamat, telp, email, kat);
  if (res.success) { closeModal('pemasokModal'); document.getElementById('pemasokForm').reset(); document.getElementById('pemasokIdInput').value = ''; renderPemasok(); ToastComponent.show(res.message, 'success'); }
  else ToastComponent.show(res.message, 'danger');
}

function handleKaryawanSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('karyawanIdInput').value;
  const nama = document.getElementById('karyawanNamaInput').value;
  const umur = document.getElementById('karyawanUmurInput') ? document.getElementById('karyawanUmurInput').value : 25;
  const jk = document.getElementById('karyawanJkSelect') ? document.getElementById('karyawanJkSelect').value : 'Laki-laki';
  const jab = document.getElementById('karyawanJabatanInput').value;
  const masuk = document.getElementById('karyawanMasukInput') ? document.getElementById('karyawanMasukInput').value : '';
  const alm = document.getElementById('karyawanAlamatInput').value;
  const telp = document.getElementById('karyawanTeleponInput').value;
  const email = document.getElementById('karyawanEmailInput').value;
  const res = id ? InventoryService.updateKaryawan(id, nama, jab, alm, telp, email, umur, jk, masuk) : InventoryService.addKaryawan(nama, jab, alm, telp, email, umur, jk, masuk);
  if (res.success) { closeModal('karyawanModal'); document.getElementById('karyawanForm').reset(); document.getElementById('karyawanIdInput').value = ''; renderKaryawan(); ToastComponent.show(res.message, 'success'); }
  else ToastComponent.show(res.message, 'danger');
}

function handleAsetSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('asetIdInput').value;
  const nama = document.getElementById('asetNamaInput').value;
  const katEl = document.getElementById('asetKategoriSelect') || document.getElementById('asetKategoriInput');
  const kat = katEl ? katEl.value : '';
  const jml = document.getElementById('asetJumlahInput').value;
  const nil = document.getElementById('asetNilaiInput').value;
  const tgl = document.getElementById('asetTanggalInput').value;
  const ket = document.getElementById('asetKetInput') ? document.getElementById('asetKetInput').value : '';
  const res = id ? InventoryService.updateAset(id, nama, kat, jml, nil, tgl, ket) : InventoryService.addAset(nama, kat, jml, nil, tgl, ket);
  if (res.success) { closeModal('asetModal'); document.getElementById('asetForm').reset(); document.getElementById('asetIdInput').value = ''; renderAset(); ToastComponent.show(res.message, 'success'); }
  else ToastComponent.show(res.message, 'danger');
}

function handleOpnameSubmit(e) {
  e.preventDefault();
  const item = document.getElementById('opnameItemSelect').value;
  const physQty = document.getElementById('opnameQtyInput').value;
  const tgl = document.getElementById('opnameDateInput') ? document.getElementById('opnameDateInput').value : null;
  const ket = document.getElementById('opnameKetInput') ? document.getElementById('opnameKetInput').value : null;
  const res = InventoryService.processStokOpname(item, physQty, ket, tgl, 'Budi S.');
  if (res.success) {
    closeModal('opnameModal');
    if (typeof renderStokOpname === 'function') renderStokOpname();
    if (typeof renderKatalogBarang === 'function') renderKatalogBarang();
    renderDashboardOverview();
    ToastComponent.show(res.message, 'success');
  } else ToastComponent.show(res.message, 'danger');
}
