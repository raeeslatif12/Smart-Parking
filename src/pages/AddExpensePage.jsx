import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../store/expensesSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddExpensePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expenseTypes = useSelector(state => state.expenseTypes);
  const [formData, setFormData] = useState({
    name: "",
    type: "Electricity",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.date) {
      toast.error("Please fill all fields");
      return;
    }
    dispatch(addExpense(formData));
    toast.success("Expense added successfully");
    navigate("/dashboard/expense-management");
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Expense Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="e.g. Bijli Bill"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Expense Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-[#e5e7eb] rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[#155dfc] focus:border-[#155dfc] transition-all duration-200"
              >
                <option value="">Select Expense Type</option>
                {expenseTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/expense-management")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpensePage;