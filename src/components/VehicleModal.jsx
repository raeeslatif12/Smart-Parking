import { useState, useEffect } from "react";

const VehicleModal = ({ isOpen, onClose, onSubmit, vehicle, categories }) => {
  const [formData, setFormData] = useState(() => ({
    regNumber: vehicle?.regNumber || "",
    company: vehicle?.company || "",
    category: vehicle?.category || "",
    ownerName: vehicle?.ownerName || "",
    contact: vehicle?.contact || "",
  }));

  useEffect(() => {
    setFormData({
      regNumber: vehicle?.regNumber || "",
      company: vehicle?.company || "",
      category: vehicle?.category || "",
      ownerName: vehicle?.ownerName || "",
      contact: vehicle?.contact || "",
    });
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.regNumber.trim() &&
      formData.company.trim() &&
      formData.category &&
      formData.ownerName.trim() &&
      formData.contact.trim()
    ) {
      onSubmit({ id: vehicle.id, ...formData });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity backdrop-blur-sm" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-900/60"
            onClick={onClose}
          ></div>
        </div>
        <div className="inline-block align-bottom card text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full fade-in">
          <form onSubmit={handleSubmit}>
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Update Vehicle
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="regNumber"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Registration Number
                      </label>
                      <input
                        type="text"
                        id="regNumber"
                        name="regNumber"
                        value={formData.regNumber}
                        onChange={handleChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-input w-full"
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
                    <div>
                      <label
                        htmlFor="ownerName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Owner Name
                      </label>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="contact"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Contact
                      </label>
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="bg-gray-50/80 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
