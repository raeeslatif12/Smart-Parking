import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const OutVehicleDetailsPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const outVehicles = useSelector((state) => state.vehicles.outVehicles);
  const vehicle = outVehicles.find((v) => v.id === parseInt(vehicleId));

  useEffect(() => {
    if (!vehicle) {
      navigate("/dashboard/out-vehicles");
    }
  }, [vehicle, navigate]);

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="py-6 min-h-screen  from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
          <button
            onClick={() => navigate("/dashboard/out-vehicles")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Out Vehicles
          </button>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Registration Number
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.regNumber || ""}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.company || ""}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.category || ""}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Number
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.slot || ""}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle IN Time
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {formatDate(vehicle.entryTime)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle OUT Time
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {formatDate(vehicle.outTime)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Owned By
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.ownerName || ""}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Owner Contact
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.contact || ""}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.status || "Out"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Charge
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.totalCharge || 0}
                </div>
              </div>
              {vehicle.status === "Out – Lost Token" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card Number
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                      {vehicle.idCardNumber || ""}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penalty Amount
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                      {vehicle.penaltyAmount || 0}
                    </div>
                  </div>
                  {vehicle.idCardImage && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Card Image
                      </label>
                      <img
                        src={vehicle.idCardImage}
                        alt="ID Card"
                        className="w-32 h-20 object-cover border rounded"
                      />
                    </div>
                  )}
                </>
              )}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {vehicle.remarks || "No remarks"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutVehicleDetailsPage;
