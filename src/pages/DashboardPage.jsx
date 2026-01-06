import { useSelector, useDispatch } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FaCar, FaArrowUp, FaArrowDown, FaDollarSign, FaParking, FaBell } from "react-icons/fa";
import { addAlert, removeAlert } from "../store/alertsSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const {
    totalVehicles,
    vehiclesIn,
    vehiclesOut,
    parkingWithin24hrs,
    totalIncome,
    totalExpenses,
    netProfit,
  } = useSelector((state) => state.parking);
  const slots = useSelector((state) => state.slots);
  const { inVehicles, outVehicles } = useSelector((state) => state.vehicles);
  const lostToken = useSelector((state) => state.lostToken);
  const expenses = useSelector((state) => state.expenses);
  const alerts = useSelector((state) => state.alerts);

  const totalSlots = slots.reduce((sum, slot) => sum + slot.capacity, 0);
  const usedSlots = slots.reduce((sum, slot) => sum + slot.used, 0);
  const availableSlots = totalSlots - usedSlots;

  const today = new Date().toISOString().split('T')[0];
  const todayIn = inVehicles.filter(v => v.entryTime.split('T')[0] === today).length;
  const todayOut = outVehicles.filter(v => v.outTime.split('T')[0] === today).length + lostToken.filter(v => v.outTime.split('T')[0] === today).length;
  const todayIncome = outVehicles.filter(v => v.outTime.split('T')[0] === today).reduce((sum, v) => sum + v.totalCharge, 0) + lostToken.filter(v => v.outTime.split('T')[0] === today).reduce((sum, v) => sum + v.penaltyAmount, 0);
  const todayExpenses = expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);
  const todayNetProfit = todayIncome - todayExpenses;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const yesterdayIncome = outVehicles.filter(v => v.outTime && v.outTime.split('T')[0] === yesterdayStr).reduce((sum, v) => sum + (v.totalCharge || 0), 0) + lostToken.filter(v => v.outTime && v.outTime.split('T')[0] === yesterdayStr).reduce((sum, v) => sum + (v.penaltyAmount || 0), 0);

  if (todayIncome < yesterdayIncome && yesterdayIncome > 0) {
    dispatch(addAlert({ type: 'warning', message: "Today’s income is lower than yesterday" }));
  }
  if (todayExpenses > todayIncome) {
    dispatch(addAlert({ type: 'critical', message: "Expenses exceeded income today" }));
  }

  const pieData = [
    { name: "Vehicles In", value: vehiclesIn },
    { name: "Vehicles Out", value: vehiclesOut },
    { name: "Parking Within 24hrs", value: parkingWithin24hrs },
  ];

  const COLORS = ["#6B7280", "#9CA3AF", "#D1D5DB"];

  const stats = [
    {
      title: "Total Vehicles",
      value: totalVehicles,
      icon: FaCar,
      color: "text-[#0f172a]",
    },
    {
      title: "Vehicles IN",
      value: vehiclesIn,
      icon: FaArrowUp,
      color: "text-[#64748b]",
    },
    {
      title: "Vehicles OUT",
      value: vehiclesOut,
      icon: FaArrowDown,
      color: "text-[#64748b]",
    },
    {
      title: "Total Income",
      value: `$${Math.round(totalIncome)}`,
      icon: FaDollarSign,
      color: "text-[#0f172a]",
    },
    {
      title: "Total Expenses",
      value: `$${Math.round(totalExpenses)}`,
      icon: FaDollarSign,
      color: "text-[#64748b]",
    },
    {
      title: "Net Profit",
      value: `$${Math.round(netProfit)}`,
      icon: FaDollarSign,
      color: netProfit >= 0 ? "text-[#0f172a]" : "text-[#64748b]",
    },
    {
      title: "Slot Availability",
      value: `${availableSlots} / ${totalSlots}`,
      icon: FaParking,
      color: "text-[#0f172a]",
    },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-600 font-medium">Welcome back! Here's an overview of your parking system.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
            Today Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <p className="text-3xl font-bold text-gray-900 mb-2">{Math.round(todayIn)}</p>
              <p className="text-sm text-gray-600 font-medium mb-4">Today IN Vehicles</p>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaArrowUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <p className="text-3xl font-bold text-gray-900 mb-2">{Math.round(todayOut)}</p>
              <p className="text-sm text-gray-600 font-medium mb-4">Today OUT Vehicles</p>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaArrowDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <p className="text-3xl font-bold text-emerald-600 mb-2">${Math.round(todayIncome)}</p>
              <p className="text-sm text-gray-600 font-medium mb-4">Today Total Income</p>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <p className="text-3xl font-bold text-red-600 mb-2">${Math.round(todayExpenses)}</p>
              <p className="text-sm text-gray-600 font-medium mb-4">Today Total Expenses</p>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <p className="text-3xl font-bold text-[#155dfc] mb-2">${Math.round(todayNetProfit)}</p>
              <p className="text-sm text-gray-600 font-medium mb-4">Today Net Profit</p>
              <div className="w-12 h-12 bg-gradient-to-br from-[#155dfc] to-[#0d4ae8] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">{stat.value}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-[#155dfc]/10 to-[#0d4ae8]/5 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[#155dfc]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80 hover:shadow-2xl transition-all duration-300 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
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
                      fill={["#155dfc", "#64748b", "#94a3b8"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <FaCar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">No data available</p>
                <p className="text-sm text-gray-400 mt-1">Vehicle statistics will appear here</p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/80">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
            Alerts & Warnings
          </h2>
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-[#155dfc]/10 to-[#0d4ae8]/5 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaBell className="w-8 h-8 text-[#155dfc]/60" />
              </div>
              <p className="text-gray-600 font-medium">No alerts at this time.</p>
              <p className="text-sm text-gray-500 mt-1">All systems running smoothly</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {alerts.slice(-10).reverse().map(alert => (
                <li key={alert.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                  alert.type === 'critical' ? 'bg-red-50/80 border-red-200/60 hover:bg-red-50' :
                  alert.type === 'warning' ? 'bg-amber-50/80 border-amber-200/60 hover:bg-amber-50' :
                  'bg-gray-50/80 border-gray-200/60 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-4 shadow-sm ${
                      alert.type === 'critical' ? 'bg-red-500' :
                      alert.type === 'warning' ? 'bg-amber-500' :
                      'bg-gray-500'
                    }`}></span>
                    <span className="text-sm text-gray-800 font-medium">{alert.message}</span>
                  </div>
                  <button onClick={() => dispatch(removeAlert(alert.id))} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
