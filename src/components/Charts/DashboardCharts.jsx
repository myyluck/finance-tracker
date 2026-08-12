import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { TRANSACTION_TYPES } from '../../data/constants';
import './DashboardCharts.css';

const DashboardCharts = () => {
  const { transactions } = useFinance();

  // Memproses data untuk grafik Donut (Pemasukan vs Pengeluaran Keseluruhan)
  const pieData = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(trx => {
      if (trx.type === TRANSACTION_TYPES.INCOME) income += Number(trx.nominal);
      if (trx.type === TRANSACTION_TYPES.EXPENSE) expense += Number(trx.nominal);
    });
    
    return [
      { name: 'Pemasukan', value: income, color: '#22C55E' },
      { name: 'Pengeluaran', value: expense, color: '#EF4444' }
    ];
  }, [transactions]);

  // Memproses data untuk grafik Batang (Pengeluaran per Bulan di Tahun Ini)
  const barData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Inisialisasi array dengan nilai 0 untuk setiap bulan
    const monthlyData = months.map(month => ({ name: month, Pengeluaran: 0 }));

    transactions.forEach(trx => {
      const date = new Date(trx.date);
      if (date.getFullYear() === currentYear && trx.type === TRANSACTION_TYPES.EXPENSE) {
        const monthIndex = date.getMonth();
        monthlyData[monthIndex].Pengeluaran += Number(trx.nominal);
      }
    });

    return monthlyData;
  }, [transactions]);

  // Custom Tooltip untuk format Rupiah
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <p style={{ color: 'var(--text-primary)', margin: 0 }}>
            {`${payload[0].name || 'Nominal'} : Rp ${payload[0].value.toLocaleString('id-ID')}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <h4 className="chart-title">Pengeluaran per Bulan ({new Date().getFullYear()})</h4>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={barData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              tickFormatter={(value) => `Rp ${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Pengeluaran" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h4 className="chart-title">Rasio Pemasukan vs Pengeluaran</h4>
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'var(--text-primary)' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;