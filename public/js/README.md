# ⚡ Folder `js/` - JavaScript Architecture & Business Logic

Folder ini berisi kode JavaScript modular Vanilla ES6+ yang mengatur logika data, aturan bisnis, dan interaksi antarmuka pengguna tanpa dependensi framework berat.

## Clean Architecture Layers

1. **`models/`**: State awal data dan data dummy persediaan (Barang, Pemasok, Karyawan, Aset).
2. **`services/`**: Business Logic Service layer.
   - `storage.service.js`: Persistence data dengan `localStorage`.
   - `crud.service.js`: Logika operasi Tambah, Edit, dan Hapus entitas.
   - `inventory.service.js`: Aturan transaksi stok (Inbound, Outbound, Opname).
3. **`views/`**: Presentation layer & Event Controller.
   - Menggunakan **Pure JS DOM Manipulation** dan tag HTML `<template>`.
   - Bebas dari string tag HTML mentah di dalam file JS (`innerHTML = '<tr>...'`).
4. **`components/`**: Utility UI Controllers (Toast notifications & SVG Chart renderers).

> **Aturan Strict:** Tidak ada file JS yang boleh melebihi 250 baris kode (Rule 1).
