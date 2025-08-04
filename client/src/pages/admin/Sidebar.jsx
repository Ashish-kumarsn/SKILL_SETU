import { ChartBar, BookOpen } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
<aside className="hidden lg:flex flex-col w-[250px] px-5 py-8 space-y-6 border-r border-gray-700 fixed left-0 top-16 bottom-0 bg-[#0f172a] z-50">
        <div>
          <h2 className="text-xl font-bold text-blue-400">Instructor Panel</h2>
        </div>

        <nav className="space-y-3">
          <SidebarLink
            to="dashboard"
            icon={<ChartBar size={20} />}
            label="Dashboard"
            active={location.pathname.includes("/dashboard")}
          />
          <SidebarLink
            to="course"
            icon={<BookOpen size={20} />}
            label="Courses"
            active={location.pathname.includes("/course")}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[250px] p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:bg-blue-800/50 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;
