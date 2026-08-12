import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Cat,
  BookOpen,
  Smile,
  Leaf,
  Sprout,
  Compass,
  Sparkles,
  User,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Command
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { MapleLeafIcon, AutumnLeafIllustration, CozyCatLogo } from "../illustrations/CozyIllustrations";
import { ThemeToggle } from "../common/ThemeToggle";
import { GlobalSearchModal } from "../common/GlobalSearchModal";
import { extractFirstName } from "../../utils/nameUtils";

export const AppSidebar = ({
  isOpen = true,
  onClose,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/app", icon: LayoutDashboard },
    { name: "BloomBot", path: "/app/bloombot", icon: Cat },
    { name: "Journal", path: "/app/journal", icon: BookOpen },
    { name: "Mood Tracker", path: "/app/mood", icon: Smile },
    { name: "Reflect", path: "/app/reflect", icon: Leaf },
    { name: "Bloom Stories", path: "/app/stories", icon: Sprout },
    { name: "Discover", path: "/app/discover", icon: Compass },
    { name: "Inspire", path: "/app/inspire", icon: Sparkles },
    { name: "Profile", path: "/app/profile", icon: User }
  ];

  const isActive = (path) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#FFFBF7] dark:bg-[#2B231D] border-r border-[#E6DCCD] dark:border-[#382D25] flex flex-col justify-between transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Brand Header with Minimize Toggle */}
        <div
          className={`p-4 border-b border-[#EFE6DC] dark:border-[#382D25] flex items-center justify-between ${
            isCollapsed ? "px-3" : ""
          }`}
        >
          {!isCollapsed ? (
            <>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#EAD8C7] dark:border-[#382D25] flex items-center justify-center shadow-xs relative p-0.5 shrink-0">
                  <CozyCatLogo className="w-7 h-7" />
                  <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F] absolute -top-1 -right-1" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-1">
                    <span>MindBloom</span>
                    <MapleLeafIcon className="w-4 h-4 text-[#E07A5F]" />
                  </span>
                  <span className="block text-[9px] tracking-wider uppercase text-[#8C7667] dark:text-[#A89689] font-semibold -mt-0.5">
                    Reflect. Heal. Bloom.
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center p-1.5 rounded-xl text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition cursor-pointer"
                title="Minimize menu bar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <Link
                to="/"
                className="w-9 h-9 rounded-xl bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#EAD8C7] dark:border-[#382D25] flex items-center justify-center shadow-xs relative p-0.5 shrink-0"
                title="MindBloom Home"
              >
                <CozyCatLogo className="w-7 h-7" />
                <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F] absolute -top-1 -right-1" />
              </Link>
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center p-1.5 rounded-xl text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition cursor-pointer"
                title="Expand menu bar"
              >
                <PanelLeftOpen className="w-5 h-5 text-[#E07A5F]" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${
                  isCollapsed ? "justify-center px-2.5 py-2.5" : "justify-between px-3.5 py-2.5"
                } rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#5C3D2E] dark:bg-[#E07A5F] text-[#FFFBF7] font-semibold shadow-sm"
                    : "text-[#705D52] dark:text-[#D1C3B7] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] hover:text-[#3B281C] dark:hover:text-[#FFFBF7]"
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 ${
                      active ? "text-[#E6C594] dark:text-[#FFFBF7]" : "text-[#8C7667] dark:text-[#A89689]"
                    }`}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && active && <MapleLeafIcon className="w-3.5 h-3.5 text-[#E29578]" />}
              </Link>
            );
          })}
        </nav>

        {/* Cozy Encouragement Card */}
        <div className="p-3">
          {!isCollapsed ? (
            <div className="p-3.5 bg-[#FAF6F0] dark:bg-[#342B24] border border-[#E6DCCD] dark:border-[#42352D] rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-11 h-11 my-0.5">
                <CozyCatLogo className="w-full h-full" />
              </div>
              <p className="font-handwriting text-base text-[#5C3D2E] dark:text-[#E2C0A8] font-bold mt-1">
                You are blooming into the best version of yourself.
              </p>
              <span className="text-[10px] text-[#8C7667] dark:text-[#A89689] mt-0.5 font-medium flex items-center gap-1">
                <MapleLeafIcon className="w-3 h-3 text-[#E07A5F]" />
                <span>Take a gentle breath</span>
              </span>
              <div className="absolute -right-2 -bottom-2 opacity-30 pointer-events-none">
                <AutumnLeafIllustration className="w-10 h-10" />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-full p-2 bg-[#FAF6F0] dark:bg-[#342B24] border border-[#E6DCCD] dark:border-[#42352D] rounded-xl flex items-center justify-center hover:bg-[#F5EFE6] dark:hover:bg-[#3D2F28] transition cursor-pointer"
              title="Expand menu bar"
            >
              <CozyCatLogo className="w-7 h-7" />
            </button>
          )}
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-[#EFE6DC] dark:border-[#382D25]">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-2" : "gap-3 px-3.5"
            } py-2.5 rounded-xl text-sm font-medium text-[#B8543B] hover:bg-[#FBEBE6] dark:hover:bg-[#3D2520] transition cursor-pointer`}
          >
            <LogOut className="w-4.5 h-4.5 text-[#B8543B] shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export const AppHeader = ({ onMobileMenuToggle, isCollapsed, onToggleMinimize }) => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/90 dark:bg-[#251E18]/90 backdrop-blur-md border-b border-[#E6DCCD] dark:border-[#382D25] px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Mobile menu trigger & Desktop minimize trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-[#5C3D2E] dark:text-[#E2C0A8] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition cursor-pointer"
            title="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={onToggleMinimize}
            className="hidden lg:flex items-center gap-1.5 p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] text-[#705D52] dark:text-[#C5B5A7] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition text-xs font-semibold cursor-pointer"
            title={isCollapsed ? "Expand menu bar" : "Minimize menu bar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#E07A5F]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-[#8C7667]" />
            )}
            <span className="hidden xl:inline">{isCollapsed ? "Expand Menu" : "Minimize"}</span>
          </button>

          {/* Search Trigger Bar (Desktop & Tablet) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative hidden sm:flex items-center justify-between w-64 lg:w-72 !pl-10 pr-3 py-2 text-xs bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#8C7667] dark:text-[#A89689] hover:border-[#A08370] transition text-left cursor-pointer group"
          >
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] group-hover:text-[#E07A5F] transition" />
            <span>Search anything...</span>
            <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-[#EFE6DC] dark:bg-[#382D25] px-1.5 py-0.5 rounded text-[#705D52] dark:text-[#C5B5A7]">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>

          {/* Search Icon Button (Mobile) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] text-[#5C3D2E] dark:text-[#E2C0A8] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition cursor-pointer"
            title="Search app"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] text-[#705D52] dark:text-[#C5B5A7] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition cursor-pointer">
            <Bell className="w-4 h-4 text-[#5C3D2E] dark:text-[#E2C0A8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E07A5F]" />
          </button>

          {/* User Profile Pill with Maple Leaf Accent */}
          <Link
            to="/app/profile"
            className="flex items-center gap-2 p-1.5 pr-3 bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] rounded-full hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition"
          >
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(
                  extractFirstName(user?.name, user?.email)
                )}&backgroundColor=efe6dc`
              }
              alt={extractFirstName(user?.name, user?.email)}
              className="w-8 h-8 rounded-full object-cover border border-[#D4C3B3] bg-[#FAF6F0]"
            />
            <div className="flex items-center gap-1 hidden sm:flex">
              <span className="text-xs font-semibold text-[#3B281C] dark:text-[#FFFBF7]">
                {extractFirstName(user?.name, user?.email)}
              </span>
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C7667] hidden sm:inline" />
          </Link>
        </div>
      </header>

      {/* Global Interactive Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
