import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  totalBudget: 9000000000,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push({
        id: crypto.randomUUID(),
        description: action.payload.description,
        amount: parseFloat(action.payload.amount) || 0,
        category: action.payload.category,
        date: action.payload.date || new Date().toISOString().split('T')[0],
      });
    },

    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter((exp) => exp.id !== action.payload);
    },

    setBudget: (state, action) => {
      state.totalBudget = parseFloat(action.payload) || 0;
    },

    clearAllExpenses: (state) => {
      state.expenses = [];
    }
  },
});

// Export Actions (for useDispatch)
export const { addExpense, removeExpense, setBudget, clearAllExpenses } = expenseSlice.actions

export default expenseSlice.reducer;

