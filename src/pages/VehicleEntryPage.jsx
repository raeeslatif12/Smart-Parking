import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addInVehicle } from "../store/vehiclesSlice";
import { addAlert } from "../store/alertsSlice";
import { toast } from "react-toastify";

const VehicleEntryPage = () => {
  const categories = useSelector((state) => state.categories);
  const slots = useSelector((state) => state.slots);
  const inVehicles = useSelector((state) => state.vehicles.inVehicles);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    regNumber: "",
    company: "",
    category: "",
    ownerName: "",
    contact: "",
    slotId: "",
  });
  const [duplicateError, setDuplicateError] = useState("");

  const getAvailableSlots = () => {
    if (!formData.category) return [];
    
    const requiredType = formData.category.toLowerCase().includes("bike") ? "Bike" : "Car";
    
    return slots.filter(slot => {
      const isTypeMatch = slot.type === "Both" || slot.type === requiredType;
      const isAvailable = slot.status === "Available";
      const hasCapacity = slot.used < slot.capacity;
      return isTypeMatch && isAvailable && hasCapacity;
    });
  };

  const availableSlots = getAvailableSlots();
  const hasEnabledSlot = availableSlots.some(s => s.used < s.capacity);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "regNumber") {
      setDuplicateError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.regNumber.trim()) {
      toast.error("Registration Number is required");
      return;
    }
    if (!formData.category) {
      toast.error("Vehicle category is required");
      return;
    }
    if (availableSlots.length === 0) {
      dispatch(addAlert({ type: 'critical', message: "No parking slot available for this vehicle type" }));
      toast.error("No parking slot available for this vehicle type");
      return;
    }
    if (!formData.slotId) {
      toast.error("Please select a slot");
      return;
    }
    if (!formData.ownerName.trim()) {
      toast.error("Owner name is required");
      return;
    }
    if (!formData.contact.trim()) {
      toast.error("Owner contact is required");
      return;
    }

    if (!(formData.regNumber.trim() && formData.category && formData.slotId)) {
      toast.error("Please fill all required fields!");
      return;
    }

    const isDuplicate = inVehicles.some(v => v.regNumber.toLowerCase() === formData.regNumber.trim().toLowerCase());
    if (isDuplicate) {
      setDuplicateError("This vehicle is already parked");
      return;
    }

    if (true) {
      const selectedSlot = slots.find(s => s.id === parseInt(formData.slotId));
      if (!selectedSlot || selectedSlot.used >= selectedSlot.capacity) {
        toast.error("No slot available");
        return;
      }
      const vehicleData = {
        regNumber: formData.regNumber.trim(),
        company: formData.company.trim(),
        category: formData.category,
        ownerName: formData.ownerName.trim(),
        contact: formData.contact.trim(),
        slotId: parseInt(formData.slotId),
        slot: selectedSlot ? selectedSlot.name : "Unknown",
      };
      
      dispatch(addInVehicle(vehicleData));
      toast.success("Vehicle added successfully!");
      setFormData({
        regNumber: "",
        company: "",
        category: "",
        ownerName: "",
        contact: "",
        slotId: "",
      });
    } else {
      toast.error("Please fill all required fields!");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vehicle Entry</h1>
          <p className="text-gray-600 mt-2 font-medium">Register a new vehicle for parking</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-gray-100/80">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
              Vehicle Information
            </h2>
            <p className="text-gray-600 text-sm mt-1 font-medium">Please fill in all required details</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <label
                    htmlFor="regNumber"
                    className="block text-sm font-bold text-gray-900 tracking-wide"
                  >
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    id="regNumber"
                    name="regNumber"
                    value={formData.regNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                    placeholder="LOL-1869"
                    required
                  />
                  {duplicateError && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {duplicateError}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="company"
                    className="block text-sm font-bold text-gray-900 tracking-wide"
                  >
                    Vehicle Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                    placeholder="Tesla"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="category"
                    className="block text-sm font-bold text-gray-900 tracking-wide"
                  >
                    Vehicle Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value, slotId: "" });
                    }}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 font-medium shadow-sm hover:shadow-md appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="slotId"
                    className="block text-sm font-bold text-gray-900 tracking-wide"
                  >
                    Select Parking Slot *
                  </label>
                  <select
                    id="slotId"
                    name="slotId"
                    value={formData.slotId}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm hover:shadow-md appearance-none"
                    required
                    disabled={!formData.category}
                  >
                    <option value="">
                      {!formData.category
                        ? "Select Category First"
                        : availableSlots.length === 0
                          ? "No slot available"
                          : "Select Slot"}
                    </option>
                    {availableSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.name} (Available: {slot.capacity - slot.used})
                      </option>
                    ))}
                  </select>
                  {!formData.category && (
                    <p className="text-xs text-gray-500 mt-1 font-medium flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Please select a vehicle category first
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="ownerName"
                    className="block text-sm font-bold text-gray-900 tracking-wide"
                  >
                    Owner's Full Name *
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="contact"
                    className="block text-sm font-bold text-gray-900 tracking-wide"
                  >
                    Owner's Contact *
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!duplicateError}
                  className={`px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 w-full sm:w-auto`}
                >
                  <span>Register Vehicle</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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

export default VehicleEntryPage;
