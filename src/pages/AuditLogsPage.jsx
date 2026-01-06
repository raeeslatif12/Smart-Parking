import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaCog,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSearch
} from "react-icons/fa";

const AuditLogsPage = () => {
  const logs = useSelector((state) => state.audit.logs);
  const user = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [adminFilter, setAdminFilter] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = !searchTerm ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
      const matchesAction = !actionFilter || log.action === actionFilter;
      const matchesAdmin = !adminFilter || log.adminName === adminFilter;

      return matchesSearch && matchesDate && matchesAction && matchesAdmin;
    });
  }, [logs, searchTerm, dateFilter, actionFilter, adminFilter]);

  const uniqueActions = [...new Set(logs.map(log => log.action))];
  const uniqueAdmins = [...new Set(logs.map(log => log.adminName))];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <FaCog className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Audit Logs</h1>
          <p className="text-gray-600 font-medium">Track all admin actions and system events</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent focus:bg-white transition-colors"
                />
              </div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="block px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent focus:bg-white transition-colors"
              >
                <option value="">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                className="block px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent focus:bg-white transition-colors"
              >
                <option value="">All Admins</option>
                {uniqueAdmins.map(admin => (
                  <option key={admin} value={admin}>{admin}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Admin</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Target</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#155dfc] text-white rounded-lg flex items-center justify-center text-xs font-bold mr-3">
                            {log.adminName.charAt(0).toUpperCase()}
                          </div>
                          {log.adminName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.target}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          log.targetType === 'Vehicle' ? 'bg-blue-100 text-blue-800' :
                          log.targetType === 'Slot' ? 'bg-green-100 text-green-800' :
                          log.targetType === 'Admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.targetType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          {getStatusIcon(log.status)}
                          <span className="ml-2 capitalize">{log.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FaExclamationTriangle className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No logs found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {logs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center mt-6">
            <FaExclamationTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
            <p className="text-gray-500">Audit logs will appear here as admin actions are performed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;