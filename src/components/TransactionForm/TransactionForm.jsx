import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFinance } from '../../context/FinanceContext';
import { TRANSACTION_TYPES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../data/constants';
import { formatInputDate } from '../../utils/formatters';
import Button from '../Button/Button';
import './TransactionForm.css';

const TransactionForm = ({ onClose }) => {
  const { addTransaction } = useFinance();
  
  const [formData, setFormData] = useState({
    type: TRANSACTION_TYPES.EXPENSE, // Default pengeluaran
    nominal: '',
    category: EXPENSE_CATEGORIES[0],
    date: formatInputDate(new Date()),
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Reset kategori jika jenis (type) berubah
  useEffect(() => {
    if (formData.type === TRANSACTION_TYPES.INCOME) {
      setFormData(prev => ({ ...prev, category: INCOME_CATEGORIES[0] }));
    } else {
      setFormData(prev => ({ ...prev, category: EXPENSE_CATEGORIES[0] }));
    }
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Hapus error saat user mulai mengetik
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.nominal) {
      tempErrors.nominal = "Nominal wajib diisi";
    } else if (Number(formData.nominal) <= 0) {
      tempErrors.nominal = "Nominal tidak boleh nol atau minus";
    }
    
    if (!formData.description.trim()) {
      tempErrors.description = "Keterangan wajib diisi";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const newTransaction = {
        id: uuidv4(),
        ...formData,
        nominal: Number(formData.nominal) // Pastikan jadi number
      };
      
      addTransaction(newTransaction);
      onClose(); // Tutup modal setelah sukses
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Jenis Transaksi</label>
        <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
          <option value={TRANSACTION_TYPES.EXPENSE}>Pengeluaran</option>
          <option value={TRANSACTION_TYPES.INCOME}>Pemasukan</option>
        </select>
      </div>

      <div className="form-group">
        <label>Nominal (Rp)</label>
        <input 
          type="number" 
          name="nominal" 
          className="form-control" 
          placeholder="Contoh: 50000"
          value={formData.nominal}
          onChange={handleChange}
        />
        {errors.nominal && <span className="form-error">{errors.nominal}</span>}
      </div>

      <div className="form-group">
        <label>Kategori</label>
        <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
          {formData.type === TRANSACTION_TYPES.INCOME 
            ? INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
            : EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
          }
        </select>
      </div>

      <div className="form-group">
        <label>Tanggal</label>
        <input 
          type="date" 
          name="date" 
          className="form-control" 
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Keterangan</label>
        <textarea 
          name="description" 
          className="form-control" 
          rows="3" 
          placeholder="Makan siang di warteg..."
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-actions">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" variant="primary">Simpan Transaksi</Button>
      </div>
    </form>
  );
};

export default TransactionForm;