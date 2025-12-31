import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { moveToOutVehicle } from "../store/vehiclesSlice";
import { updateStats } from "../store/parkingSlice";
import { calculateTotalFee } from "../utils/feeCalculator";
import { toast } from "react-toastify";

const ManageIncomingVehiclePage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inVehicles = useSelector((state) => state.vehicles.inVehicles);
  const stats = useSelector((state) => state.parking);
  const categories = useSelector((state) => state.categories);
  const vehicle = inVehicles.find((v) => v.id === parseInt(vehicleId));

  const [remarks, setRemarks] = useState("");
  const [isOutgoing, setIsOutgoing] = useState(true);

  useEffect(() => {
    if (!vehicle) {
      navigate("/dashboard/in-vehicles");
    } else {
      const savedData = localStorage.getItem(`manageIncoming_${vehicleId}`);
      if (savedData) {
        const { remarks: savedRemarks } = JSON.parse(savedData);
        setRemarks(savedRemarks || "");
      }
    }
  }, [vehicle, navigate, vehicleId]);

  useEffect(() => {
    if (vehicleId) {
      localStorage.setItem(
        `manageIncoming_${vehicleId}`,
        JSON.stringify({ remarks })
      );
    }
  }, [remarks, vehicleId]);

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOutgoing) {
      const category = categories.find((cat) => cat.name === vehicle.category);
      const feePer24Hours = category ? category.feePer24Hours : 10;
      const totalCharge = calculateTotalFee(
        vehicle.entryTime,
        new Date().toISOString(),
        feePer24Hours
      );
      dispatch(moveToOutVehicle({ id: vehicle.id, totalCharge, remarks }));
      dispatch(
        updateStats({
          totalVehicles: stats.totalVehicles,
          vehiclesIn: stats.vehiclesIn - 1,
          vehiclesOut: stats.vehiclesOut + 1,
          parkingWithin24hrs: stats.parkingWithin24hrs,
          totalIncome: stats.totalIncome + totalCharge,
        })
      );
      localStorage.removeItem(`manageIncoming_${vehicleId}`);
      navigate("/dashboard/in-vehicles");
      toast.success("Vehicle checked out successfully!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="py-6 min-h-screen  from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Incoming Vehicle
          </h1>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Registration Number
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {vehicle.regNumber}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {vehicle.company}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {vehicle.category}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parking Number
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {vehicle.slot}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle IN Time
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {formatDate(vehicle.entryTime)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Owned By
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {vehicle.ownerName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Owner Contact
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {vehicle.contact}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Status
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    Vehicle In
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Charge
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {(() => {
                      const category = categories.find(
                        (cat) => cat.name === vehicle.category
                      );
                      const feePer24Hours = category
                        ? category.feePer24Hours
                        : 10;
                      return calculateTotalFee(
                        vehicle.entryTime,
                        new Date().toISOString(),
                        feePer24Hours
                      ).toFixed(2);
                    })()}
                    $
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    Outgoing
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isOutgoing}
                      onChange={(e) => setIsOutgoing(e.target.checked)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Outgoing Vehicle
                    </span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="remarks"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter remarks"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/lost-token/${vehicleId}`)}
                  className="px-8 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Lost Token
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Submit for Outgoing
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageIncomingVehiclePage;
