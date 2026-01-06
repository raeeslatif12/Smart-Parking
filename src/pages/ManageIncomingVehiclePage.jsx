import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { moveToOutVehicle, blockVehicle } from "../store/vehiclesSlice";
import { updateStats } from "../store/parkingSlice";
import { calculateTotalFee, getFeeBreakdown } from "../utils/feeCalculator";
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
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockReason, setBlockReason] = useState("");

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
    if (isBlocking) {
      dispatch(blockVehicle({ id: vehicle.id, blockReason, remarks }));
      localStorage.removeItem(`manageIncoming_${vehicleId}`);
      navigate("/dashboard/blocked-vehicles");
      toast.warning("Vehicle has been blocked!");
    } else if (isOutgoing) {
      const category = categories.find((cat) => cat.name === vehicle.category);
      const feePer24Hours = category ? category.feePer24Hours : 10;
      const extraHourRate = category ? category.extraHourRate : 5;
      const breakdown = getFeeBreakdown(
        vehicle.entryTime,
        new Date().toISOString(),
        feePer24Hours,
        extraHourRate
      );
      const totalCharge = breakdown.finalAmount;
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
    <div className="py-6 flex-1">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Parking Number</label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">{vehicle.parkingNumber || ""}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slot</label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">{vehicle.slot || ""}</div>
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
                    Fee Breakdown
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {(() => {
                      const category = categories.find(
                        (cat) => cat.name === vehicle.category
                      );
                      const feePer24Hours = category
                        ? category.feePer24Hours
                        : 10;
                      const extraHourRate = category
                        ? category.extraHourRate
                        : 5;
                      const breakdown = getFeeBreakdown(
                        vehicle.entryTime,
                        new Date().toISOString(),
                        feePer24Hours,
                        extraHourRate
                      );
                      return (
                        <div className="space-y-1">
                          <div>Entry Time: {breakdown.entryTime}</div>
                          <div>Exit Time: {breakdown.exitTime}</div>
                          <div>Total Duration: {breakdown.totalDuration} hours</div>
                          <div>Base Fee (24h): ${breakdown.baseFee}</div>
                          <div>Extra Hours: {breakdown.extraHours}</div>
                          <div>Extra Charges: ${breakdown.extraCharges}</div>
                          <div className="font-bold">Final Amount: ${breakdown.finalAmount}</div>
                        </div>
                      );
                    })()}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Action Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="actionType"
                        checked={isOutgoing && !isBlocking}
                        onChange={() => {
                          setIsOutgoing(true);
                          setIsBlocking(false);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Outgoing Vehicle</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="actionType"
                        checked={isBlocking}
                        onChange={() => {
                          setIsBlocking(true);
                          setIsOutgoing(false);
                        }}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Block Vehicle</span>
                    </label>
                  </div>
                </div>
                {isBlocking && (
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="blockReason"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Block Reason
                    </label>
                    <textarea
                      id="blockReason"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter reason for blocking the vehicle"
                      required={isBlocking}
                    />
                  </div>
                )}
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
                  className={`px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                    isBlocking
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {isBlocking ? "Block Vehicle" : "Submit for Outgoing"}
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
