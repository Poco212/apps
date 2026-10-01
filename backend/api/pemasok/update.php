<?php

require '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $pdo->prepare("
    UPDATE pemasok
    SET
        nama_pemasok = :nama_pemasok,
        kategori = :kategori,
        alamat = :alamat,
        telepon = :telepon,
        email = :email
    WHERE id = :id
");

$result = $stmt->execute([
    ':id' => $data['id'],
    ':nama_pemasok' => trim($data['nama_pemasok']),
    ':kategori' => $data['kategori'],
    ':alamat' => $data['alamat'],
    ':telepon' => $data['telepon'],
    ':email' => $data['email']
]);

echo json_encode([
    'success' => $result,
    'message' => 'Pemasok berhasil diperbarui'
]);