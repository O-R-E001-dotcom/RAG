
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      totalBudget: 500000,

      // --- Actions ---
      addExpense: (expense) => set((state) => ({
          expenses: [...state.expenses,
            {
              id: crypto.randomUUID(),
              description: expense.description,
              amount: parseFloat(expense.amount) || 0,
              category: expense.category,
              date: expense.date || new Date().toISOString().split('T')[0],
            },
          ],
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        })),

      setBudget: (amount) =>
        set({ totalBudget: parseFloat(amount) || 0 }),
      
      getTotalSpent: () => {
        const expenses = get().expenses;
        return expenses.reduce((acc, curr) => acc + curr.amount, 0);
      },

      getRemainingBudget: () => {
        const totalBudget = get().totalBudget;
        const totalSpent = get().getTotalSpent();
        return totalBudget - totalSpent;
      },

      getSpendingPercentage: () => {
        const totalSpent = get().getTotalSpent();
        const budget = get().totalBudget;
        if (budget === 0) return 0;
        return (totalSpent / budget) * 100;
      },

      /**
       * New: Filter expenses by category
       * @param {string} category - The category to filter by (e.g., 'Food')
       */
      getExpensesByCategory: (category) => {
        return get().expenses.filter((exp) => exp.category === category);
      },

      getCategoryTotal: (category) => {
        return get()
          .getExpensesByCategory(category)
          .reduce((acc, curr) => acc + curr.amount, 0);
      },

      clearAllExpenses: () => {
        const confirmClear = window.confirm("Are you sure you want to delete all expenses?");
        if (confirmClear) {
          set({ expenses: [] });
        }
      },

      resetStore: () => {
        if (window.confirm("Reset entire tracker? This clears expenses and budget.")) {
          set({ expenses: [], totalBudget: 500000 });
        }
      },
    }),
    {
      name: 'expense-tracker',
      partialize: (state) => ({
        expenses: state.expenses,
        totalBudget: state.totalBudget,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useExpenseStore;