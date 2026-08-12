import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export const ThemeToggle = ({ variant = "compact", className = "" }) => {
  const { themeMode, setThemeMode, effectiveTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { mode: "light", label: "Light", icon: Sun },
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "system", label: "System", icon: Laptop }
  ];

  // Segmented Pill Variant (for Settings page or large controls)
  if (variant === "segmented") {
    return (
      <div className={`inline-flex p-1 bg-[#F5EFE6] dark:bg-[#1A1512] border border-[#E6DCCD] dark:border-[#3D3128] rounded-2xl gap-1 ${className}`}>
        {options.map(({ mode, label, icon: Icon }) => {
          const active = themeMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setThemeMode(mode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? "bg-[#5C3D2E] dark:bg-[#E07A5F] text-[#FFFBF7] dark:text-[#171310] shadow-sm font-bold"
                  : "text-[#705D52] dark:text-[#C2B2A3] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] hover:bg-[#EAD8C7]/40 dark:hover:bg-[#2E2721]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact Dropdown Menu Variant (for Navbars, Headers)
  const CurrentIcon =
    themeMode === "light" ? Sun : themeMode === "dark" ? Moon : Laptop;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={`Theme: ${themeMode} (${effectiveTheme} active)`}
        className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#241E1A] border border-[#E6DCCD] dark:border-[#3D3128] text-[#5C3D2E] dark:text-[#E8DCCF] hover:bg-[#F5EFE6] dark:hover:bg-[#2E2721] transition shadow-2xs"
      >
        <CurrentIcon className="w-4 h-4 text-[#D88A5C] dark:text-[#E07A5F]" />
        <span className="text-xs font-semibold capitalize hidden sm:inline">
          {themeMode}
        </span>
        <ChevronDown className="w-3 h-3 text-[#8C7667] dark:text-[#A08C7C]" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-[#FFFBF7] dark:bg-[#241E1A] border border-[#E6DCCD] dark:border-[#3D3128] rounded-xl shadow-xl z-50 py-1.5 animate-fade-in">
          <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A08C7C] border-b border-[#EFE6DC] dark:border-[#332A23] mb-1">
            Appearance
          </div>
          {options.map(({ mode, label, icon: Icon }) => {
            const active = themeMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setThemeMode(mode);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#F5EFE6] dark:bg-[#2E2721] text-[#3B281C] dark:text-[#FFFBF7] font-bold"
                    : "text-[#705D52] dark:text-[#C2B2A3] hover:bg-[#FAF3EC] dark:hover:bg-[#29221C] hover:text-[#3B281C] dark:hover:text-[#FFFBF7]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    active ? "text-[#D88A5C] dark:text-[#E07A5F]" : "text-[#8C7667] dark:text-[#9E8B7C]"
                  }`}
                />
                <span className="flex-1 text-left">{label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D88A5C] dark:bg-[#E07A5F]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
