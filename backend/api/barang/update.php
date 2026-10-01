<?php
require '../../config/database.php';

// Mengambil data JSON dari request body
$data = json_decode(file_get_contents("php://input"), true);

// Validasi jika JSON kosong atau ID barang tidak dikirim
if (!$data || !isset($data['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Data tidak valid atau ID barang tidak ditemukan.'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    UPDATE barang
    SET
        kode_barang = :kode_barang,
        nama_barang = :nama_barang,
        kategori = :kategori,
        satuan = :satuan,
        stok = :stok,
        stok_minimum = :stok_minimum
    WHERE id = :id
");

$result = $stmt->execute([
    'id'           => $data['id'],
    'kode_barang'  => isset($data['kode_barang']) ? trim($data['kode_barang']) : null,
    'nama_barang'  => isset($data['nama_barang']) ? trim($data['nama_barang']) : null,
    'kategori'     => $data['kategori'] ?? null,
    'satuan'       => $data['satuan'] ?? null,
    'stok'         => $data['stok'] ?? 0,
    'stok_minimum' => $data['stok_minimum'] ?? 0
]);

// Mengecek apakah query berhasil dieksekusi
if ($result) {
    // Mengecek apakah ada baris data yang benar-benar berubah di database
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Barang berhasil diperbarui.'
        ]);
    } else {
        // Terjadi jika ID tidak ditemukan, ATAU data baru yang dikirim sama persis dengan data lama
        echo json_encode([
            'success' => true,
            'message' => 'Tidak ada perubahan data atau ID tidak ditemukan.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal memperbarui data barang.'
    ]);
}