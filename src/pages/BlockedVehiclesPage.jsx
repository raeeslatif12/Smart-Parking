import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { unblockVehicle } from '../store/blockedVehiclesSlice';
import { unblockVehicle as unblockVehicleInVehicles } from '../store/vehiclesSlice';
import ConfirmationModal from '../components/ConfirmationModal';

const BlockedVehiclesPage = () => {
  const blockedVehicles = useSelector(state => state.blockedVehicles.list);
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [vehicleToUnblock, setVehicleToUnblock] = useState(null);

  const handleUnblockVehicle = (vehicle) => {
    setVehicleToUnblock(vehicle);
    setIsConfirmModalOpen(true);
  };

  const confirmUnblock = () => {
    dispatch(unblockVehicleInVehicles(vehicleToUnblock));
    dispatch(unblockVehicle(vehicleToUnblock.id));
    setIsConfirmModalOpen(false);
    setVehicleToUnblock(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blocked Vehicles</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
        <div className="max-h-[600px] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
          <table className="min-w-full bg-white">
            <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Registration No.</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Category</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Blocked At</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {blockedVehicles.map(vehicle => (
                <tr key={vehicle.id} className="hover:bg-red-50/50 transition-all duration-200 group">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.registrationNumber}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{vehicle.category}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{new Date(vehicle.blockedAt).toLocaleString()}</td>
                  <td className="px-6 py-5 text-sm text-gray-700 max-w-xs truncate">{vehicle.blockReason}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleUnblockVehicle(vehicle)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blockedVehicles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No blocked vehicles</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
                All vehicles are currently active. Blocked vehicles will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmUnblock}
          title="Confirm Unblock"
          message="Are you sure you want to unblock this vehicle?"
        />
      )}
    </div>
  );
};

export default BlockedVehiclesPage;