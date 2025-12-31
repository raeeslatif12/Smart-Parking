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
    <div className="py-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee per 24 Hours ($)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lost Token Penalty ($)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editing === category.id ? (
                        <input
                          type="number"
                          value={fees.feePer24Hours}
                          onChange={(e) =>
                            handleChange("feePer24Hours", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          step="0.01"
                          required
                        />
                      ) : (
                        `${category.feePer24Hours.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editing === category.id ? (
                        <input
                          type="number"
                          value={fees.lostTokenPenalty}
                          onChange={(e) =>
                            handleChange("lostTokenPenalty", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          step="0.01"
                          required
                        />
                      ) : (
                        `${category.lostTokenPenalty.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editing === category.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(category.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(category.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
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
  );
};

export default FeeManagementPage;
