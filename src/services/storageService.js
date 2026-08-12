// ===============================
// Local Storage Keys
// ===============================

const DB_TRANSACTIONS = "finance_transactions";
const DB_SETTINGS = "finance_settings";
const DB_BUDGETS = "finance_budgets";
const DB_GOALS = "finance_goals";

// ===============================
// Storage Service
// ===============================

export const storageService = {
  // ===============================
  // Transactions
  // ===============================

  getTransactions() {
    try {
      const data = localStorage.getItem(DB_TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading transactions:", error);
      return [];
    }
  },

  saveTransaction(transaction) {
    try {
      const transactions = this.getTransactions();

      transactions.unshift(transaction);

      localStorage.setItem(
        DB_TRANSACTIONS,
        JSON.stringify(transactions)
      );

      return transactions;
    } catch (error) {
      console.error("Error saving transaction:", error);
      return [];
    }
  },

  updateTransaction(id, updatedData) {
    try {
      const transactions = this.getTransactions();

      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updatedData }
          : transaction
      );

      localStorage.setItem(
        DB_TRANSACTIONS,
        JSON.stringify(updatedTransactions)
      );

      return updatedTransactions;
    } catch (error) {
      console.error("Error updating transaction:", error);
      return [];
    }
  },

  deleteTransaction(id) {
    try {
      const transactions = this.getTransactions();

      const updatedTransactions = transactions.filter(
        (transaction) => transaction.id !== id
      );

      localStorage.setItem(
        DB_TRANSACTIONS,
        JSON.stringify(updatedTransactions)
      );

      return updatedTransactions;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return [];
    }
  },

  // ===============================
  // Settings
  // ===============================

  getSettings() {
    try {
      const data = localStorage.getItem(DB_SETTINGS);

      return data
        ? JSON.parse(data)
        : {
            theme: "light",
          };
    } catch (error) {
      console.error("Error reading settings:", error);

      return {
        theme: "light",
      };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(
        DB_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  },

  // ===============================
  // Budgets
  // ===============================

  getBudgets() {
    try {
      const data = localStorage.getItem(DB_BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading budgets:", error);
      return [];
    }
  },

  saveBudgets(budgets) {
    try {
      localStorage.setItem(
        DB_BUDGETS,
        JSON.stringify(budgets)
      );
    } catch (error) {
      console.error("Error saving budgets:", error);
    }
  },

  // ===============================
  // Goals
  // ===============================

  getGoals() {
    try {
      const data = localStorage.getItem(DB_GOALS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading goals:", error);
      return [];
    }
  },

  saveGoals(goals) {
    try {
      localStorage.setItem(
        DB_GOALS,
        JSON.stringify(goals)
      );
    } catch (error) {
      console.error("Error saving goals:", error);
    }
  },

  // ===============================
  // Clear All Data
  // ===============================

  clearAllData() {
    try {
      localStorage.removeItem(DB_TRANSACTIONS);
      localStorage.removeItem(DB_SETTINGS);
      localStorage.removeItem(DB_BUDGETS);
      localStorage.removeItem(DB_GOALS);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  },
};