import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaCar,
  FaMapMarkerAlt,
  FaChartPie,
  FaChartBar,
  FaClock,
  FaInfoCircle
} from "react-icons/fa";

const HeatmapAnalyticsPage = () => {
  const slots = useSelector((state) => state.slots);
  const { inVehicles, outVehicles } = useSelector((state) => state.vehicles);
  const categories = useSelector((state) => state.categories);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const totalSlots = slots.length;
  const occupiedSlots = slots.filter(slot => slot.used > 0).length;
  const fullSlots = slots.filter(slot => slot.used >= slot.capacity).length;
  const freeSlots = totalSlots - occupiedSlots;

  const occupancyPercentage = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  const vehicleTypeBreakdown = categories.map(category => {
    const count = inVehicles.filter(vehicle => vehicle.category === category.name).length;
    return {
      name: category.name,
      value: count,
      percentage: inVehicles.length > 0 ? Math.round((count / inVehicles.length) * 100) : 0
    };
  }).filter(item => item.value > 0);

  const slotTypeBreakdown = slots.reduce((acc, slot) => {
    const existing = acc.find(item => item.name === slot.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: slot.type, value: 1 });
    }
    return acc;
  }, []);

  const getSlotColor = (slot) => {
    const usageRatio = slot.capacity > 0 ? slot.used / slot.capacity : 0;
    if (usageRatio === 0) return 'bg-green-100 border-green-300 text-green-800';
    if (usageRatio < 0.5) return 'bg-amber-100 border-amber-300 text-amber-800';
    if (usageRatio < 1) return 'bg-orange-100 border-orange-300 text-orange-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  const getSlotStatus = (slot) => {
    const usageRatio = slot.capacity > 0 ? slot.used / slot.capacity : 0;
    if (usageRatio === 0) return 'Free';
    if (usageRatio < 0.5) return 'Low';
    if (usageRatio < 1) return 'Medium';
    return 'Full';
  };

  const getPeakHours = () => {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      entries: inVehicles.filter(vehicle => {
        const entryHour = new Date(vehicle.entryTime).getHours();
        return entryHour === hour;
      }).length,
      exits: outVehicles.filter(vehicle => {
        const exitHour = vehicle.outTime ? new Date(vehicle.outTime).getHours() : -1;
        return exitHour === hour;
      }).length
    }));

    const peakEntryHour = hourlyData.reduce((max, curr) =>
      curr.entries > max.entries ? curr : max
    );

    const peakExitHour = hourlyData.reduce((max, curr) =>
      curr.exits > max.exits ? curr : max
    );

    return { peakEntryHour, peakExitHour };
  };

  const { peakEntryHour, peakExitHour } = getPeakHours();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Analytics & Heatmap</h1>
          <p className="text-gray-600 font-medium">Visual overview of slot occupancy and parking analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Slots</p>
                <p className="text-3xl font-bold text-gray-900">{totalSlots}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Occupied</p>
                <p className="text-3xl font-bold text-amber-600">{occupiedSlots}</p>
                <p className="text-xs text-gray-500 mt-1">{occupancyPercentage}% utilization</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaCar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Free Slots</p>
                <p className="text-3xl font-bold text-green-600">{freeSlots}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaMapMarkerAlt className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Full Slots</p>
                <p className="text-3xl font-bold text-red-600">{fullSlots}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaCar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
              Slot Occupancy Heatmap
            </h2>

            <div className="mb-4 flex flex-wrap gap-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                <span>Free</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded mr-2"></div>
                <span>Low (1-49%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded mr-2"></div>
                <span>Medium (50-99%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                <span>Full (100%)</span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`relative w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 ${getSlotColor(slot)}`}
                  onMouseEnter={() => setHoveredSlot(slot)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.name.charAt(0)}
                </div>
              ))}
            </div>

            {hoveredSlot && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{hoveredSlot.name}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    getSlotStatus(hoveredSlot) === 'Free' ? 'bg-green-100 text-green-800' :
                    getSlotStatus(hoveredSlot) === 'Low' ? 'bg-amber-100 text-amber-800' :
                    getSlotStatus(hoveredSlot) === 'Medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getSlotStatus(hoveredSlot)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {hoveredSlot.used} / {hoveredSlot.capacity} vehicles
                </p>
                <p className="text-xs text-gray-500 mt-1">Type: {hoveredSlot.type}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
              Vehicle Type Distribution
            </h2>

            {vehicleTypeBreakdown.length > 0 ? (
              <div className="space-y-4">
                {vehicleTypeBreakdown.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded mr-3 ${
                        ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'][index % 4]
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{item.value} vehicles</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}

                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Distribution</span>
                    <span>{inVehicles.length} total vehicles</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      {vehicleTypeBreakdown.map((item, index) => (
                        <div
                          key={item.name}
                          className={`${
                            ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'][index % 4]
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaChartPie className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No vehicle data</p>
                <p className="text-sm text-gray-400 mt-1">Vehicle distribution will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
              Slot Type Breakdown
            </h2>

            {slotTypeBreakdown.length > 0 ? (
              <div className="space-y-4">
                {slotTypeBreakdown.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded mr-3 ${
                        ['bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'][index % 4]
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{item.value} slots</span>
                      <span className="text-xs text-gray-500">
                        ({Math.round((item.value / totalSlots) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaChartBar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No slot data</p>
                <p className="text-sm text-gray-400 mt-1">Slot type breakdown will appear here</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#155dfc] to-[#0d4ae8] rounded-full mr-3"></div>
              Peak Hours Analysis
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <FaClock className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Peak Entry Hour</p>
                    <p className="text-sm text-gray-600">Most vehicles enter at</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {peakEntryHour.hour.toString().padStart(2, '0')}:00
                  </p>
                  <p className="text-sm text-gray-600">{peakEntryHour.entries} entries</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <FaClock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Peak Exit Hour</p>
                    <p className="text-sm text-gray-600">Most vehicles exit at</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {peakExitHour.hour.toString().padStart(2, '0')}:00
                  </p>
                  <p className="text-sm text-gray-600">{peakExitHour.exits} exits</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedSlot && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedSlot(null)}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#155dfc] sm:mx-0 sm:h-10 sm:w-10">
                      <FaMapMarkerAlt className="h-6 w-6 text-white" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                        Slot Details: {selectedSlot.name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{selectedSlot.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-medium">{selectedSlot.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currently Used:</span>
                          <span className="font-medium">{selectedSlot.used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium">{selectedSlot.capacity - selectedSlot.used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getSlotStatus(selectedSlot) === 'Free' ? 'bg-green-100 text-green-800' :
                            getSlotStatus(selectedSlot) === 'Low' ? 'bg-amber-100 text-amber-800' :
                            getSlotStatus(selectedSlot) === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getSlotStatus(selectedSlot)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapAnalyticsPage;