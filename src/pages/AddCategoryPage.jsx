import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../store/categoriesSlice";
import { toast } from "react-toastify";

const AddCategoryPage = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(addCategory({ name: name.trim() }));
      toast.success("Category added successfully!");
      navigate("/dashboard/vehicle-categories");
    } else {
      toast.error("Please enter a category name!");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/vehicle-categories");
  };

  return (
    <div className="py-6 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add Category</h1>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
