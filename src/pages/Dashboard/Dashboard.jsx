import React, { lazy, Suspense, useMemo, useState } from 'react';
import {
  FiDollarSign,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiActivity,
  FiPlus
} from 'react-icons/fi';

import { useFinance } from '../../context/FinanceContext';
import StatCard from '../../components/Card/StatCard';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';

import { TRANSACTION_TYPES } from '../../data/constants';
import './Dashboard.css';

// DashboardCharts dimuat secara lazy agar Recharts tidak masuk
// ke bundle Dashboard utama
const DashboardCharts = lazy(
  () => import('../../components/Charts/DashboardCharts')
);

const Dashboard = () => {
  const { transactions } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Kalkulasi statistik
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalIncome = 0;
    let totalExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    transactions.forEach((trx) => {
      const trxDate = new Date(trx.date);

      const isCurrentMonth =
        trxDate.getMonth() === currentMonth &&
        trxDate.getFullYear() === currentYear;

      const nominal = Number(trx.nominal);

      if (trx.type === TRANSACTION_TYPES.INCOME) {
        totalIncome += nominal;

        if (isCurrentMonth) {
          monthlyIncome += nominal;
        }
      } else if (trx.type === TRANSACTION_TYPES.EXPENSE) {
        totalExpense += nominal;

        if (isCurrentMonth) {
          monthlyExpense += nominal;
        }
      }
    });

    return {
      totalBalance: totalIncome - totalExpense,
      monthlyIncome,
      monthlyExpense,
      totalTransactions: transactions.length
    };
  }, [transactions]);

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div
        className="dashboard-header"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h1>Dashboard Utama</h1>
          <p>Ringkasan finansial Anda saat ini.</p>
        </div>

        <Button
          icon={<FiPlus />}
          onClick={() => setIsModalOpen(true)}
        >
          Tambah Transaksi
        </Button>
      </div>

      {/* Statistik */}
      <div className="stats-grid">

        <StatCard
          title="Total Saldo"
          value={stats.totalBalance}
          icon={<FiDollarSign />}
          color="secondary"
        />

        <StatCard
          title="Pemasukan (Bulan Ini)"
          value={stats.monthlyIncome}
          icon={<FiArrowUpCircle />}
          color="primary"
        />

        <StatCard
          title="Pengeluaran (Bulan Ini)"
          value={stats.monthlyExpense}
          icon={<FiArrowDownCircle />}
          color="danger"
        />

        <StatCard
          title="Total Transaksi"
          value={stats.totalTransactions}
          icon={<FiActivity />}
          color="warning"
        />

      </div>

      {/* Grafik & Transaksi Terbaru */}
      <div className="dashboard-content">

        {/* Grafik */}
        <div className="content-section">
          <div className="section-header">
            <h3>Statistik Pengeluaran & Pemasukan</h3>
          </div>

          <Suspense fallback={<p>Memuat grafik...</p>}>
            <DashboardCharts />
          </Suspense>
        </div>

        {/* Transaksi Terbaru */}
        <div className="content-section">
          <div className="section-header">
            <h3>Transaksi Terbaru</h3>
          </div>

          {transactions.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                color: 'var(--text-secondary)',
                padding: '20px 0'
              }}
            >
              Belum ada transaksi
            </p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {transactions.slice(0, 5).map((trx) => (
                <div
                  key={trx.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {trx.description}
                    </p>

                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {trx.category}
                    </p>
                  </div>

                  <p
                    style={{
                      fontWeight: 600,
                      color:
                        trx.type === TRANSACTION_TYPES.INCOME
                          ? 'var(--color-primary)'
                          : 'var(--color-danger)'
                    }}
                  >
                    {trx.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} Rp{' '}
                    {Number(trx.nominal).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Tambah Transaksi */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Transaksi Baru"
      >
        <TransactionForm
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default Dashboard;