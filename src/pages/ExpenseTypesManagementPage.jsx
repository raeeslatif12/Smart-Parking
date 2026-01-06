import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteExpenseType } from "../store/expenseTypesSlice";
import { toast } from "react-toastify";

const ExpenseTypesManagementPage = () => {
  const expenseTypes = useSelector((state) => state.expenseTypes);
  const expenses = useSelector((state) => state.expenses);
  const dispatch = useDispatch();

  const handleDeleteExpenseType = (id, name) => {
    const isInUse = expenses.some(expense => expense.type === name);
    if (isInUse) {
      toast.error(`Cannot delete expense type "${name}" as it is used in existing expenses.`);
      return;
    }
    dispatch(deleteExpenseType(id));
    toast.success("Expense type deleted successfully");
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#0f172a]">Expense Types Management</h1>
          <Link
            to="../add-expense-type"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#155dfc] hover:bg-[#0d4ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155dfc] transition-all duration-200"
          >
            Add Expense Type
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
          <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                    Expense Type Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#e5e7eb]">
                {expenseTypes.map((type, index) => (
                  <tr key={type.id} className="hover:bg-[#f1f5ff]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0f172a]">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748b]">
                      {type.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                      <Link
                        to={`../edit-expense-type/${type.id}`}
                        className="text-[#155dfc] hover:text-[#0d4ae8]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteExpenseType(type.id, type.name)}
                        className="text-[#155dfc] hover:text-[#0d4ae8]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenseTypes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#94a3b8]">No expense types found. Add a new expense type to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTypesManagementPage;