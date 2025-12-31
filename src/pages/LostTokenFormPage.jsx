import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { moveToLostToken } from "../store/vehiclesSlice";
import { addLostTokenVehicle } from "../store/lostTokenSlice";
import { updateStats } from "../store/parkingSlice";
import { calculateTotalFee } from "../utils/feeCalculator";
import { toast } from "react-toastify";

const LostTokenFormPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inVehicles = useSelector((state) => state.vehicles.inVehicles);
  const stats = useSelector((state) => state.parking);
  const categories = useSelector((state) => state.categories);
  const vehicle = inVehicles.find((v) => v.id === parseInt(vehicleId));

  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardImage, setIdCardImage] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!vehicle) {
      navigate("/dashboard/in-vehicles");
    } else {
      const savedData = localStorage.getItem(`lostToken_${vehicleId}`);
      if (savedData) {
        const { idCardNumber: savedIdCardNumber, remarks: savedRemarks } =
          JSON.parse(savedData);
        setIdCardNumber(savedIdCardNumber || "");
        setRemarks(savedRemarks || "");
      }
    }
  }, [vehicle, navigate, vehicleId]);

  useEffect(() => {
    if (vehicleId) {
      localStorage.setItem(
        `lostToken_${vehicleId}`,
        JSON.stringify({ idCardNumber, remarks })
      );
    }
  }, [idCardNumber, remarks, vehicleId]);

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = categories.find((cat) => cat.name === vehicle.category);
    const feePer24Hours = category ? category.feePer24Hours : 10;
    const lostTokenPenalty = category ? category.lostTokenPenalty : 50;
    const parkingFee = calculateTotalFee(
      vehicle.entryTime,
      new Date().toISOString(),
      feePer24Hours
    );
    const totalCharge = parkingFee + lostTokenPenalty;
    dispatch(
      moveToLostToken({
        id: vehicle.id,
        penaltyAmount: lostTokenPenalty,
        idCardNumber,
        idCardImage,
        remarks,
        totalCharge,
      })
    );
    const lostTokenVehicle = {
      ...vehicle,
      outTime: new Date().toISOString(),
      penaltyAmount: lostTokenPenalty,
      totalCharge,
      idCardNumber,
      idCardImage,
      remarks,
    };
    dispatch(addLostTokenVehicle(lostTokenVehicle));
    dispatch(
      updateStats({
        totalVehicles: stats.totalVehicles,
        vehiclesIn: stats.vehiclesIn - 1,
        vehiclesOut: stats.vehiclesOut + 1,
        parkingWithin24hrs: stats.parkingWithin24hrs,
        totalIncome: stats.totalIncome + totalCharge,
      })
    );
    localStorage.removeItem(`lostToken_${vehicleId}`);
    navigate("/dashboard/lost-token");
    toast.success("Lost token processed successfully!");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="py-6 min-h-screen  from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Lost Token - {vehicle.regNumber}
          </h1>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2">
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
                  <label
                    htmlFor="idCardImage"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    ID Card Image
                  </label>
                  <input
                    type="file"
                    id="idCardImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  {idCardImage && (
                    <img
                      src={idCardImage}
                      alt="ID Card"
                      className="mt-2 w-32 h-20 object-cover border rounded"
                    />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="idCardNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    ID Card Number
                  </label>
                  <input
                    type="text"
                    id="idCardNumber"
                    value={idCardNumber}
                    onChange={(e) => setIdCardNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter ID Card Number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Charge (Parking + Penalty)
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm">
                    {(() => {
                      const category = categories.find(
                        (cat) => cat.name === vehicle.category
                      );
                      const feePer24Hours = category
                        ? category.feePer24Hours
                        : 10;
                      const lostTokenPenalty = category
                        ? category.lostTokenPenalty
                        : 50;
                      const parkingFee = calculateTotalFee(
                        vehicle.entryTime,
                        new Date().toISOString(),
                        feePer24Hours
                      );
                      return (parkingFee + lostTokenPenalty).toFixed(2);
                    })()}
                    $
                  </div>
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
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostTokenFormPage;
