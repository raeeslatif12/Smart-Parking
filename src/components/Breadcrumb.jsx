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
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Home
          </Link>
        </li>
        {location.pathname !== "/dashboard" && (
          <>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
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
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
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
