import { useSelector, useDispatch } from "react-redux";
import { updateSlot, deleteSlot, reserveSlot, releaseSlot, holdSlot, unholdSlot } from "../store/slotsSlice";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaMapMarkedAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const SlotManagementPage = () => {
  const dispatch = useDispatch();
  const slots = useSelector((state) => state.slots);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      dispatch(deleteSlot(id));
      toast.success("Slot deleted successfully");
    }
  };

  const handleReserve = (id) => {
    dispatch(reserveSlot(id));
    toast.success("Slot reserved successfully");
  };

  const handleRelease = (id) => {
    dispatch(releaseSlot(id));
    toast.success("Slot released successfully");
  };

  const handleHold = (id) => {
    dispatch(holdSlot(id));
    toast.success("Slot held successfully");
  };

  const handleUnhold = (id) => {
    dispatch(unholdSlot(id));
    toast.success("Slot unheld successfully");
  };

  const handleEdit = (slot) => {
    // For now, since edit is inline, but user didn't specify, keep as is or remove.
    // The user said only existing slots, so perhaps remove edit, but to keep functionality, keep.
    // But the requirements say "only the existing slots", so maybe remove edit.
    // The columns include Actions, so keep edit and delete.
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Slot Management</h1>
            <p className="text-gray-600 mt-1">Manage parking slots and their availability</p>
          </div>
          <Link
            to="../add-slot"
            className="bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center"
          >
            <FaPlus className="w-5 h-5 mr-2" />
            Add Slot
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
          <div className="max-h-[600px] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Slot Name
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Slot Type
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Total Capacity
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Used Capacity
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Available Capacity
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {slots.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#155dfc]/10 to-[#0d4ae8]/5 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <FaMapMarkedAlt className="w-10 h-10 text-[#155dfc]/60" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No slots defined yet</h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
                        Create your first parking slot to get started with vehicle management.
                      </p>
                    </td>
                  </tr>
                ) : (
                  slots.map((slot) => {
                    const available = slot.capacity - slot.used;
                    const isFull = available <= 0;
                    return (
                      <tr key={slot.id} className="hover:bg-[#155dfc]/5 transition-all duration-200 group">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                          {slot.name}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {slot.type}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {slot.capacity}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {slot.used}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {available}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              slot.status === "Reserved" ? "bg-red-100 text-red-800" :
                              slot.status === "Hold" ? "bg-amber-100 text-amber-800" :
                              slot.status === "Available" && slot.used === slot.capacity ? "bg-gray-100 text-gray-800" :
                              "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {slot.status === "Available" && slot.used === slot.capacity
                              ? "Full"
                              : slot.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {slot.status === "Available" && (
                            <>
                              <button
                                onClick={() => handleReserve(slot.id)}
                                className="text-[#155dfc] hover:text-white hover:bg-[#155dfc] px-3 py-1.5 rounded-xl transition-all duration-300 font-medium hover:shadow-md"
                                title="Reserve Slot"
                              >
                                Reserve
                              </button>
                              <button
                                onClick={() => handleHold(slot.id)}
                                className="text-amber-600 hover:text-white hover:bg-amber-600 px-3 py-1.5 rounded-xl transition-all duration-300 font-medium hover:shadow-md"
                                title="Hold Slot"
                              >
                                Hold
                              </button>
                            </>
                          )}
                          {slot.status === "Reserved" && (
                            <button
                              onClick={() => handleRelease(slot.id)}
                              className="text-emerald-600 hover:text-white hover:bg-emerald-600 px-3 py-1.5 rounded-xl transition-all duration-300 font-medium hover:shadow-md"
                              title="Release Slot"
                            >
                              Release
                            </button>
                          )}
                          {slot.status === "Hold" && (
                            <button
                              onClick={() => handleUnhold(slot.id)}
                              className="text-purple-600 hover:text-white hover:bg-purple-600 px-3 py-1.5 rounded-xl transition-all duration-300 font-medium hover:shadow-md"
                              title="Unhold Slot"
                            >
                              Unhold
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className={`text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-xl transition-all duration-300 font-medium hover:shadow-md ${
                              slot.used > 0 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={slot.used > 0}
                            title={
                              slot.used > 0
                                ? "Cannot delete slot with vehicles"
                                : "Delete Slot"
                            }
                          >
                            <FaTrash
                              className={`w-4 h-4 ${
                                slot.used > 0 ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotManagementPage;
