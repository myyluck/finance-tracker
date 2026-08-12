import React, { useState, useMemo } from 'react';
import { FiSearch, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { formatDate, formatRupiah } from '../../utils/formatters';
import { TRANSACTION_TYPES } from '../../data/constants';
import Button from '../../components/Button/Button';
import './History.css';

const History = () => {
  const { transactions, removeTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Data berdasarkan pencarian realtime
  const filteredData = useMemo(() => {
    return transactions.filter(trx => 
      trx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  // Logika Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id) => {
    // Konfirmasi sebelum menghapus
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      removeTransaction(id);
    }
  };

  return (
    <motion.div 
      className="history-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="history-header">
        <h1>Riwayat Transaksi</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Lihat, cari, dan kelola semua transaksi Anda.</p>
      </div>

      <div className="history-controls">
        <div className="search-box">
          <FiSearch style={{ color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Cari transaksi atau kategori..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset ke halaman 1 saat mencari
            }}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Kategori</th>
              <th>Jenis</th>
              <th>Nominal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((trx) => (
                <tr key={trx.id}>
                  <td>{formatDate(trx.date)}</td>
                  <td style={{ fontWeight: 500 }}>{trx.description}</td>
                  <td>{trx.category}</td>
                  <td>
                    <span className={`badge ${trx.type === TRANSACTION_TYPES.INCOME ? 'badge-income' : 'badge-expense'}`}>
                      {trx.type}
                    </span>
                  </td>
                  <td style={{ 
                    fontWeight: 600,
                    color: trx.type === TRANSACTION_TYPES.INCOME ? 'var(--color-primary)' : 'var(--color-danger)'
                  }}>
                    {trx.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} {formatRupiah(trx.nominal)}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button 
                        className="btn-icon-only" 
                        onClick={() => handleDelete(trx.id)}
                        title="Hapus Transaksi"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                  Tidak ada data transaksi ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <FiChevronLeft /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next <FiChevronRight />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default History;