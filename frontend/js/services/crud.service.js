/* ==========================================================================
   Warehouse App - ENTITY CRUD BUSINESS LOGIC SERVICE
   File: frontend/js/services/crud.service.js
   ========================================================================== */

const CRUDService = {
  // BARANG CRUD
  addBarang(kode_barang, nama_barang, kategori, satuan, stok, stok_minimum) {
    const db = StorageService.getDB();
    if (!kode_barang || !nama_barang) return { success: false, message: 'Kode dan Nama Barang wajib diisi!' };
    if (!db.barang) db.barang = [];
    const newId = db.barang.length > 0 ? Math.max(...db.barang.map(b => b.id)) + 1 : 1;
    db.barang.push({
      id: newId,
      kode_barang: kode_barang.trim(),
      nama_barang: nama_barang.trim(),
      kategori: kategori || 'Bahan Bangunan',
      satuan: satuan || 'unit',
      stok: Number(stok) || 0,
      stok_minimum: Number(stok_minimum) || 5
    });
    StorageService.saveDB(db);
    return { success: true, message: `Barang "${nama_barang}" berhasil ditambahkan!` };
  },

  updateBarang(id, kode_barang, nama_barang, kategori, satuan, stok, stok_minimum) {
    const db = StorageService.getDB();
    const item = db.barang.find(b => b.id === Number(id));
    if (!item) return { success: false, message: 'Barang tidak ditemukan!' };
    item.kode_barang = kode_barang ? kode_barang.trim() : item.kode_barang;
    item.nama_barang = nama_barang ? nama_barang.trim() : item.nama_barang;
    item.kategori = kategori || item.kategori;
    item.satuan = satuan || item.satuan;
    item.stok = Number(stok) ?? item.stok;
    item.stok_minimum = Number(stok_minimum) ?? item.stok_minimum;
    StorageService.saveDB(db);
    return { success: true, message: `Barang "${item.nama_barang}" berhasil diperbarui!` };
  },

  deleteBarang(id) {
    const db = StorageService.getDB();
    if (!db.barang) return { success: false, message: 'Data barang kosong!' };
    db.barang = db.barang.filter(b => b.id !== Number(id));
    StorageService.saveDB(db);
    return { success: true, message: 'Data barang berhasil dihapus!' };
  },

  // PEMASOK CRUD
  addPemasok(nama_pemasok, alamat, telepon, email, kategori) {
    const db = StorageService.getDB();
    if (!nama_pemasok || !nama_pemasok.trim()) return { success: false, message: 'Nama pemasok wajib diisi!' };
    if (!db.pemasok) db.pemasok = [];
    const newId = db.pemasok.length > 0 ? Math.max(...db.pemasok.map(p => p.id)) + 1 : 1;
    db.pemasok.push({
      id: newId,
      nama_pemasok: nama_pemasok.trim(),
      kategori: kategori || 'Umum',
      alamat: alamat ? alamat.trim() : '-',
      telepon: telepon ? telepon.trim() : '-',
      email: email ? email.trim() : '-'
    });
    StorageService.saveDB(db);
    return { success: true, message: `Pemasok "${nama_pemasok}" berhasil ditambahkan!` };
  },

  updatePemasok(id, nama_pemasok, alamat, telepon, email, kategori) {
    const db = StorageService.getDB();
    const p = db.pemasok.find(item => item.id === Number(id));
    if (!p) return { success: false, message: 'Pemasok tidak ditemukan!' };
    p.nama_pemasok = nama_pemasok ? nama_pemasok.trim() : p.nama_pemasok;
    p.kategori = kategori ? kategori.trim() : (p.kategori || 'Umum');
    p.alamat = alamat ? alamat.trim() : p.alamat;
    p.telepon = telepon ? telepon.trim() : p.telepon;
    p.email = email ? email.trim() : p.email;
    StorageService.saveDB(db);
    return { success: true, message: `Pemasok "${p.nama_pemasok}" berhasil diperbarui!` };
  },

  deletePemasok(id) {
    const db = StorageService.getDB();
    if (!db.pemasok) return { success: false, message: 'Data pemasok kosong!' };
    db.pemasok = db.pemasok.filter(p => p.id !== Number(id));
    StorageService.saveDB(db);
    return { success: true, message: 'Data pemasok berhasil dihapus!' };
  },

  // KARYAWAN CRUD
  addKaryawan(nama, jabatan, alamat, telepon, email, umur, jenis_kelamin, tanggal_masuk) {
    const db = StorageService.getDB();
    if (!nama || !nama.trim()) return { success: false, message: 'Nama karyawan wajib diisi!' };
    if (!db.karyawan) db.karyawan = [];
    const newId = db.karyawan.length > 0 ? Math.max(...db.karyawan.map(k => k.id)) + 1 : 1;
    db.karyawan.push({
      id: newId,
      nama: nama.trim(),
      jabatan: jabatan || 'Staf Gudang',
      umur: Number(umur) || 25,
      jenis_kelamin: jenis_kelamin || 'Laki-laki',
      tanggal_masuk: tanggal_masuk || new Date().toISOString().split('T')[0],
      alamat: alamat || '-',
      telepon: telepon || '-',
      email: email || '-'
    });
    StorageService.saveDB(db);
    return { success: true, message: `Karyawan "${nama}" berhasil ditambahkan!` };
  },

  updateKaryawan(id, nama, jabatan, alamat, telepon, email, umur, jenis_kelamin, tanggal_masuk) {
    const db = StorageService.getDB();
    const k = db.karyawan.find(item => item.id === Number(id));
    if (!k) return { success: false, message: 'Karyawan tidak ditemukan!' };
    k.nama = nama ? nama.trim() : k.nama;
    k.jabatan = jabatan ? jabatan.trim() : k.jabatan;
    k.umur = Number(umur) || k.umur || 25;
    k.jenis_kelamin = jenis_kelamin || k.jenis_kelamin || 'Laki-laki';
    k.tanggal_masuk = tanggal_masuk || k.tanggal_masuk || new Date().toISOString().split('T')[0];
    k.alamat = alamat ? alamat.trim() : k.alamat;
    k.telepon = telepon ? telepon.trim() : k.telepon;
    k.email = email ? email.trim() : k.email;
    StorageService.saveDB(db);
    return { success: true, message: `Data Karyawan "${k.nama}" berhasil diperbarui!` };
  },

  deleteKaryawan(id) {
    const db = StorageService.getDB();
    if (!db.karyawan) return { success: false, message: 'Data karyawan kosong!' };
    db.karyawan = db.karyawan.filter(k => k.id !== Number(id));
    StorageService.saveDB(db);
    return { success: true, message: 'Data karyawan berhasil dihapus!' };
  },

  // ASET CRUD
  addAset(nama_aset, kategori, jumlah, nilai, tanggal_perolehan, keterangan) {
    const db = StorageService.getDB();
    if (!nama_aset || !nama_aset.trim()) return { success: false, message: 'Nama aset wajib diisi!' };
    if (!db.aset) db.aset = [];
    const newId = db.aset.length > 0 ? Math.max(...db.aset.map(a => a.id)) + 1 : 1;
    db.aset.push({
      id: newId,
      nama_aset: nama_aset.trim(),
      kategori: kategori || 'Peralatan Gudang',
      jumlah: Number(jumlah) || 1,
      nilai: Number(nilai) || 0,
      tanggal_perolehan: tanggal_perolehan || new Date().toISOString().split('T')[0],
      keterangan: keterangan ? keterangan.trim() : '-'
    });
    StorageService.saveDB(db);
    return { success: true, message: `Aset "${nama_aset}" berhasil ditambahkan!` };
  },

  updateAset(id, nama_aset, kategori, jumlah, nilai, tanggal_perolehan, keterangan) {
    const db = StorageService.getDB();
    const a = db.aset.find(item => item.id === Number(id));
    if (!a) return { success: false, message: 'Aset tidak ditemukan!' };
    a.nama_aset = nama_aset ? nama_aset.trim() : a.nama_aset;
    a.kategori = kategori ? kategori.trim() : a.kategori;
    a.jumlah = Number(jumlah) ?? a.jumlah;
    a.nilai = Number(nilai) ?? a.nilai;
    a.tanggal_perolehan = tanggal_perolehan || a.tanggal_perolehan;
    a.keterangan = keterangan ? keterangan.trim() : (a.keterangan || '-');
    StorageService.saveDB(db);
    return { success: true, message: `Data Aset "${a.nama_aset}" berhasil diperbarui!` };
  },

  deleteAset(id) {
    const db = StorageService.getDB();
    if (!db.aset) return { success: false, message: 'Data aset kosong!' };
    db.aset = db.aset.filter(a => a.id !== Number(id));
    StorageService.saveDB(db);
    return { success: true, message: 'Data aset berhasil dihapus!' };
  },

  deleteBarangMasuk(id) {
    const db = StorageService.getDB();
    if (!db.barang_masuk) return { success: false, message: 'Data transaksi kosong!' };
    db.barang_masuk = db.barang_masuk.filter(bm => bm.id !== Number(id));
    StorageService.saveDB(db);
    return { success: true, message: 'Transaksi barang masuk berhasil dihapus!' };
  },

  deleteBarangKeluar(id) {
    const db = StorageService.getDB();
    if (!db.barang_keluar) return { success: false, message: 'Data transaksi kosong!' };
    db.barang_keluar = db.barang_keluar.filter(bk => bk.id !== Number(id));
    StorageService.saveDB(db);
    return { success: true, message: 'Transaksi barang keluar berhasil dihapus!' };
  }
};
