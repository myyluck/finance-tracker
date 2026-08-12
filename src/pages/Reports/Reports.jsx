import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPrinter, FiDownload } from 'react-icons/fi';
import { useFinance } from '../../context/FinanceContext';
import { TRANSACTION_TYPES } from '../../data/constants';
import { formatRupiah, formatDate } from '../../utils/formatters';
import Button from '../../components/Button/Button';
import './Reports.css';

const Reports = () => {
  const { transactions } = useFinance();
  
  // Set default bulan ke bulan saat ini (Format: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Filter transaksi berdasarkan bulan yang dipilih
  const monthlyData = useMemo(() => {
    return transactions.filter(trx => trx.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Hitung ringkasan
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    monthlyData.forEach(trx => {
      if (trx.type === TRANSACTION_TYPES.INCOME) income += Number(trx.nominal);
      if (trx.type === TRANSACTION_TYPES.EXPENSE) expense += Number(trx.nominal);
    });

    return { income, expense, balance: income - expense };
  }, [monthlyData]);

  // Fungsi Export ke CSV
  const handleExportCSV = () => {
    if (monthlyData.length === 0) {
      alert("Tidak ada data untuk diexport pada bulan ini.");
      return;
    }

    const headers = ["Tanggal", "Keterangan", "Kategori", "Jenis", "Nominal"];
    const csvRows = [headers.join(',')];

    monthlyData.forEach(trx => {
      const row = [
        trx.date,
        `"${trx.description}"`, // Menggunakan tanda kutip untuk mencegah error jika ada koma di keterangan
        trx.category,
        trx.type,
        trx.nominal
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Keuangan_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Konversi YYYY-MM menjadi string nama bulan yang rapi
  const displayMonthName = new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <motion.div 
      className="reports-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Laporan Keuangan</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Cetak dan unduh laporan bulanan Anda.</p>
      </div>

      <div className="report-controls">
        <input 
          type="month" 
          className="month-selector"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <Button variant="outline" icon={<FiDownload />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" icon={<FiPrinter />} onClick={handlePrint}>
            Cetak (Print)
          </Button>
        </div>
      </div>

      {/* Area yang akan di-print */}
      <div className="report-document">
        <div className="report-title">
          <h2>Laporan Keuangan Bulanan</h2>
          <p>Periode: {displayMonthName}</p>
        </div>

        <div className="report-summary-grid">
          <div className="summary-box">
            <p>Total Pemasukan</p>
            <h3 style={{ color: 'var(--color-primary)' }}>{formatRupiah(summary.income)}</h3>
          </div>
          <div className="summary-box">
            <p>Total Pengeluaran</p>
            <h3 style={{ color: 'var(--color-danger)' }}>{formatRupiah(summary.expense)}</h3>
          </div>
          <div className="summary-box">
            <p>Saldo Bersih</p>
            <h3 style={{ color: 'var(--color-secondary)' }}>{formatRupiah(summary.balance)}</h3>
          </div>
        </div>

        <table className="modern-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tanggal</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Keterangan</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Kategori</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Nominal</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.length > 0 ? (
              monthlyData.map((trx) => (
                <tr key={trx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>{formatDate(trx.date)}</td>
                  <td style={{ padding: '12px' }}>{trx.description}</td>
                  <td style={{ padding: '12px' }}>{trx.category}</td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'right',
                    color: trx.type === TRANSACTION_TYPES.INCOME ? 'var(--color-primary)' : 'var(--color-danger)'
                  }}>
                    {trx.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} {formatRupiah(trx.nominal)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Tidak ada transaksi di bulan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Reports;