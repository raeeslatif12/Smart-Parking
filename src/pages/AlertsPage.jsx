import { useSelector, useDispatch } from "react-redux";
import { markRead, dismissAlert, removeAlert, clearAlerts } from "../store/alertsSlice";
import { FaTimes } from "react-icons/fa";

const AlertsPage = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alerts || []);

  const handleMarkRead = (id) => {
    dispatch(markRead(id));
  };

  const handleDismiss = (id) => {
    dispatch(dismissAlert(id));
  };

  const handleRemove = (id) => {
    dispatch(removeAlert(id));
  };

  const handleClear = () => {
    if (window.confirm("Clear all alerts?")) {
      dispatch(clearAlerts());
    }
  };

  const colorForType = (t) => {
    if (t === "critical") return "bg-red-100 text-red-700";
    if (t === "warning") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#0f172a]">Alerts</h1>
          <div className="flex items-center space-x-3">
            <button onClick={handleClear} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">Clear All</button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gradient-to-r from-[#155dfc]/10 to-[#0d4ae8]/10 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">#</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {alerts.map((a, idx) => (
                  <tr key={a.id} className={`${a.status === 'dismissed' ? 'opacity-60' : ''} hover:bg-[#155dfc]/5 transition-all duration-200 group`}>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorForType(a.type)}`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">{a.message}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">{new Date(a.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">{a.status}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleMarkRead(a.id)} className="bg-gradient-to-r from-[#155dfc] to-[#0d4ae8] text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">Mark Read</button>
                        <button onClick={() => handleDismiss(a.id)} className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">Dismiss</button>
                        <button onClick={() => handleRemove(a.id)} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center"><FaTimes className="mr-2"/> Remove</button>
                      </div>
                    </td>
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

export default AlertsPage;
