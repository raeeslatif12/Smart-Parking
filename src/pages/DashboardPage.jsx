import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const {
    totalVehicles,
    vehiclesIn,
    vehiclesOut,
    parkingWithin24hrs,
    totalIncome,
    incomeHistory,
  } = useSelector((state) => state.parking);

  const pieData = [
    { name: "Vehicles In", value: vehiclesIn },
    { name: "Vehicles Out", value: vehiclesOut },
    { name: "Parking Within 24hrs", value: parkingWithin24hrs },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="py-4 sm:py-6 min-h-screen  from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Total Vehicles
                    </dt>
                    <dd className="text-xl sm:text-2xl font-bold text-gray-900">
                      {totalVehicles}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Vehicles IN
                    </dt>
                    <dd className="text-xl sm:text-2xl font-bold text-gray-900">
                      {vehiclesIn}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Vehicles OUT
                    </dt>
                    <dd className="text-xl sm:text-2xl font-bold text-gray-900">
                      {vehiclesOut}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Total Income
                    </dt>
                    <dd className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${totalIncome}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vehicle Statistics
          </h2>
          {pieData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
