const StatsCard = ({ title, value, icon, bgColor = "bg-white" }) => {
  return (
    <div
      className={`${bgColor} overflow-hidden shadow-sm rounded-lg border border-gray-200`}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-600 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
