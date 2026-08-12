import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Bot,
  BarChart3,
  Settings,
  UserCheck,
  LogOut,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeToggle } from "../common/ThemeToggle";

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();

  const adminMenuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "🌱 Story Management", path: "/admin/stories", icon: BookOpen },
    { name: "Inspire Management", path: "/admin/inspire", icon: Sparkles },
    { name: "AI Insights", path: "/admin/ai-insights", icon: Bot },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", path: "/admin/settings", icon: Settings },
    { name: "Admin Profile", path: "/admin/profile", icon: UserCheck }
  ];


  const isActive = (path) => {
    if (path === "/admin/dashboard") return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-[#3B281C] text-[#F5EFE6] min-h-screen flex flex-col justify-between shrink-0">
      <div>
        {/* Admin Header */}
        <div className="p-5 border-b border-[#5C3D2E] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E07A5F] text-[#FFFBF7] flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-[#FFFBF7]">MindBloom Admin</span>
            <span className="block text-[10px] text-[#D4C3B3] uppercase tracking-wider font-medium">
              Management Portal
            </span>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <nav className="p-3 space-y-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  active
                    ? "bg-[#E07A5F] text-[#FFFBF7] shadow-sm"
                    : "text-[#D4C3B3] hover:bg-[#4A3022] hover:text-[#FFFBF7]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Theme & Logout */}
      <div className="p-3 border-t border-[#5C3D2E] space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-medium text-[#D4C3B3]">Appearance</span>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#E07A5F] hover:bg-[#4A3022] transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Mode</span>
        </button>
      </div>
    </aside>
  );
};
