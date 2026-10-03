<?php
require '../../config/database.php';
header('Content-Type: application/json'); // Set output ke format JSON

try {
    // Ambil semua data barang urut dari yang terbaru
    $stmt = $pdo->query("SELECT * FROM barang ORDER BY id DESC");
    $data = $stmt->fetchAll(); // Tidak butuh PDO::FETCH_ASSOC jika sudah diatur di database.php

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengambil data barang: ' . $e->getMessage()
    ]);
}
