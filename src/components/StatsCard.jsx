const StatsCard = ({ title, value, icon, bgColor = "bg-white" }) => {
  return (
    <div className={`${bgColor} card card-hover overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shadow-sm">
              <div className="text-blue-600">
                {icon}
              </div>
            </div>
          </div>
          <div className="ml-6 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-600 truncate mb-1">
                {title}
              </dt>
              <dd className="text-3xl font-bold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
