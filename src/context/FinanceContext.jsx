import { createContext, useContext, useEffect, useState } from "react";
import { storageService } from "../services/storageService";

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Ambil data saat aplikasi pertama kali dijalankan
  useEffect(() => {
    const data = storageService.getTransactions();
    setTransactions(data);
  }, []);

  // Tambah transaksi
  const addTransaction = (newTransaction) => {
    if (!newTransaction) return;

    const updatedTransactions =
      storageService.saveTransaction(newTransaction);

    setTransactions(updatedTransactions);
  };

  // Edit transaksi
  const editTransaction = (id, updatedData) => {
    if (!id) return;

    const updatedTransactions =
      storageService.updateTransaction(id, updatedData);

    setTransactions(updatedTransactions);
  };

  // Hapus transaksi
  const removeTransaction = (id) => {
    if (!id) return;

    const updatedTransactions =
      storageService.deleteTransaction(id);

    setTransactions(updatedTransactions);
  };

  const value = {
    transactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};