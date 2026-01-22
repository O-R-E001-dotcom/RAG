import useExpenseStore from './useExpenseStore';
import { useState } from 'react';
import DangerZone from './DangerZone';
import BudgetProgressBar from './BudgetProgressBar';

function App() {
  const expenses = useExpenseStore((state) => state.expenses);
  const totalBudget = useExpenseStore((state) => state.totalBudget);
  const addExpense = useExpenseStore((state) => state.addExpense);
  const removeExpense = useExpenseStore((state) => state.removeExpense);
  const setBudget = useExpenseStore((state) => state.setBudget);

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  
  // NEW: Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Logic to filter expenses based on the search term
  const filteredExpenses = expenses.filter((exp) =>
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return alert("Please fill in all fields");
    addExpense({ description, amount, category });
    setDescription('');
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 transition-all">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header & Budget Card */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">🇳🇬 Naira Tracker</h1>
            <button 
              onClick={() => {
                const val = prompt("Set monthly budget:", totalBudget);
                if (val) setBudget(val);
              }}
              className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
            >
              Update Budget
            </button>
          </div>
          <BudgetProgressBar />
        </header>

        {/* Add Expense Form */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-700">New Entry</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              type="text" placeholder="What did you buy?" value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
            <input 
              className="border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              type="number" placeholder="Amount (₦)" value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
            <select 
              className="border border-gray-200 p-2.5 rounded-xl bg-white text-gray-600"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food 🍔</option>
              <option value="Transport">Transport 🚗</option>
              <option value="Electricity">Electricity 💡</option>
              <option value="Data/Airtime">Data 📱</option>
              <option value="Health">Health 🏥</option>
            </select>
            <button className="bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition active:scale-95">
              Add Expense
            </button>
          </form>
        </section>

        {/* Expense List with Search */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Transaction History</h3>
              <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                {filteredExpenses.length} Found
              </span>
            </div>
            
            {/* Search Input Field */}
            <input 
              type="text"
              placeholder="Search by name or category..."
              className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="divide-y divide-gray-100">
            {filteredExpenses.length === 0 && (
              <li className="p-10 text-center text-gray-400 italic">No matching transactions.</li>
            )}
            {filteredExpenses?.map((exp) => (
              <li key={exp.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition group">
                <div>
                  <p className="font-semibold text-gray-800">{exp.description}</p>
                  <p className="text-xs text-gray-400 font-medium">{exp.category} • {exp.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">₦{exp.amount.toLocaleString()}</span>
                  <button 
                    onClick={() => removeExpense(exp.id)} 
                    className="text-gray-300 hover:text-red-500 transition-colors text-xl p-1"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <DangerZone />
      </div>
    </div>
  );
}

export default App;