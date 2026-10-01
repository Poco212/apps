<?php
require '../../config/database.php';
header('Content-Type: application/json');

// Ambil input dan pastikan parameter ID tersedia
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID barang wajib diisi.']);
    exit;
}

// Persiapkan query delete
$stmt = $pdo->prepare("DELETE FROM barang WHERE id = :id");

// Eksekusi query
$result = $stmt->execute([
    'id' => $data['id']
]);

// Cek status query dan jumlah baris yang terhapus
if ($result) {
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Barang berhasil dihapus.']);
    } else {
        // Terjadi jika ID yang dikirim tidak ada di database
        echo json_encode(['success' => false, 'message' => 'Data gagal dihapus atau ID tidak ditemukan.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Gagal mengeksekusi perintah hapus.']);
}
