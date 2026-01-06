import { useSelector, useDispatch } from "react-redux";
import { addExpenseType, updateExpenseType, deleteExpenseType } from "../store/expenseTypesSlice";
import { useState } from "react";
import { toast } from "react-toastify";

const ExpenseTypesPage = () => {
  const dispatch = useDispatch();
  const expenseTypes = useSelector(state => state.expenseTypes);
  const expenses = useSelector(state => state.expenses);
  const [newType, setNewType] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (newType.trim()) {
      dispatch(addExpenseType({ name: newType.trim() }));
      setNewType('');
      toast.success('Expense type added');
    }
  };

  const handleEdit = (type) => {
    setEditing(type.id);
    setEditName(type.name);
  };

  const handleUpdate = () => {
    if (editName.trim()) {
      dispatch(updateExpenseType({ id: editing, name: editName.trim() }));
      setEditing(null);
      toast.success('Expense type updated');
    }
  };

  const handleDelete = (id) => {
    const type = expenseTypes.find(t => t.id === id);
    const inUse = expenses.some(e => e.type === type.name);
    if (inUse) {
      toast.error('Cannot delete expense type in use');
      return;
    }
    dispatch(deleteExpenseType(id));
    toast.success('Expense type deleted');
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0f172a]">Expense Types Management</h1>
        </div>
        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="px-3 py-2 border border-[#e5e7eb] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] transition-all duration-200"
              placeholder="New expense type"
            />
            <button onClick={handleAdd} className="px-4 py-2 bg-[#155dfc] text-white rounded-lg shadow-sm hover:bg-[#0d4ae8] transition-all duration-200">Add</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
          <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#0f172a]">Name</th>
                <th className="px-6 py-3 text-right text-sm font-bold text-[#0f172a]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {expenseTypes.map(type => (
                <tr key={type.id} className="hover:bg-[#f1f5ff]">
                  <td className="px-6 py-4 text-sm text-[#0f172a]">
                    {editing === type.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-[#e5e7eb] rounded px-2 py-1"
                      />
                    ) : (
                      type.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    {editing === type.id ? (
                      <>
                        <button onClick={handleUpdate} className="text-[#155dfc] hover:text-[#0d4ae8] mr-2">Save</button>
                        <button onClick={() => setEditing(null)} className="text-[#64748b] hover:text-[#155dfc]">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(type)} className="text-[#155dfc] hover:text-[#0d4ae8] mr-2">Edit</button>
                        <button onClick={() => handleDelete(type.id)} className="text-[#155dfc] hover:text-[#0d4ae8]">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTypesPage;