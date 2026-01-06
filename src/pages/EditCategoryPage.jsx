import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateCategory } from "../store/categoriesSlice";
import { toast } from "react-toastify";

const EditCategoryPage = () => {
  const { id } = useParams();
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const category = categories.find((cat) => cat.id == id);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(updateCategory({ id: parseInt(id), name: name.trim() }));
      toast.success("Category updated successfully!");
      navigate("/dashboard/vehicle-categories");
    } else {
      toast.error("Please enter a category name!");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/vehicle-categories");
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="py-6 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
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
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;
