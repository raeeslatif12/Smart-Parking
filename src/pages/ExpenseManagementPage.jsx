import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteExpense, updateExpense } from "../store/expensesSlice";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExpenseManagementPage = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses);
  const expenseTypes = useSelector((state) => state.expenseTypes);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(id));
      toast.success("Expense deleted successfully");
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({ ...expense });
  };

  const handleSaveEdit = () => {
    dispatch(updateExpense(editForm));
    setEditingId(null);
    setEditForm({});
    toast.success("Expense updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all parking expenses</p>
          </div>
          <Link
            to="/dashboard/add-expense"
            className="btn-primary inline-flex items-center shadow-lg hover:shadow-xl"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add Expense
          </Link>
        </div>
        <div className="card card-hover p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Total Expenses</h2>
              <p className="text-3xl font-bold text-red-600 mt-1">${Math.round(totalExpenses)}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        <div className="table-card overflow-hidden">
          <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gradient-to-r from-[#155dfc]/10 to-[#0d4ae8]/10 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">#</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Expense Name</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Expense Type</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {expenses.map((expense, index) => (
                  <tr key={expense.id} className="hover:bg-[#155dfc]/5 transition-all duration-200 group">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      {editingId === expense.id ? (
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <span className="font-bold text-gray-900 text-base">{expense.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {editingId === expense.id ? (
                        <select
                          value={editForm.type || ""}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all duration-200"
                        >
                          {expenseTypes.map(type => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="bg-gradient-to-r from-[#155dfc]/10 to-[#0d4ae8]/10 text-[#155dfc] px-3 py-1 rounded-full text-xs font-semibold">{expense.type}</span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-red-600">
                      {editingId === expense.id ? (
                        <input
                          type="number"
                          value={editForm.amount || ""}
                          onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <span className="text-lg font-bold">${Math.round(expense.amount)}</span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {editingId === expense.id ? (
                        <input
                          type="date"
                          value={editForm.date || ""}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        expense.date
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      {editingId === expense.id ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white p-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                            title="Edit Expense"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                            title="Delete Expense"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenses.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses recorded</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Start tracking your parking expenses by adding your first expense entry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagementPage;