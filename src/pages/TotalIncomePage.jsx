import { useSelector } from "react-redux";

const TotalIncomePage = () => {
  const totalIncome = useSelector((state) => state.parking.totalIncome);

  return (
    <div className="py-6 min-h-screen  from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Total Income</h1>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">
                Total Income: ${totalIncome.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalIncomePage;
