# 🖥️ Folder `js/views/` - Presentation Controllers & Pure DOM Rendering

Folder ini merupakan **Presentation Layer** yang bertugas menangkap aksi pengguna (*event listeners*), memanggil Service Layer, dan meng-update elemen DOM pada layar.

## Principles & Practices

1. **Pure JS DOM Manipulation**: Seluruh rendering baris tabel menggunakan fitur native HTML `<template>` (`template.content.cloneNode(true)`) dan property DOM (`textContent`, `setAttribute`). Tidak ada string tag HTML mentah (`innerHTML = '<tr>...'`).
2. **Clean Separation**: File JavaScript hanya memproses logika dan data DOM, sedangkan struktur markup visual sepenuhnya milik file `.html`.

## View Modules

- **`tables.view.js`**: Renderer data tabel (Katalog Barang, Barang Masuk, Barang Keluar, Stok Minimum, Pemasok, Karyawan, Aset).
- **`modals.view.js`**: Buka/tutup dialog modal, penyiapan dropdown, dan penanganan submit form Tambah/Edit.
- **`dashboard.view.js`**: Controller utama halaman dashboard, notifikasi, pencarian global, dan event delegation tombol aksi.
- **`login.view.js`**: Controller autentikasi halaman login.
