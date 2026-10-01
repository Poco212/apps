<?php

require '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $pdo->prepare("
    DELETE FROM pemasok
    WHERE id = :id
");

$result = $stmt->execute([
    ':id' => $data['id']
]);

echo json_encode([
    'success' => $result,
    'message' => 'Pemasok berhasil dihapus'
]);