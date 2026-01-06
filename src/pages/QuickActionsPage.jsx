import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaParking,
  FaLock,
  FaUnlock,
  FaCar,
  FaMapMarkerAlt,
  FaBolt,
  FaCheckCircle
} from "react-icons/fa";
import {
  reserveSlot,
  releaseSlot
} from "../store/slotsSlice";
import {
  addInVehicle
} from "../store/vehiclesSlice";

const QuickActionsPage = () => {
  const dispatch = useDispatch();
  const slots = useSelector((state) => state.slots);
  const vehicles = useSelector((state) => state.vehicles.inVehicles);
  const categories = useSelector((state) => state.categories);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('vehicles');

  const freeSlots = slots.filter(slot => slot.used < slot.capacity);
  const reservedSlots = slots.filter(slot => slot.used > 0);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSlots = slots.filter(slot =>
    slot.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReserveNextSlot = () => {
    const nextSlot = freeSlots[0];
    if (nextSlot) {
      dispatch(reserveSlot(nextSlot.id));
      toast.success(`Reserved slot ${nextSlot.name}`);
    } else {
      toast.warning('No free slots available');
    }
  };

  const handleHoldAllFreeSlots = () => {
    const freeSlotIds = freeSlots.map(slot => slot.id);
    if (freeSlotIds.length > 0) {
      freeSlotIds.forEach(id => dispatch(reserveSlot(id)));
      toast.success(`Held ${freeSlotIds.length} free slots`);
    } else {
      toast.warning('No free slots to hold');
    }
  };

  const handleReleaseAllReserved = () => {
    const reservedSlotIds = reservedSlots.map(slot => slot.id);
    if (reservedSlotIds.length > 0) {
      reservedSlotIds.forEach(id => dispatch(releaseSlot(id)));
      toast.success(`Released ${reservedSlotIds.length} reserved slots`);
    } else {
      toast.warning('No reserved slots to release');
    }
  };

  const handleQuickEntry = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      const availableSlot = freeSlots.find(slot =>
        slot.type.toLowerCase() === vehicle.category.toLowerCase() ||
        slot.type === 'Both'
      );

      if (availableSlot) {
        dispatch(addInVehicle({
          ...vehicle,
          slotId: availableSlot.id,
          entryTime: new Date().toISOString()
        }));
        toast.success(`Vehicle ${vehicle.regNumber || vehicle.registrationNumber} entered slot ${availableSlot.name}`);
      } else {
        toast.error('No suitable slot available for this vehicle type');
      }
    }
  };

  const quickActions = [
    {
      id: 'reserve-next',
      title: 'Reserve Next Available Slot',
      description: 'Quickly reserve the next free parking slot',
      icon: FaParking,
      action: handleReserveNextSlot,
      color: 'blue',
      available: freeSlots.length > 0
    },
    {
      id: 'hold-all-free',
      title: 'Hold All Free Slots',
      description: 'Reserve all currently available slots',
      icon: FaLock,
      action: handleHoldAllFreeSlots,
      color: 'orange',
      available: freeSlots.length > 0
    },
    {
      id: 'release-all',
      title: 'Release All Reserved Slots',
      description: 'Free up all currently reserved slots',
      icon: FaUnlock,
      action: handleReleaseAllReserved,
      color: 'green',
      available: reservedSlots.length > 0
    }
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Quick Actions</h1>
          <p className="text-gray-600 font-medium">Perform frequent tasks with a single click</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              disabled={!action.available}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                !action.available ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-200'
              }`}
            >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 flex items-center justify-center mb-4 transition-transform duration-300`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              {action.available && (
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <FaCheckCircle className="w-4 h-4 mr-2" />
                  Available ({action.id === 'reserve-next' ? freeSlots.length :
                           action.id === 'hold-all-free' ? freeSlots.length :
                           reservedSlots.length})
                </div>
              )}
              {!action.available && (
                <div className="flex items-center text-sm text-gray-400 font-medium">
                  <FaBolt className="w-4 h-4 mr-2" />
                  Not Available
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Search & Actions</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSearchType('vehicles')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchType === 'vehicles'
                    ? 'bg-[#155dfc] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaCar className="w-4 h-4 inline mr-2" />
                Vehicles
              </button>
              <button
                onClick={() => setSearchType('slots')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchType === 'slots'
                    ? 'bg-[#155dfc] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaMapMarkerAlt className="w-4 h-4 inline mr-2" />
                Slots
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchType === 'vehicles' ? (
              filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#155dfc] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {vehicle.regNumber?.charAt(0) || vehicle.registrationNumber?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vehicle.regNumber || vehicle.registrationNumber}</p>
                        <p className="text-sm text-gray-600">{vehicle.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickEntry(vehicle.id)}
                      className="px-4 py-2 bg-[#155dfc] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Quick Entry
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaCar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No vehicles found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              )
            ) : (
              filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                        slot.used >= slot.capacity ? 'bg-red-100 text-red-800' :
                        slot.used > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {slot.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{slot.name}</p>
                        <p className="text-sm text-gray-600">{slot.type} • {slot.used}/{slot.capacity} used</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {slot.used < slot.capacity && (
                        <button
                          onClick={() => {
                            dispatch(reserveSlot(slot.id));
                            toast.success(`Reserved slot ${slot.name}`);
                          }}
                          className="px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          Reserve
                        </button>
                      )}
                      {slot.used > 0 && (
                        <button
                          onClick={() => {
                            dispatch(releaseSlot(slot.id));
                            toast.success(`Released slot ${slot.name}`);
                          }}
                          className="px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors duration-200"
                        >
                          Release
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaMapMarkerAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No slots found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPage;