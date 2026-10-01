<?php
require '../../config/database.php';

// Mengambil data JSON dari request body
$data = json_decode(file_get_contents("php://input"), true);

// Validasi dasar untuk memastikan data tidak kosong
if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'Data tidak valid atau kosong.'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO barang
    (kode_barang, nama_barang, kategori, satuan, stok, stok_minimum)
    VALUES
    (:kode_barang, :nama_barang, :kategori, :satuan, :stok, :stok_minimum)
");

$result = $stmt->execute([
    'kode_barang'  => isset($data['kode_barang']) ? trim($data['kode_barang']) : null,
    'nama_barang'  => isset($data['nama_barang']) ? trim($data['nama_barang']) : null,
    'kategori'     => $data['kategori'] ?? null,
    'satuan'       => $data['satuan'] ?? null,
    'stok'         => $data['stok'] ?? 0,
    'stok_minimum' => $data['stok_minimum'] ?? 0
]);

// Respons dinamis berdasarkan hasil eksekusi database
if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Barang berhasil ditambahkan.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menambahkan barang ke database.'
    ]);
}
