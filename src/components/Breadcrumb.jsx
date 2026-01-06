import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  const getPageName = (path) => {
    const pageMap = {
      "/dashboard": "Dashboard",
      "/dashboard/vehicle-categories": "Vehicle Categories",
      "/dashboard/vehicle-entry": "Vehicle Entry",
      "/dashboard/in-vehicles": "In Vehicles",
      "/dashboard/out-vehicles": "Out Vehicles",
      "/dashboard/total-income": "Total Income",
    };
    return pageMap[path] || "Page";
  };

  const currentPageName = getPageName(location.pathname);

  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2 md:space-x-4 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
        </li>
        {location.pathname !== "/dashboard" && (
          <>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-2 text-sm font-semibold text-gray-900">
                  {currentPageName}
                </span>
              </div>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
