<?php

require '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

try {

    $pdo->beginTransaction();

    $itemId = $data['itemId'];
    $qty = (int)$data['qty'];

    $stmt = $pdo->prepare("
        SELECT *
        FROM barang
        WHERE id = ?
    ");

    $stmt->execute([$itemId]);

    $barang = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$barang) {
        throw new Exception("Barang tidak ditemukan");
    }

    $stokBaru = $barang['stok'] + $qty;

    $update = $pdo->prepare("
        UPDATE barang
        SET stok = ?
        WHERE id = ?
    ");

    $update->execute([
        $stokBaru,
        $itemId
    ]);

    $insert = $pdo->prepare("
        INSERT INTO barang_masuk
        (
            tanggal,
            id_barang,
            jumlah,
            id_pemasok,
            id_user,
            petugas,
            keterangan
        )
        VALUES
        (?,?,?,?,?,?,?)
    ");

    $insert->execute([
        $data['tanggal'],
        $itemId,
        $qty,
        $data['supplierId'],
        1,
        $data['operatorName'],
        $data['notes']
    ]);

    $log = $pdo->prepare("
        INSERT INTO aktivitas
        (waktu,timestamp_log,jenis,barang,kuantitas,petugas)
        VALUES
        (?,?,?,?,?,?)
    ");

    $log->execute([
        date('H:i'),
        date('Y-m-d H:i:s'),
        'Inbound',
        $barang['nama_barang'],
        '+' . $qty . ' ' . $barang['satuan'],
        $data['operatorName']
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Barang masuk berhasil disimpan"
    ]);

} catch(Exception $e){

    $pdo->rollBack();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}