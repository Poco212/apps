/* ==========================================================================
   Warehouse App - INVENTORY BUSINESS LOGIC SERVICE
   File: frontend/js/services/inventory.service.js
   ========================================================================== */

const InventoryService = {
  // Record Inbound Transaction (+)
  processInbound(itemId, qty, supplierId, notes, operatorName, dateStr) {
    const db = StorageService.getDB();
    const item = db.barang.find(b => b.id === Number(itemId) || b.kode_barang === itemId);
    if (!item) return { success: false, message: 'Barang tidak ditemukan dalam database!' };

    const numQty = Number(qty);
    if (isNaN(numQty) || numQty <= 0) return { success: false, message: 'Jumlah barang masuk harus lebih dari 0!' };

    item.stok += numQty;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalDateStr = dateStr || now.toISOString().substring(0, 10);
    const supplier = db.pemasok.find(p => p.id === Number(supplierId)) || db.pemasok[0];

    if (!db.barang_masuk) db.barang_masuk = [];
    db.barang_masuk.unshift({
      id: Date.now(),
      tanggal: finalDateStr,
      id_barang: item.id,
      nama_barang: item.nama_barang,
      jumlah: numQty,
      satuan: item.satuan,
      id_pemasok: supplier ? supplier.id : 1,
      nama_pemasok: supplier ? supplier.nama_pemasok : 'Umum',
      id_user: 1,
      petugas: operatorName || 'Budi Santoso',
      keterangan: notes || 'Restok barang masuk'
    });

    db.aktivitas.unshift({
      id: Date.now(),
      waktu: timeStr,
      timestamp: now.toISOString(),
      jenis: 'Inbound',
      barang: item.nama_barang,
      kuantitas: `+${numQty} ${item.satuan}`,
      petugas: operatorName || 'Operator Gudang'
    });

    StorageService.saveDB(db);
    return { success: true, message: `Berhasil menambah ${numQty} ${item.satuan} ${item.nama_barang}` };
  },

  // Record Outbound Transaction (-)
  processOutbound(itemId, qty, destination, notes, operatorName, dateStr) {
    const db = StorageService.getDB();
    const item = db.barang.find(b => b.id === Number(itemId) || b.kode_barang === itemId);
    if (!item) return { success: false, message: 'Barang tidak ditemukan dalam database!' };

    const numQty = Number(qty);
    if (isNaN(numQty) || numQty <= 0) return { success: false, message: 'Jumlah barang keluar harus lebih dari 0!' };
    if (item.stok < numQty) {
      return { success: false, message: `Stok tidak mencukupi! Stok saat ini: ${item.stok} ${item.satuan}, diminta: ${numQty} ${item.satuan}` };
    }

    item.stok -= numQty;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalDateStr = dateStr || now.toISOString().substring(0, 10);

    if (!db.barang_keluar) db.barang_keluar = [];
    db.barang_keluar.unshift({
      id: Date.now(),
      tanggal: finalDateStr,
      id_barang: item.id,
      nama_barang: item.nama_barang,
      jumlah: numQty,
      satuan: item.satuan,
      id_user: 1,
      petugas: operatorName || 'Budi Santoso',
      tujuan: destination || 'Proyek Cabang',
      keterangan: notes || 'Pengeluaran persediaan'
    });

    db.aktivitas.unshift({
      id: Date.now(),
      waktu: timeStr,
      timestamp: now.toISOString(),
      jenis: 'Outbound',
      barang: item.nama_barang,
      kuantitas: `-${numQty} ${item.satuan}`,
      petugas: operatorName || 'Operator Gudang'
    });

    StorageService.saveDB(db);
    return { success: true, message: `Berhasil mengeluarkan ${numQty} ${item.satuan} ${item.nama_barang}` };
  },

  // Delegated Entity CRUD Methods
  addBarang: (...args) => CRUDService.addBarang(...args),
  updateBarang: (...args) => CRUDService.updateBarang(...args),
  deleteBarang: (...args) => CRUDService.deleteBarang(...args),

  addPemasok: (...args) => CRUDService.addPemasok(...args),
  updatePemasok: (...args) => CRUDService.updatePemasok(...args),
  deletePemasok: (...args) => CRUDService.deletePemasok(...args),

  addKaryawan: (...args) => CRUDService.addKaryawan(...args),
  updateKaryawan: (...args) => CRUDService.updateKaryawan(...args),
  deleteKaryawan: (...args) => CRUDService.deleteKaryawan(...args),

  addAset: (...args) => CRUDService.addAset(...args),
  updateAset: (...args) => CRUDService.updateAset(...args),
  deleteAset: (...args) => CRUDService.deleteAset(...args),

  deleteBarangMasuk: (...args) => CRUDService.deleteBarangMasuk(...args),
  deleteBarangKeluar: (...args) => CRUDService.deleteBarangKeluar(...args),

  // Record Stock Opname Audit
  processStokOpname(itemId, physicalQty, notes, dateStr, operatorName) {
    const db = StorageService.getDB();
    const item = db.barang.find(b => b.id === Number(itemId));
    if (!item) return { success: false, message: 'Barang tidak ditemukan!' };

    const newStock = Number(physicalQty);
    const diff = newStock - item.stok;
    const oldStock = item.stok;
    item.stok = newStock;
    const now = new Date();
    const finalDateStr = dateStr || now.toISOString().substring(0, 10);

    if (!db.stok_opname) db.stok_opname = [];
    db.stok_opname.unshift({
      id: Date.now(),
      tanggal: finalDateStr,
      id_barang: item.id,
      nama_barang: item.nama_barang,
      stok_sistem: oldStock,
      stok_fisik: newStock,
      selisih: diff,
      satuan: item.satuan,
      petugas: operatorName || 'Auditor Gudang',
      keterangan: notes || (diff === 0 ? 'Stok Sesuai' : `Selisih ${diff >= 0 ? '+' : ''}${diff}`)
    });

    db.aktivitas.unshift({
      id: Date.now(),
      waktu: 'Audit Opname',
      timestamp: now.toISOString(),
      jenis: diff >= 0 ? 'Inbound' : 'Outbound',
      barang: `${item.nama_barang} (Opname)`,
      kuantitas: `${diff >= 0 ? '+' : ''}${diff} ${item.satuan}`,
      petugas: operatorName || 'Auditor Gudang'
    });

    StorageService.saveDB(db);
    return { success: true, message: `Audit Opname selesai: Stok ${item.nama_barang} diubah dari ${oldStock} ke ${newStock} ${item.satuan}` };
  }
};
