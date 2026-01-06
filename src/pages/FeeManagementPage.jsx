import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCategoryFees } from "../store/categoriesSlice";
import { toast } from "react-toastify";

const FeeManagementPage = () => {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);
  const [fees, setFees] = useState({});

  const handleEdit = (id) => {
    const category = categories.find((cat) => cat.id === id);
    setFees({
      feePer24Hours: category.feePer24Hours,
      lostTokenPenalty: category.lostTokenPenalty,
      extraHourRate: category.extraHourRate,
    });
    setEditing(id);
  };

  const handleSave = (id) => {
    dispatch(updateCategoryFees({ id, ...fees }));
    toast.success("Fees updated successfully!");
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleChange = (field, value) => {
    setFees((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-6 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gradient-to-r from-[#155dfc]/10 to-[#0d4ae8]/10 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Fee per 24 Hours ($)
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Lost Token Penalty ($)
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Extra Hour Rate ($)
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-[#155dfc]/5 transition-all duration-200 group">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {editing === category.id ? (
                          <input
                            type="number"
                            value={fees.feePer24Hours}
                            onChange={(e) =>
                              handleChange("feePer24Hours", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all duration-200"
                            step="0.01"
                            required
                          />
                        ) : (
                          <span className="text-lg font-bold text-green-600">${category.feePer24Hours.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {editing === category.id ? (
                          <input
                            type="number"
                            value={fees.lostTokenPenalty}
                            onChange={(e) =>
                              handleChange("lostTokenPenalty", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all duration-200"
                            step="0.01"
                            required
                          />
                        ) : (
                          <span className="text-lg font-bold text-red-600">${category.lostTokenPenalty.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {editing === category.id ? (
                          <input
                            type="number"
                            value={fees.extraHourRate}
                            onChange={(e) =>
                              handleChange("extraHourRate", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all duration-200"
                            step="0.01"
                            required
                          />
                        ) : (
                          <span className="text-lg font-bold text-orange-600">${category.extraHourRate.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        {editing === category.id ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleSave(category.id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(category.id)}
                            className="bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Edit
                          </button>
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
    </div>
  );
};

export default FeeManagementPage;
