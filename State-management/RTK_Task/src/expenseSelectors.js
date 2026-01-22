
import { createSelector } from '@reduxjs/toolkit';

// Point to the root of this slice (defined as 'expenseData' in store.js)
const selectExpenseState = (state) => state.expenseData;

// Simple Input Selectors
export const selectAllExpenses = (state) => selectExpenseState(state).expenses;
export const selectTotalBudget = (state) => selectExpenseState(state).totalBudget;

// Memoized Selector: selectTotalSpent
export const selectTotalSpent = createSelector(
  [selectAllExpenses],
  (expenses) => expenses.reduce((sum, exp) => sum + exp.amount, 0)
);

// Memoized Selector: selectRemainingBudget
export const selectRemainingBudget = createSelector(
  [selectTotalBudget, selectTotalSpent],
  (budget, totalSpent) => budget - totalSpent
);




