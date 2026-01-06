import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteAdmin } from '../store/adminsSlice';

const AdminManagementPage = () => {
  const admins = useSelector(state => state.admins.list);
  const userRole = useSelector(state => state.auth.user?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDeleteAdmin = (adminId) => {
    dispatch(deleteAdmin(adminId));
    toast.success('Admin deleted successfully!');
  };

  const handleEditAdmin = (adminId) => {
    navigate(`/dashboard/admin-management/edit/${adminId}`);
  };

  const getRoleBadgeColor = (role) => {
    return role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
        <button
          onClick={() => navigate('/dashboard/admin-management/add')}
          className="bg-[#155dfc] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Add New Admin
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {admins.filter(a => a.role === 'admin' || a.role === 'super_admin').length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0H9m6 0H9m6 0H9m6 0H9" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Admins</h3>
            <p className="text-gray-600 text-sm">No admins have been added yet.</p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {admins.filter(a => a.role === 'admin' || a.role === 'super_admin').map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{admin.username}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(admin.role)}`}>
                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditAdmin(admin.id)}
                          className="text-[#155dfc] hover:text-blue-700 font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-500 hover:text-red-700 font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default AdminManagementPage;