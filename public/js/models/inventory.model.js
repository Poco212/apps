/* ==========================================================================
   Warehouse App - DATA MODELS & INITIAL SEED DATA
   File: frontend/js/models/inventory.model.js
   ========================================================================== */

const InventoryModel = {
  categoryIcons: {
    'Bahan Bangunan': 'box',
    'Cat & Coating': 'droplet',
    'Elektrikal': 'zap',
    'Kayu & Papan': 'layers',
    'Besi & Baja': 'shield',
    'Plumbing': 'pipette',
    'Hardware': 'wrench'
  },

  defaultData: {
    barang: [
      { id: 1, kode_barang: 'BAR-001', nama_barang: 'Paku 2"', kategori: 'Bahan Bangunan', satuan: 'kg', stok: 12, stok_minimum: 10 },
      { id: 2, kode_barang: 'BAR-002', nama_barang: 'Semen Gresik', kategori: 'Bahan Bangunan', satuan: 'sak', stok: 4, stok_minimum: 15 },
      { id: 3, kode_barang: 'BAR-003', nama_barang: 'Cat Dulux Putih 5kg', kategori: 'Cat & Coating', satuan: 'klg', stok: 2, stok_minimum: 10 },
      { id: 4, kode_barang: 'BAR-004', nama_barang: 'Kabel NYM 2x1.5mm', kategori: 'Elektrikal', satuan: 'roll', stok: 5, stok_minimum: 8 },
      { id: 5, kode_barang: 'BAR-005', nama_barang: 'Triplek 12mm', kategori: 'Kayu & Papan', satuan: 'lbr', stok: 150, stok_minimum: 30 },
      { id: 6, kode_barang: 'BAR-006', nama_barang: 'Besi Beton 10mm', kategori: 'Besi & Baja', satuan: 'btg', stok: 210, stok_minimum: 50 },
      { id: 7, kode_barang: 'BAR-007', nama_barang: 'Pipa PVC 2"', kategori: 'Plumbing', satuan: 'btg', stok: 85, stok_minimum: 25 },
      { id: 8, kode_barang: 'BAR-008', nama_barang: 'Baut Roofing 5cm', kategori: 'Hardware', satuan: 'box', stok: 45, stok_minimum: 15 }
    ],
    pemasok: [
      { id: 1, nama_pemasok: 'PT Bangunan Jaya Utama', kategori: 'Bahan Bangunan', alamat: 'Jl. Industri No. 12, Jakarta', telepon: '021-5551234', email: 'sales@bangunanjaya.co.id' },
      { id: 2, nama_pemasok: 'CV Cat Nusantara', kategori: 'Cat & Coating', alamat: 'Jl. Merdeka No. 45, Surabaya', telepon: '031-7778899', email: 'info@catnusantara.com' },
      { id: 3, nama_pemasok: 'PT Sinar Elektrik Mandiri', kategori: 'Elektrikal', alamat: 'Gedung Kencana L3, Bandung', telepon: '022-4445566', email: 'order@sinarelektrik.id' }
    ],
    karyawan: [
      { id: 1, nama: 'Budi Santoso', umur: 32, jenis_kelamin: 'Laki-laki', jabatan: 'Head Operator Gudang', tanggal_masuk: '2021-03-15', alamat: 'Jl. Mawar No. 8', telepon: '08123456789', email: 'budi@warehouse.pro' },
      { id: 2, nama: 'Andi Kurniawan', umur: 28, jenis_kelamin: 'Laki-laki', jabatan: 'Staf Inbound & Outbound', tanggal_masuk: '2022-06-01', alamat: 'Jl. Melati No. 14', telepon: '08234567890', email: 'andi@warehouse.pro' },
      { id: 3, nama: 'Citra Wijaya', umur: 26, jenis_kelamin: 'Perempuan', jabatan: 'Admin Inventaris', tanggal_masuk: '2023-01-10', alamat: 'Jl. Anggrek No. 22', telepon: '08345678901', email: 'citra@warehouse.pro' }
    ],
    aset: [
      { id: 1, nama_aset: 'Forklift Toyota 3-Ton', kategori: 'Kendaraan Gudang', jumlah: 2, nilai: 250000000, tanggal_perolehan: '2023-05-10', keterangan: 'Kondisi prima, rutin service' },
      { id: 2, nama_aset: 'Hand Pallet Truck 2-Ton', kategori: 'Peralatan Angkut', jumlah: 5, nilai: 15000000, tanggal_perolehan: '2024-01-15', keterangan: 'Digunakan di Zona A & B' },
      { id: 3, nama_aset: 'Barcode Scanner Wireless', kategori: 'Hardware IT', jumlah: 8, nilai: 12000000, tanggal_perolehan: '2024-03-20', keterangan: 'Operational tim receiving' }
    ],
    stok_opname: [
      { id: 1, tanggal: '2026-07-25', id_barang: 1, nama_barang: 'Paku 2"', stok_sistem: 15, stok_fisik: 12, selisih: -3, satuan: 'kg', petugas: 'Budi Santoso', keterangan: 'Selisih susut fisik' },
      { id: 2, tanggal: '2026-07-25', id_barang: 5, nama_barang: 'Triplek 12mm', stok_sistem: 150, stok_fisik: 150, selisih: 0, satuan: 'lbr', petugas: 'Citra Wijaya', keterangan: 'Stok Sesuai' }
    ],
    barang_masuk: [
      { id: 1, tanggal: '2026-07-24', id_barang: 1, nama_barang: 'Paku 2"', jumlah: 9, satuan: 'kg', id_pemasok: 1, nama_pemasok: 'PT Bangunan Jaya Utama', id_user: 1, petugas: 'Budi Santoso', keterangan: 'Restok rutin persediaan' },
      { id: 2, tanggal: '2026-07-24', id_barang: 8, nama_barang: 'Baut Roofing 5cm', jumlah: 3, satuan: 'box', id_pemasok: 1, nama_pemasok: 'PT Bangunan Jaya Utama', id_user: 1, petugas: 'Budi Santoso', keterangan: 'Pengiriman tambahan' },
      { id: 3, tanggal: '2026-07-24', id_barang: 5, nama_barang: 'Triplek 12mm', jumlah: 50, satuan: 'lbr', id_pemasok: 2, nama_pemasok: 'CV Cat Nusantara', id_user: 1, petugas: 'Budi Santoso', keterangan: 'Restok awal bulan' }
    ],
    barang_keluar: [
      { id: 1, tanggal: '2026-07-24', id_barang: 1, nama_barang: 'Paku 2"', jumlah: 3, satuan: 'kg', id_user: 1, petugas: 'Budi Santoso', tujuan: 'Proyek Ritel Cabang 4', keterangan: 'Permintaan toko' },
      { id: 2, tanggal: '2026-07-24', id_barang: 1, nama_barang: 'Paku 2"', jumlah: 5, satuan: 'kg', id_user: 2, petugas: 'Andi Kurniawan', tujuan: 'Proyek Gudang B', keterangan: 'Perbaikan rak' },
      { id: 3, tanggal: '2026-07-24', id_barang: 2, nama_barang: 'Semen Gresik', jumlah: 20, satuan: 'sak', id_user: 3, petugas: 'Citra Wijaya', tujuan: 'Vendor Konstruksi', keterangan: 'Pengeluaran proyek' }
    ],
    aktivitas: [
      { id: 1, waktu: '09:44 PM', timestamp: '2026-07-24T21:44:00', jenis: 'Inbound', barang: 'Paku 2"', kuantitas: '+9 kg', petugas: 'Budi S.' },
      { id: 2, waktu: '08:39 PM', timestamp: '2026-07-24T20:39:00', jenis: 'Outbound', barang: 'Paku 2"', kuantitas: '-3 kg', petugas: 'Budi S.' },
      { id: 3, waktu: '08:39 PM', timestamp: '2026-07-24T20:39:00', jenis: 'Inbound', barang: 'Baut Roofing 5cm', kuantitas: '+3 box', petugas: 'Budi S.' }
    ],
    capacityZones: [
      { name: 'Zona A - Bahan Bangunan', percent: 78, used: '3,120 / 4,000 m²' },
      { name: 'Zona B - Elektrikal & Hardware', percent: 45, used: '1,800 / 4,000 m²' },
      { name: 'Zona C - Kayu & Cat', percent: 85, used: '3,400 / 4,000 m²' }
    ],
    chartMutation7Days: [
      { day: 'M', inbound: 45, outbound: 28 },
      { day: 'T', inbound: 62, outbound: 22 },
      { day: 'W', inbound: 38, outbound: 55 },
      { day: 'T', inbound: 70, outbound: 42 },
      { day: 'F', inbound: 25, outbound: 68 },
      { day: 'S', inbound: 52, outbound: 18 },
      { day: 'S', inbound: 40, outbound: 38 }
    ],
    chartMutation30Days: [
      { day: 'Minggu 1', inbound: 240, outbound: 180 },
      { day: 'Minggu 2', inbound: 310, outbound: 290 },
      { day: 'Minggu 3', inbound: 195, outbound: 210 },
      { day: 'Minggu 4', inbound: 340, outbound: 260 }
    ]
  }
};
