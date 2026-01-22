

import useExpenseStore from './useExpenseStore';

function DangerZone() {
  const clearAllExpenses = useExpenseStore((state) => state.clearAllExpenses);
  const resetStore = useExpenseStore((state) => state.resetStore);

  return (
    <section className="bg-red-50 p-6 rounded-2xl border border-red-100 mt-10">
      <h3 className="text-red-800 font-bold mb-1">Danger Zone</h3>
      <p className="text-red-600 text-xs mb-4">These actions are permanent. Use with caution.</p>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={clearAllExpenses}
          className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition shadow-sm"
        >
          Clear History
        </button>
        <button 
          onClick={resetStore}
          className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition shadow-md shadow-red-200"
        >
          Factory Reset App
        </button>
      </div>
    </section>
  );
}

export default DangerZone;