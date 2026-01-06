import { useState, useEffect } from "react";

const CategoryModal = ({ isOpen, onClose, onSubmit, initialName = "" }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity backdrop-blur-xl" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={onClose}
          ></div>
        </div>
        <div className="inline-block align-bottom bg-white text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full rounded-3xl border border-gray-100/80 fade-in">
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-slate-50 to-white px-8 pt-8 pb-6 border-b border-gray-100/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {initialName ? "Update Category" : "Add Category"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 font-medium">
                    {initialName ? "Modify the category details" : "Create a new vehicle category"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-8 pt-6 pb-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label
                    htmlFor="categoryName"
                    className="block text-sm font-bold text-gray-900 tracking-wide"
                  >
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-[#155dfc] focus:ring-4 focus:ring-[#155dfc]/10 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-sm hover:shadow-md"
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50/80 px-8 py-6 flex justify-end space-x-4 border-t border-gray-100/80">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 hover:shadow-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>{initialName ? "Update" : "Add"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
