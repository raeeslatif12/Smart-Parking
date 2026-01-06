import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const LostTokenPage = () => {
  const lostTokenVehicles = useSelector((state) => state.lostToken);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = lostTokenVehicles.filter(
    (vehicle) =>
      vehicle.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.idCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="py-6 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Lost Token Vehicles
          </h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Vehicle No</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Parking Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Slot</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID Card Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Penalty Amount</th>
                  <th className="hidden sm:px-6 sm:py-3 sm:text-left sm:text-sm sm:font-semibold sm:text-gray-700 sm:uppercase sm:tracking-wider">Exit Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.length === 0
                  ? [
                      <tr key="no-data">
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No lost token vehicles found
                        </td>
                      </tr>,
                    ]
                  : filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.regNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{vehicle.parkingNumber || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{vehicle.slot || ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.idCardNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.penaltyAmount}</td>
                        <td className="hidden sm:px-6 sm:py-4 sm:whitespace-nowrap sm:text-sm sm:text-gray-500">{formatDate(vehicle.outTime)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Link to={`/dashboard/out-vehicle-details/${vehicle.id}`} className="text-blue-600 hover:text-blue-900">View</Link></td>
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

export default LostTokenPage;
