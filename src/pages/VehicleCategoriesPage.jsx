import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteCategory } from "../store/categoriesSlice";

const VehicleCategoriesPage = () => {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));
  };

  return (
    <div className="py-4 sm:py-6 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Vehicle Categories
          </h1>
          <Link
            to="/dashboard/add-category"
            className="bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto"
          >
            Add Category
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gradient-to-r from-[#155dfc]/10 to-[#0d4ae8]/10 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Vehicle Categories
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider hidden sm:table-cell">
                    Published On
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {categories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-[#155dfc]/5 transition-all duration-200 group">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base">{category.name}</span>
                        <span className="text-gray-500 text-xs sm:hidden">
                          {category.publishedOn}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium hidden sm:table-cell">
                      {category.publishedOn}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link
                          to={`/dashboard/edit-category/${category.id}`}
                          className="bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto"
                        >
                          Update
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {categories.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">
                No categories found. Add a new category to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCategoriesPage;
