# ⚙️ Folder `js/services/` - Business Logic & Data Layer

Folder ini bertindak sebagai **Service Layer** dalam Clean Architecture. Seluruh fungsi di sini murni mengolah data dan aturan bisnis tanpa memanipulasi DOM visual.

## Service Modules

- **`storage.service.js`**: Menangani sinkronisasi baca/tulis state database aplikasi ke `localStorage` browser.
- **`crud.service.js`**: Menangani logika validasi penambahan (Create), pembaruan (Update), dan penghapusan (Delete) untuk entitas Barang, Pemasok, Karyawan, Aset, dan Transaksi.
- **`inventory.service.js`**: Menangani aturan transaksi stok penerimaan (Inbound), pengeluaran (Outbound), pengecekan kecukupan stok, dan audit Stok Opname.
