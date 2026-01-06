import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSlotType } from "../store/slotTypesSlice";
import { toast } from "react-toastify";

const AddSlotTypePage = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(addSlotType({ name: name.trim() }));
      toast.success("Slot type added successfully!");
      navigate("/dashboard/slot-types");
    } else {
      toast.error("Please enter a slot type name!");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/slot-types");
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#0f172a]">Add Slot Type</h1>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-8 max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="slotTypeName"
                className="block text-sm font-medium text-[#64748b] mb-2"
              >
                Slot Type Name
              </label>
              <input
                type="text"
                id="slotTypeName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc] transition-all duration-200"
                placeholder="e.g., Car, Bike, VIP"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-[#e5e7eb] rounded-lg shadow-sm text-sm font-medium text-[#64748b] bg-white hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155dfc] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#155dfc] hover:bg-[#0d4ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155dfc] transition-all duration-200"
              >
                Add Slot Type
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSlotTypePage;