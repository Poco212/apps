<?php

require '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

try {

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT *
        FROM barang
        WHERE id = ?
    ");

    $stmt->execute([$data['itemId']]);

    $barang = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$barang) {
        throw new Exception("Barang tidak ditemukan");
    }

    $qty = (int)$data['qty'];

    if ($barang['stok'] < $qty) {
        throw new Exception(
            "Stok tidak mencukupi. Stok saat ini : " . $barang['stok']
        );
    }

    $stokBaru = $barang['stok'] - $qty;

    $update = $pdo->prepare("
        UPDATE barang
        SET stok = ?
        WHERE id = ?
    ");

    $update->execute([
        $stokBaru,
        $barang['id']
    ]);

    $insert = $pdo->prepare("
        INSERT INTO barang_keluar
        (
            tanggal,
            id_barang,
            jumlah,
            id_user,
            petugas,
            tujuan,
            keterangan
        )
        VALUES
        (?,?,?,?,?,?,?)
    ");

    $insert->execute([
        $data['tanggal'],
        $barang['id'],
        $qty,
        1,
        $data['operatorName'],
        $data['destination'],
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
        date('H:i'),
        date('Y-m-d H:i:s'),
        'Outbound',
        $barang['nama_barang'],
        '-' . $qty . ' ' . $barang['satuan'],
        $data['operatorName']
    ]);

    $pdo->commit();

    echo json_encode([
        "success"=>true,
        "message"=>"Barang keluar berhasil disimpan"
    ]);

} catch(Exception $e){

    $pdo->rollBack();

    echo json_encode([
        "success"=>false,
        "message"=>$e->getMessage()
    ]);
}