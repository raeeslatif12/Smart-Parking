import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const InVehiclesPage = () => {
  const inVehicles = useSelector((state) => state.vehicles.inVehicles);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">In Vehicles</h1>
          <p className="text-gray-600 mt-2 font-medium">Currently parked vehicles in the system</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
          <div className="max-h-[600px] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">#</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Vehicle Details</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider hidden md:table-cell">Company</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider hidden lg:table-cell">Category</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider hidden sm:table-cell">Parking Number</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider hidden sm:table-cell">Slot</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider hidden md:table-cell">Owner</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {inVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id} className="hover:bg-[#155dfc]/5 transition-all duration-200 group">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-base">
                            {vehicle.regNumber}
                          </span>
                          <div className="text-gray-500 text-xs space-y-1 sm:hidden mt-2">
                            <div>Company: {vehicle.company}</div>
                            <div>Category: {vehicle.category}</div>
                            <div>Parking Number: {vehicle.parkingNumber}</div>
                            <div>Slot: {vehicle.slot}</div>
                            <div>Owner: {vehicle.ownerName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium hidden md:table-cell">
                        {vehicle.company}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium hidden lg:table-cell">
                        {vehicle.category}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium hidden sm:table-cell">
                        {vehicle.parkingNumber || "—"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium hidden sm:table-cell">
                        {vehicle.slot}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium hidden md:table-cell">
                        {vehicle.ownerName}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        <Link
                          to={`/dashboard/manage-incoming/${vehicle.id}`}
                          className="bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inVehicles.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#155dfc]/10 to-[#0d4ae8]/5 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <svg className="w-10 h-10 text-[#155dfc]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No vehicles currently parked</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
                    All parking slots are available. Vehicles will appear here once they check in.
                  </p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default InVehiclesPage;
