<?php
// 1. PANGGIL KONEKSI DATABASE
include 'config/database.php'; 

// 2. QUERY DATA DASHBOARD
try {
    // A. Card Statistik (KPI)
    $totalBarang         = $pdo->query("SELECT COUNT(*) FROM barang")->fetchColumn() ?: 0;
    $stokKritis          = $pdo->query("SELECT COUNT(*) FROM barang WHERE stok <= stok_minimum")->fetchColumn() ?: 0;
    $barangMasukHariIni   = $pdo->query("SELECT COALESCE(SUM(jumlah), 0) FROM transaksi_masuk WHERE DATE(tanggal) = CURDATE()")->fetchColumn();
    $barangKeluarHariIni  = $pdo->query("SELECT COALESCE(SUM(jumlah), 0) FROM transaksi_keluar WHERE DATE(tanggal) = CURDATE()")->fetchColumn();

    // B. Daftar Barang Stok Kritis (Top 5)
    $stmtKritis     = $pdo->query("SELECT sku, nama_barang, stok, stok_minimum FROM barang WHERE stok <= stok_minimum ORDER BY stok ASC LIMIT 5");
    $listStokKritis = $stmtKritis->fetchAll();

    // C. Aktivitas Terakhir (Top 5 Transaksi Masuk & Keluar)
    $sqlAktivitas = "
        (SELECT 'Masuk' AS tipe, tm.tanggal, b.nama_barang, tm.jumlah, COALESCE(k.nama, 'Sistem') AS petugas
         FROM transaksi_masuk tm
         JOIN barang b ON tm.barang_id = b.id
         LEFT JOIN karyawan k ON tm.petugas_id = k.id)
        UNION ALL
        (SELECT 'Keluar' AS tipe, tk.tanggal, b.nama_barang, tk.jumlah, COALESCE(k.nama, 'Sistem') AS petugas
         FROM transaksi_keluar tk
         JOIN barang b ON tk.barang_id = b.id
         LEFT JOIN karyawan k ON tk.petugas_id = k.id)
        ORDER BY tanggal DESC LIMIT 5
    ";
    $listAktivitas = $pdo->query($sqlAktivitas)->fetchAll();

    // D. Option Dropdown untuk Modal Inbound
    $listBarang  = $pdo->query("SELECT id, sku, nama_barang FROM barang ORDER BY nama_barang ASC")->fetchAll();
    $listPemasok = $pdo->query("SELECT id, nama_pemasok FROM pemasok ORDER BY nama_pemasok ASC")->fetchAll();

} catch (PDOException $e) {
    die("Gagal mengambil data dashboard: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Overview - Warehouse App</title>
  <link rel="stylesheet" href="/public/css/pages/dashboard.css">
  <script src="https://unpkg.com/lucide@latest"></script>
</head>

<body>
  <div id="toastContainer" class="toast-container"></div>
  <div class="app-layout">
    
    <!-- SIDEBAR NAVIGATION -->
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <a href="/index.php" class="nav-item active">
          <div class="nav-item-content">
            <span class="nav-item-icon"><i data-lucide="layout-dashboard"></i></span>
            <span>Dashboard</span>
          </div>
        </a>

        <div class="nav-group open" id="persediaanGroup">
          <div class="nav-item" id="persediaanGroupToggle">
            <div class="nav-item-content">
              <span class="nav-item-icon"><i data-lucide="package"></i></span>
              <span>Persediaan</span>
            </div>
            <i data-lucide="chevron-down" class="chevron-icon"></i>
          </div>
          <div class="nav-submenu">
            <a href="/public/katalog-barang.php" class="submenu-item"><span>Katalog Barang</span></a>
            <a href="/public/barang-masuk.php" class="submenu-item"><span>Barang Masuk</span></a>
            <a href="/public/barang-keluar.php" class="submenu-item"><span>Barang Keluar</span></a>
            <a href="/public/stok-opname.php" class="submenu-item"><span>Stok Opname</span></a>
            <a href="/public/stok-minimum.php" class="submenu-item"><span>Cek Stok Minimum</span></a>
          </div>
        </div>

        <a href="/public/pemasok.php" class="nav-item">
          <div class="nav-item-content"><span class="nav-item-icon"><i data-lucide="truck"></i></span><span>Pemasok</span></div>
        </a>
        <a href="/public/karyawan.php" class="nav-item">
          <div class="nav-item-content"><span class="nav-item-icon"><i data-lucide="users"></i></span><span>Karyawan</span></div>
        </a>
        <a href="/public/aset.php" class="nav-item">
          <div class="nav-item-content"><span class="nav-item-icon"><i data-lucide="boxes"></i></span><span>Aset Gudang</span></div>
        </a>
        <a href="/public/laporan.php" class="nav-item">
          <div class="nav-item-content"><span class="nav-item-icon"><i data-lucide="file-bar-chart"></i></span><span>Laporan</span></div>
        </a>
      </nav>

      <footer class="sidebar-footer">
        <div class="nav-item" id="logoutBtn">
          <div class="nav-item-content">
            <span class="nav-item-icon"><i data-lucide="log-out"></i></span>
            <span>Logout</span>
          </div>
        </div>
      </footer>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="main-wrapper">
      <header class="top-header">
        <div class="header-brand">
          <div class="brand-icon"><img src="assets/images/logo.png" alt="LogiTrack Pro Logo" class="brand-logo-img" /></div>
          <div class="brand-info">
            <span class="brand-name">LogiTrack Pro</span>
            <span class="brand-sub">Warehouse ID: WH-882</span>
          </div>
        </div>

        <div class="header-search">
          <span class="header-search-icon"><i data-lucide="search"></i></span>
          <input type="text" id="globalSearchInput" class="header-search-input" placeholder="Cari barang, SKU, transaksi..." />
        </div>

        <div class="header-actions">
          <button type="button" id="refreshDataBtn" class="btn btn-secondary btn-sm" onclick="window.location.reload();">
            <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i><span>Refresh Data</span>
          </button>
          <button type="button" id="notificationBtn" class="icon-button" title="Notifikasi">
            <i data-lucide="bell"></i><span class="notification-badge-dot"></span>
          </button>
          <div class="user-profile-btn">
            <div class="avatar" id="userAvatar">BS</div>
            <span class="user-name" id="userNameDisplay">Budi Santoso</span>
            <span class="user-dropdown-caret"><i data-lucide="chevron-down"></i></span>
          </div>
        </div>
      </header>

      <main class="content-area">
        <section id="viewDashboard" class="view-panel">
          <header class="page-header">
            <div class="page-title-box">
              <h1>Dashboard</h1>
              <p>Periksa situasi, barang, dan informasi umum lainnya</p>
            </div>
          </header>

          <!-- STATS CARDS -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card-top"><span class="stat-title">Total barang</span><span class="stat-icon">📦</span></div>
              <div class="stat-value" id="statTotalBarang"><?= number_format($totalBarang) ?></div>
              <div class="stat-footer-text">
                <span>SKU aktif</span>
                <span class="kpi-trend up-good">Realtime DB</span>
              </div>
            </div>

            <div class="stat-card alert-border">
              <div class="stat-card-top">
                <span class="stat-title">Stok Kritis</span>
                <span class="stat-icon alert-icon"><i data-lucide="alert-triangle"></i></span>
              </div>
              <div class="stat-value text-danger" id="statStokKritis"><?= number_format($stokKritis) ?></div>
              <div class="stat-footer-text danger">
                <span>Perlu penanganan</span>
                <span class="kpi-trend down-good">Batas Min</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card-top"><span class="stat-title">Barang masuk</span><span class="stat-icon">↙</span></div>
              <div class="stat-value" id="statBarangMasuk"><?= number_format($barangMasukHariIni) ?></div>
              <div class="stat-footer-text">
                <span>Transaksi hari ini</span>
                <span class="kpi-trend up-good">Hari Ini</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card-top"><span class="stat-title">Barang keluar</span><span class="stat-icon">↗</span></div>
              <div class="stat-value" id="statBarangKeluar"><?= number_format($barangKeluarHariIni) ?></div>
              <div class="stat-footer-text">
                <span>Transaksi hari ini</span>
                <span class="kpi-trend up-good">Hari Ini</span>
              </div>
            </div>
          </div>

          <!-- DASHBOARD SPLIT 1 -->
          <div class="dashboard-split">
            <div class="card-panel">
              <header class="panel-header">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <h2 class="panel-title">Grafik Mutasi</h2>
                  <div class="period-filter-group">
                    <button type="button" class="period-btn active" data-period="7">7 Hari</button>
                    <button type="button" class="period-btn" data-period="30">30 Hari</button>
                    <button type="button" class="period-btn" data-period="custom" title="Custom Range Placeholder">Custom</button>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item"><span class="legend-dot inbound"></span><span>Inbound</span></div>
                  <div class="legend-item"><span class="legend-dot outbound"></span><span>Outbound</span></div>
                </div>
              </header>
              <div class="bar-chart-container" id="barChartContainer"></div>
            </div>

            <!-- CRITICAL STOCK LIST -->
            <div class="card-panel">
              <header class="panel-header">
                <h2 class="panel-title text-danger">Stok barang kritis</h2>
              </header>
              <div class="critical-list" id="criticalStockList">
                <?php if (empty($listStokKritis)): ?>
                  <p class="text-muted" style="padding: 12px; font-size: 13px;">Semua stok barang aman.</p>
                <?php else: ?>
                  <?php foreach ($listStokKritis as $kritis): ?>
                    <div class="critical-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                      <div>
                        <div style="font-weight: 600; font-size: 13px;"><?= htmlspecialchars($kritis['nama_barang']) ?></div>
                        <div class="text-muted font-mono" style="font-size: 11px;">SKU: <?= htmlspecialchars($kritis['sku']) ?></div>
                      </div>
                      <div class="text-danger font-mono" style="font-weight: 600; font-size: 12px;">
                        Sisa: <?= number_format($kritis['stok']) ?> (Min: <?= number_format($kritis['stok_minimum']) ?>)
                      </div>
                    </div>
                  <?php endforeach; ?>
                <?php endif; ?>
              </div>
              <a href="/public/stok-minimum.php" class="panel-footer-btn">Lihat semua barang kritis</a>
            </div>
          </div>

          <!-- DASHBOARD SPLIT 2 -->
          <div class="dashboard-secondary-split">
            <div class="card-panel">
              <header class="panel-header">
                <h2 class="panel-title">Kapasitas Gudang</h2>
              </header>
              <div class="capacity-list" id="warehouseCapacityList"></div>
            </div>

            <!-- RECENT ACTIVITIES TABLE -->
            <div class="card-panel">
              <header class="panel-header">
                <h2 class="panel-title">Aktivitas Terakhir</h2>
                <button type="button" class="btn btn-secondary btn-sm" data-open-modal="inboundModal">+ Transaksi Baru</button>
              </header>
              <div class="table-container">
                <table class="custom-table">
                  <thead>
                    <tr>
                      <th>WAKTU</th>
                      <th>AKTIVITAS</th>
                      <th>BARANG</th>
                      <th>KUANTITAS</th>
                      <th>PETUGAS</th>
                    </tr>
                  </thead>
                  <tbody id="recentActivitiesTbody">
                    <?php if (empty($listAktivitas)): ?>
                      <tr>
                        <td colspan="5" style="text-align:center; color:#888; padding: 20px;">Belum ada aktivitas transaksi.</td>
                      </tr>
                    <?php else: ?>
                      <?php foreach ($listAktivitas as $act): ?>
                        <tr>
                          <td class="waktu font-mono text-muted"><?= date('d/m/Y H:i', strtotime($act['tanggal'])) ?></td>
                          <td>
                            <span class="badge <?= $act['tipe'] === 'Masuk' ? 'badge-success' : 'badge-danger' ?>">
                              <?= htmlspecialchars($act['tipe']) ?>
                            </span>
                          </td>
                          <td class="barang font-mono" style="font-weight: 500;"><?= htmlspecialchars($act['nama_barang']) ?></td>
                          <td class="kuantitas font-mono" style="font-weight: 600;"><?= number_format($act['jumlah']) ?></td>
                          <td class="petugas text-muted"><?= htmlspecialchars($act['petugas']) ?></td>
                        </tr>
                      <?php endforeach; ?>
                    <?php endif; ?>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <!-- MODAL INBOUND -->
  <div id="inboundModal" class="modal-overlay">
    <div class="modal-card">
      <header class="modal-header">
        <h3 class="modal-title">Transaksi Barang Masuk (Inbound)</h3>
        <button type="button" class="modal-close-btn" data-close-modal="inboundModal">✕</button>
      </header>
      <form id="inboundForm" action="proses-inbound.php" method="POST">
        <div class="modal-body">
          <div class="form-group">
            <label for="inboundItemSelect" class="form-label">BARANG</label>
            <div class="input-wrapper">
              <i data-lucide="package" class="input-icon"></i>
              <select id="inboundItemSelect" name="barang_id" class="form-select font-mono" required>
                <option value="">-- Pilih Barang --</option>
                <?php foreach ($listBarang as $b): ?>
                  <option value="<?= $b['id'] ?>">[<?= htmlspecialchars($b['sku']) ?>] <?= htmlspecialchars($b['nama_barang']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="inboundSupplierSelect" class="form-label">PEMASOK</label>
            <div class="input-wrapper">
              <i data-lucide="truck" class="input-icon"></i>
              <select id="inboundSupplierSelect" name="pemasok_id" class="form-select font-mono">
                <option value="">-- Pilih Pemasok --</option>
                <?php foreach ($listPemasok as $p): ?>
                  <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['nama_pemasok']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="inboundQtyInput" class="form-label">JUMLAH</label>
            <div class="input-wrapper">
              <i data-lucide="hash" class="input-icon"></i>
              <input type="number" id="inboundQtyInput" name="jumlah" class="form-input font-mono" min="1" required />
            </div>
          </div>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <label for="inboundDateInput" class="form-label" style="margin:0;">TANGGAL MASUK</label>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:11px;" onclick="document.getElementById('inboundDateInput').valueAsDate = new Date();">📅 Hari Ini</button>
            </div>
            <div class="input-wrapper">
              <i data-lucide="calendar" class="input-icon"></i>
              <input type="date" id="inboundDateInput" name="tanggal" class="form-input font-mono" value="<?= date('Y-m-d') ?>" required />
            </div>
          </div>

          <div class="form-group">
            <label for="inboundKetInput" class="form-label">KETERANGAN / DESKRIPSI</label>
            <div class="input-wrapper">
              <i data-lucide="file-text" class="input-icon"></i>
              <input type="text" id="inboundKetInput" name="keterangan" class="form-input" placeholder="Restok persediaan rutin" required />
            </div>
          </div>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn btn-secondary" data-close-modal="inboundModal">Batal</button>
          <button type="submit" class="btn btn-primary">Simpan Barang Masuk</button>
        </footer>
      </form>
    </div>
  </div>

  <!-- TEMPLATE FOR DOM CLONING -->
  <template id="recentActivityRowTemplate">
    <tr>
      <td class="waktu font-mono text-muted"></td>
      <td><span class="badge"></span></td>
      <td class="barang font-mono" style="font-weight: 500;"></td>
      <td class="kuantitas font-mono" style="font-weight: 600;"></td>
      <td class="petugas text-muted"></td>
    </tr>
  </template>

  <!-- JS DEPENDENCIES -->
  <script src="js/models/inventory.model.js"></script>
  <script src="js/services/storage.service.js"></script>
  <script src="js/services/crud.service.js"></script>
  <script src="js/services/inventory.service.js"></script>
  <script src="js/components/toast.component.js"></script>
  <script src="js/components/chart.component.js"></script>
  <script src="js/views/tables.view.js"></script>
  <script src="js/views/search.view.js"></script>
  <script src="js/views/modals.view.js"></script>
  <script src="js/views/dashboard.view.js"></script>
  <script>
    // Inisialisasi Ikon Lucide
    lucide.createIcons();
  </script>
</body>

</html>