
import useExpenseStore from './useExpenseStore';

function BudgetProgressBar() {
  const spent = useExpenseStore((state) => state.getTotalSpent());
  const percentage = useExpenseStore((state) => state.getSpendingPercentage());
  const remaining = useExpenseStore((state) => state.getRemainingBudget());

  const colorClass = percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="mt-4">
      <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200">
        <div 
          className={`h-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-3">
        <div className="text-left">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Spent</p>
          <p className="font-bold text-gray-700">₦{spent.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Remaining</p>
          <p className={`font-bold ${remaining < 0 ? 'text-red-500' : 'text-gray-700'}`}>
            ₦{remaining.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BudgetProgressBar;