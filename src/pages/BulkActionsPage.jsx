import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaCar,
  FaMapMarkerAlt,
  FaUserShield,
  FaExclamationTriangle
} from "react-icons/fa";
import {
  deleteVehicle,
  blockVehicle,
  unblockVehicle
} from "../store/vehiclesSlice";
import {
  deleteSlot,
  reserveSlot,
  releaseSlot
} from "../store/slotsSlice";
import {
  deleteAdmin,
  updateAdmin,
  blockAdmin,
  unblockAdmin,
} from "../store/adminsSlice";

const BulkActionsPage = () => {
  const dispatch = useDispatch();
  const { inVehicles, outVehicles } = useSelector((state) => state.vehicles);
  const slots = useSelector((state) => state.slots);
  const adminsAll = useSelector((state) => state.admins.list);
  const admins = adminsAll.filter(a => (a.role === 'admin' || a.role === 'super_admin') && a.status !== 'blocked');
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState('vehicles');
  const [selectedItems, setSelectedItems] = useState([]);

  const vehicles = [...inVehicles, ...outVehicles];

  const tabs = [
    { id: 'vehicles', label: 'Vehicles', icon: FaCar, count: vehicles.length },
    { id: 'slots', label: 'Slots', icon: FaMapMarkerAlt, count: slots.length },
    { id: 'admins', label: 'Admins', icon: FaUserShield, count: admins.length }
  ];

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'vehicles': return vehicles;
      case 'slots': return slots;
      case 'admins': return admins;
      default: return [];
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(getCurrentItems().map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      toast.warning('Please select items first');
      return;
    }

    // perform actions immediately without confirmation
    selectedItems.forEach((itemId) => {
      switch (action) {
        case 'delete':
          if (activeTab === 'vehicles') {
            dispatch(deleteVehicle(itemId));
          } else if (activeTab === 'slots') {
            dispatch(deleteSlot(itemId));
          } else if (activeTab === 'admins') {
            dispatch(deleteAdmin(itemId));
          }
          break;
        case 'block':
          if (activeTab === 'vehicles') {
            dispatch(blockVehicle({ id: itemId, blockReason: 'Bulk blocked' }));
          }
          break;
        case 'unblock':
          if (activeTab === 'vehicles') {
            dispatch(unblockVehicle(itemId));
          }
          break;
        case 'reserve':
          if (activeTab === 'slots') {
            dispatch(reserveSlot(itemId));
          }
          break;
        case 'release':
          if (activeTab === 'slots') {
            dispatch(releaseSlot(itemId));
          }
          break;
        default:
          break;
      }
    });

    const actionLabel = getAvailableActions().find(a => a.id === action)?.label || action;
    toast.success(`${actionLabel} applied to ${selectedItems.length} ${activeTab}`);
    setSelectedItems([]);
  };

  const getAvailableActions = () => {
    const actions = [];
    if (activeTab === 'vehicles') {
      actions.push(
        { id: 'delete', label: 'Delete Vehicles', icon: FaTrash, color: 'red' },
        { id: 'block', label: 'Block Vehicles', icon: FaBan, color: 'orange' },
        { id: 'unblock', label: 'Unblock Vehicles', icon: FaUnlock, color: 'green' }
      );
    } else if (activeTab === 'slots') {
      actions.push(
        { id: 'delete', label: 'Delete Slots', icon: FaTrash, color: 'red' },
        { id: 'reserve', label: 'Reserve Slots', icon: FaLock, color: 'blue' },
        { id: 'release', label: 'Release Slots', icon: FaUnlock, color: 'green' }
      );
    } else if (activeTab === 'admins' && user?.role === 'super_admin') {
      actions.push(
        { id: 'delete', label: 'Delete Admins', icon: FaTrash, color: 'red' },
        { id: 'promote', label: 'Promote to Super', icon: FaCheckCircle, color: 'purple' },
        { id: 'demote', label: 'Demote to Admin', icon: FaUserShield, color: 'blue' },
        { id: 'block', label: 'Block Admins', icon: FaBan, color: 'orange' },
        { id: 'unblock', label: 'Unblock Admins', icon: FaUnlock, color: 'green' }
      );
    }
    return actions;
  };

  const renderTable = () => {
    const items = getCurrentItems();
    const allSelected = items.length > 0 && selectedItems.length === items.length;

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-[#155dfc] focus:ring-[#155dfc]"
                  />
                </th>
                {activeTab === 'vehicles' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Registration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Slot</th>
                  </>
                )}
                {activeTab === 'slots' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Used/Capacity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </>
                )}
                {activeTab === 'admins' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Username</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="bg-white/50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="rounded border-gray-300 text-[#155dfc] focus:ring-[#155dfc]"
                    />
                  </td>
                  {activeTab === 'vehicles' && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.regNumber || item.registrationNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          item.outTime ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status === 'blocked' ? 'Blocked' : item.outTime ? 'Out' : 'In'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.slotId || 'N/A'}</td>
                    </>
                  )}
                  {activeTab === 'slots' && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.used}/{item.capacity}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.used >= item.capacity ? 'bg-red-100 text-red-800' :
                          item.used > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.used >= item.capacity ? 'Full' : item.used > 0 ? 'Partial' : 'Free'}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'admins' && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.role}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.status === 'blocked' ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="text-center py-12">
            <FaExclamationTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No {activeTab} found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Bulk Actions</h1>
          <p className="text-gray-600 font-medium">Select and perform actions on multiple items at once</p>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedItems([]);
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-[#155dfc] text-[#155dfc]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {getAvailableActions().map((action) => (
            <button
              key={action.id}
              onClick={() => handleBulkAction(action.id)}
              disabled={selectedItems.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedItems.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : `bg-${action.color}-50 text-${action.color}-700 border-${action.color}-200 hover:bg-${action.color}-100 hover:shadow-md`
              }`}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label} ({selectedItems.length})
            </button>
          ))}
        </div>

        {renderTable()}

        
      </div>
    </div>
  );
};

export default BulkActionsPage;