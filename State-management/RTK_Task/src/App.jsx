import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addExpense, removeExpense } from './store/expenseSlice';
import { selectAllExpenses, selectTotalSpent, selectRemainingBudget } from './expenseSelectors';

export default function App() {
  const dispatch = useDispatch();
  
  // Data from selectors
  const expenses = useSelector(selectAllExpenses);
  const totalSpent = useSelector(selectTotalSpent);
  const balance = useSelector(selectRemainingBudget);

  // Local Form State
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!desc || !amt) return;
    dispatch(addExpense({
      description: desc, 
      amount: amt, 
      category: 'General',
      date: new Date().toLocaleDateString() }));
    setDesc(''); setAmt('');
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-sm uppercase opacity-80">Remaining Balance</h2>
        <p className="text-4xl font-bold">₦{balance.toLocaleString()}</p>
        <p className="mt-2 text-sm italic text-blue-100">Total Spent: ₦{totalSpent.toLocaleString()}</p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <input 
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="What did you pay for?" value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
        />
        <input 
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          type="number" placeholder="Amount (₦)" value={amt} 
          onChange={(e) => setAmt(e.target.value)} 
        />

        <select 
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="Food">Food 🍔</option>
          <option value="Transport">Transport 🚗</option>
          <option value="Shopping">Shopping</option>
        </select>
        <button className="bg-blue-600 text-white font-bold py-3 rounded-xl transition hover:bg-blue-700">
          Record Expense
        </button>
      </form>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <h3 className="p-4 font-bold border-b bg-gray-50">Recent Transactions</h3>
        <ul className="divide-y">
          {expenses.map((exp) => (
            <li key={exp.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <span>{exp.description}</span>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700">₦{exp.amount.toLocaleString()}</span>
                <button onClick={() => dispatch(removeExpense(exp.id))} className="text-red-500 font-bold">✕</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}