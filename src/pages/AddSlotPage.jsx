import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSlot } from "../store/slotsSlice";
import { toast } from "react-toastify";

const AddSlotPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const slots = useSelector((state) => state.slots);
  const slotTypes = useSelector((state) => state.slotTypes);

  const [formData, setFormData] = useState({
    name: "",
    type: "Car",
    capacity: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.capacity <= 0) {
      toast.error("Please provide valid slot details");
      return;
    }

    if (slots.some(slot => slot.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error("Slot name already exists");
      return;
    }

    dispatch(addSlot(formData));
    toast.success("Slot added successfully");
    navigate("/dashboard/slots");
  };

  const handleCancel = () => {
    navigate("/dashboard/slots");
  };

  return (
    <div className="py-6 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Slot</h1>
          <p className="text-gray-600 mt-2 font-medium">Create a new parking slot for vehicle management</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-gray-100/80">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
              Slot Details
            </h2>
            <p className="text-gray-600 text-sm mt-1 font-medium">Fill in the information below</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-gray-900 tracking-wide"
                >
                  Slot Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                  placeholder="e.g., Slot A"
                  required
                />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="type"
                  className="block text-sm font-bold text-gray-900 tracking-wide"
                >
                  Slot Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 font-medium shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="">Select Slot Type</option>
                  {slotTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="capacity"
                  className="block text-sm font-bold text-gray-900 tracking-wide"
                >
                  Capacity *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                  placeholder="Enter capacity"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Add Slot</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSlotPage;