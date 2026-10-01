<?php

require '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['nama_pemasok']) ||
    trim($data['nama_pemasok']) == ''
) {
    echo json_encode([
        "success" => false,
        "message" => "Nama pemasok wajib diisi"
    ]);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO pemasok
    (
        nama_pemasok,
        kategori,
        alamat,
        telepon,
        email
    )
    VALUES
    (
        :nama_pemasok,
        :kategori,
        :alamat,
        :telepon,
        :email
    )
");

$result = $stmt->execute([
    ':nama_pemasok' => trim($data['nama_pemasok']),
    ':kategori' => $data['kategori'] ?? 'Umum',
    ':alamat' => $data['alamat'] ?? '-',
    ':telepon' => $data['telepon'] ?? '-',
    ':email' => $data['email'] ?? '-'
]);

echo json_encode([
    'success' => $result,
    'message' => 'Pemasok berhasil ditambahkan'
]);