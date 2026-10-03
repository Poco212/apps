<?php

require '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

try {

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT *
        FROM barang
        WHERE id=?
    ");

    $stmt->execute([
        $data['itemId']
    ]);

    $barang = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$barang) {
        throw new Exception("Barang tidak ditemukan");
    }

    $oldStock = $barang['stok'];
    $newStock = (int)$data['physicalQty'];
    $diff = $newStock - $oldStock;

    $update = $pdo->prepare("
        UPDATE barang
        SET stok=?
        WHERE id=?
    ");

    $update->execute([
        $newStock,
        $barang['id']
    ]);

    $insert = $pdo->prepare("
        INSERT INTO stok_opname
        (
            tanggal,
            id_barang,
            stok_sistem,
            stok_fisik,
            selisih,
            petugas,
            keterangan
        )
        VALUES
        (?,?,?,?,?,?,?)
    ");

    $insert->execute([
        $data['tanggal'],
        $barang['id'],
        $oldStock,
        $newStock,
        $diff,
        $data['operatorName'],
        $data['notes']
    ]);

    $log = $pdo->prepare("
        INSERT INTO aktivitas
        (
            waktu,
            timestamp_log,
            jenis,
            barang,
            kuantitas,
            petugas
        )
        VALUES
        (?,?,?,?,?,?)
    ");

    $log->execute([
        'Opname',
        date('Y-m-d H:i:s'),
        ($diff >= 0 ? 'Inbound' : 'Outbound'),
        $barang['nama_barang'],
        ($diff >= 0 ? '+' : '') . $diff . ' ' . $barang['satuan'],
        $data['operatorName']
    ]);

    $pdo->commit();

    echo json_encode([
        "success"=>true,
        "message"=>"Stok opname berhasil"
    ]);

} catch(Exception $e){

    $pdo->rollBack();

    echo json_encode([
        "success"=>false,
        "message"=>$e->getMessage()
    ]);
}