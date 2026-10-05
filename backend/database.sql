CREATE DATABASE warehouse_db;
USE warehouse_db;

-- Tabel Barang
CREATE TABLE kategori_barang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_barang VARCHAR(50) NOT NULL,
    nama_barang VARCHAR(255) NOT NULL,
    kategori VARCHAR(100),
    satuan VARCHAR(50),
    stok INT DEFAULT 0,
    stok_minimum INT DEFAULT 5
);

-- Tabel Pemasok
CREATE TABLE pemasok (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pemasok VARCHAR(255) NOT NULL,
    kategori VARCHAR(100),
    alamat TEXT,
    telepon VARCHAR(50),
    email VARCHAR(100)
);

-- Tabel Karyawan
CREATE TABLE karyawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    jabatan VARCHAR(100),
    umur INT,
    jenis_kelamin VARCHAR(20),
    tanggal_masuk DATE,
    alamat TEXT,
    telepon VARCHAR(50),
    email VARCHAR(100)
);

-- Tabel Aset
CREATE TABLE aset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_aset VARCHAR(255) NOT NULL,
    kategori VARCHAR(100),
    jumlah INT DEFAULT 1,
    nilai DECIMAL(15,2) DEFAULT 0,
    tanggal_perolehan DATE,
    keterangan TEXT
);

-- tabel barang masuk
CREATE TABLE barang_masuk (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    id_barang INT NOT NULL,
    jumlah INT NOT NULL,
    id_pemasok INT,
    id_user INT,
    petugas VARCHAR(100),
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_barang) REFERENCES barang(id),
    FOREIGN KEY (id_pemasok) REFERENCES pemasok(id)
);

-- tabel barang keluar
CREATE TABLE barang_keluar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    id_barang INT NOT NULL,
    jumlah INT NOT NULL,
    id_user INT,
    petugas VARCHAR(100),
    tujuan VARCHAR(255),
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_barang) REFERENCES barang(id)
);

-- tabel stock opname
CREATE TABLE stok_opname (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    id_barang INT NOT NULL,
    stok_sistem INT NOT NULL,
    stok_fisik INT NOT NULL,
    selisih INT NOT NULL,
    petugas VARCHAR(100),
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_barang) REFERENCES barang(id)
);

-- tabel aktivitas
CREATE TABLE aktivitas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    waktu VARCHAR(20),
    timestamp_log DATETIME,
    jenis VARCHAR(50),
    barang VARCHAR(255),
    kuantitas VARCHAR(100),
    petugas VARCHAR(100)
);