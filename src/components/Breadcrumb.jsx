import { Link, useLocation } from "react-router-dom";

const ROUTE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/vehicle-categories": "Vehicle Categories",
  "/dashboard/add-category": "Add Category",
  "/dashboard/edit-category/:id": "Edit Category",
  "/dashboard/vehicle-entry": "Vehicle Entry",
  "/dashboard/in-vehicles": "In Vehicles",
  "/dashboard/manage-incoming/:vehicleId": "Manage Vehicle",
  "/dashboard/out-vehicles": "Out Vehicles",
  "/dashboard/out-vehicle-details/:vehicleId": "Vehicle Details",
  "/dashboard/total-income": "Total Income",
  "/dashboard/lost-token": "Lost Token",
  "/dashboard/lost-token/:vehicleId": "Lost Token Form",
  "/dashboard/fee-management": "Fee Management",
  "/dashboard/edit-profile": "Edit Profile",
  "/dashboard/expense-management": "Expense Management",
  "/dashboard/add-expense": "Add Expense",
  "/dashboard/alerts": "Alerts",
  "/dashboard/slots": "Slot Management",
  "/dashboard/add-slot": "Add Slot",
  "/dashboard/slot-types": "Slot Types",
  "/dashboard/add-slot-type": "Add Slot Type",
  "/dashboard/expense-types": "Expense Types",
  "/dashboard/add-expense-type": "Add Expense Type",
  "/dashboard/admin-management": "Admin Management",
  "/dashboard/admin-management/add": "Add Admin",
  "/dashboard/admin-management/edit/:id": "Edit Admin",
  "/dashboard/blocked-vehicles": "Blocked Vehicles",
};

const Breadcrumb = () => {
  const location = useLocation();

  const getPageName = (pathname) => {
    if (ROUTE_TITLES[pathname]) {
      return ROUTE_TITLES[pathname];
    }

    const pathSegments = pathname.split("/");
    for (const [route, title] of Object.entries(ROUTE_TITLES)) {
      const routeSegments = route.split("/");
      if (routeSegments.length === pathSegments.length) {
        let isMatch = true;
        for (let i = 0; i < routeSegments.length; i++) {
          if (
            routeSegments[i] !== pathSegments[i] &&
            !routeSegments[i].startsWith(":")
          ) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          return title;
        }
      }
    }

    return "Page";
  };

  const currentPageName = getPageName(location.pathname);
  const isHomeDashboard = location.pathname === "/dashboard";

  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2 md:space-x-4 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
        </li>
        {!isHomeDashboard && (
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
