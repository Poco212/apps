<?php

require '../../config/database.php';

$id = $_GET['id'] ?? 0;

$stmt = $pdo->prepare("
    SELECT *
    FROM pemasok
    WHERE id = ?
");

$stmt->execute([$id]);

$data = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $data
]);