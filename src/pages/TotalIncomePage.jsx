import { useSelector } from "react-redux";
import { useState } from "react";

const TotalIncomePage = () => {
  const { totalIncome, totalExpenses, netProfit } = useSelector((state) => state.parking);
  const { outVehicles } = useSelector((state) => state.vehicles);
  const lostTokenVehicles = useSelector((state) => state.lostToken);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const getIncomeForDate = (date) => {
    const outIncome = outVehicles
      .filter((v) => v.outTime && v.outTime.split("T")[0] === date)
      .reduce((sum, v) => sum + (v.totalCharge || 0), 0);
    const lostIncome = lostTokenVehicles
      .filter((v) => v.outTime && v.outTime.split("T")[0] === date)
      .reduce((sum, v) => sum + (v.penaltyAmount || 0), 0);
    return outIncome + lostIncome;
  };

  const today = new Date().toISOString().split("T")[0];
  const previousDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const selectedIncome = getIncomeForDate(selectedDate);
  const todayIncome = getIncomeForDate(today);
  const previousIncome = getIncomeForDate(previousDay);

  return (
    <div className="py-6 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Income Summary</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600">Total Income</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${Math.round(totalIncome)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-700">
                  ${Math.round(totalExpenses)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600">Net Profit</p>
                <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-gray-900" : "text-gray-700"}`}>
                  ${Math.round(netProfit)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Income by Date</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Selected Date Income</p>
              <p className="text-2xl font-bold text-gray-900">${Math.round(selectedIncome)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Today's Income</p>
              <p className="text-2xl font-bold text-gray-900">${Math.round(todayIncome)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Previous Day Income</p>
              <p className="text-2xl font-bold text-gray-900">${Math.round(previousIncome)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalIncomePage;
