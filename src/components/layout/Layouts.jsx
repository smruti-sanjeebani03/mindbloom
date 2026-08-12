import { useState } from "react";
import { Outlet } from "react-router-dom";
import { PublicNavbar, PublicFooter } from "./PublicNavbar";
import { AppSidebar, AppHeader } from "./AppSidebar";
import { AdminSidebar } from "./AdminSidebar";
import { ToastContainer } from "../common/UIComponents";
export const PublicLayout = () => {
  return <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#4A3B32]">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <ToastContainer />
    </div>;
};
export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("mindbloom_sidebar_collapsed") === "true";
  });

  const handleToggleMinimize = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("mindbloom_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen flex bg-[#FAF6F0] dark:bg-[#1E1813] text-[#4A3B32]">
      <AppSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleMinimize}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isCollapsed={isCollapsed}
          onToggleMinimize={handleToggleMinimize}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
export const AdminLayout = () => {
  return <div className="min-h-screen flex bg-[#FAF6F0] text-[#4A3B32]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
      <ToastContainer />
    </div>;
};
