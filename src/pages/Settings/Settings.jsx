import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiUpload, FiTrash2, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { storageService } from '../../services/storageService';
import Button from '../../components/Button/Button';
import './Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);

  // Fitur Export (Backup)
  const handleExportData = () => {
    const data = storageService.getTransactions();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_finance_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Fitur Import (Restore)
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          // Menyimpan paksa ke localStorage via key langsung untuk bulk insert
          localStorage.setItem('finance_transactions', JSON.stringify(importedData));
          alert('Data berhasil dipulihkan! Aplikasi akan dimuat ulang.');
          window.location.reload(); // Reload untuk memperbarui Context
        } else {
          alert('Format file JSON tidak valid.');
        }
      } catch (error) {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Fitur Reset
  const handleResetData = () => {
    if (window.confirm("PERINGATAN! Semua data transaksi Anda akan dihapus permanen. Lanjutkan?")) {
      storageService.clearAllData();
      alert('Semua data berhasil dihapus.');
      window.location.reload(); // Reload untuk mereset Context
    }
  };

  return (
    <motion.div 
      className="settings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Pengaturan</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Sesuaikan tampilan dan kelola data Anda.</p>
      </div>

      <div className="settings-card">
        {/* Tampilan */}
        <div className="settings-section">
          <h3>Tampilan</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Tema Aplikasi</h4>
              <p>Pilih antara mode terang (Light) atau gelap (Dark).</p>
            </div>
            <Button variant="outline" onClick={toggleTheme} icon={theme === 'light' ? <FiMoon /> : <FiSun />}>
              {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            </Button>
          </div>
        </div>

        {/* Manajemen Data */}
        <div className="settings-section">
          <h3>Manajemen Data (Local Storage)</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>Backup Data</h4>
              <p>Simpan semua riwayat transaksi Anda ke dalam file JSON.</p>
            </div>
            <Button variant="primary" icon={<FiDownload />} onClick={handleExportData}>
              Export Data
            </Button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Restore Data</h4>
              <p>Pulihkan transaksi dari file backup JSON sebelumnya.</p>
            </div>
            {/* Input file disembunyikan, di-trigger via Button */}
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImportData}
            />
            <Button variant="outline" icon={<FiUpload />} onClick={() => fileInputRef.current.click()}>
              Import Data
            </Button>
          </div>
        </div>

        {/* Zona Berbahaya */}
        <div className="settings-section danger-zone">
          <h3>Zona Berbahaya</h3>
          <div className="setting-item" style={{ borderColor: 'var(--color-danger)' }}>
            <div className="setting-info">
              <h4 style={{ color: 'var(--color-danger)' }}>Hapus Semua Data</h4>
              <p>Tindakan ini tidak dapat dibatalkan. Semua transaksi akan hilang.</p>
            </div>
            <Button variant="danger" icon={<FiTrash2 />} onClick={handleResetData}>
              Reset Aplikasi
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;