<?php

require '../../config/database.php';

$stmt = $pdo->query("
    SELECT *
    FROM pemasok
    ORDER BY id DESC
");

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $data
]);