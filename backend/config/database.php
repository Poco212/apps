<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "warehouse_db";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    
    // Set error mode ke exception & ubah default fetch ke array asosiatif
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Return error database dalam format JSON
    header('Content-Type: application/json');
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "message" => "Koneksi database gagal: " . $e->getMessage()
    ]));
}
