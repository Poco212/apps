# 🎨 Folder `css/` - Styling & Design Token System

Folder ini berisi seluruh file stylesheet Vanilla CSS yang mengatur tata letak, warna, tipografi, dan komponen visual sistem **Warehouse App**.

## Structure & Responsibilities

- **`tokens.css`**: Definisi CSS Custom Properties (Design Tokens) seperti variabel warna HSL/RGB, ukuran font, radius sudut (24px), dan bayangan.
- **`reset.css`**: Standardisasi CSS reset & box-sizing normalize.
- **`components/`**:
  - `buttons.css`: Styling tombol utama, pill buttons, dan action buttons (`btn-ghost-primary`, `btn-ghost-danger`).
  - `cards.css`: Styling container kartu, glassmorphism, dan border halus.
  - `tables.css`: Styling tabel persediaan, header font, zebra striping, dan status badges.
  - `forms.css`: Styling input field, select dropdown, dan label.
  - `modals.css`: Styling dialog modal overlay dan card modal popup.
  - `toast.css`: Styling float popup notifikasi toast.
  - `charts.css`: Styling widget bar chart mutasi dan indikator kapasitas gudang.
- **`pages/`**:
  - `dashboard.css`: Master import stylesheet dan tata letak grid utama aplikasi.
  - `header.css`: Styling top bar header, pencarian global, dan profil user.
  - `sidebar.css`: Styling navigasi sidebar kiri dan submenu persediaan.
  - `login.css`: Styling halaman autentikasi login.

> **Aturan Strict:** Tidak ada file CSS yang boleh melebihi 250 baris kode (Rule 1).
