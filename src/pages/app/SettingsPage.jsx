import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon, Laptop, Bell, Shield, Download } from "lucide-react";
import { apiService } from "../../services/apiService";
import { ThemeToggle } from "../../components/common/ThemeToggle";

export const SettingsPage = () => {
  const { addToast } = useAuth();
  const { themeMode, setThemeMode, effectiveTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const handleExportData = () => {
    const data = {
      user: apiService.getUser(),
      journals: apiService.getJournals(),
      moods: apiService.getMoods(),
      reflections: apiService.getReflections()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindbloom_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    a.click();
    addToast("Data Exported \u{1F4E5}", "Your MindBloom journal backup has been downloaded", "success");
  };
  return <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#3B281C]">App Settings</h1>
        <p className="text-xs text-[#705D52]">Customize your cozy sanctuary, notifications, and privacy preferences.</p>
      </div>

      {
    /* Theme Preferences */
  }
      <div className="cozy-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-[#8B5E3C]" />
            <div>
              <h3 className="font-serif font-bold text-base text-[#3B281C]">Theme & Appearance</h3>
              <p className="text-[11px] text-[#705D52]">Currently active: <span className="font-semibold capitalize text-[#D88A5C]">{themeMode} Mode</span> ({effectiveTheme})</p>
            </div>
          </div>
          <ThemeToggle variant="segmented" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {[
            { mode: "light", label: "Light Mode", desc: "Warm cozy cream palette", icon: Sun },
            { mode: "dark", label: "Dark Mode", desc: "Soothing espresso twilight", icon: Moon },
            { mode: "system", label: "System Mode", desc: "Syncs with OS preferences", icon: Laptop }
          ].map(({ mode, label, desc, icon: Icon }) => {
            const active = themeMode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  setThemeMode(mode);
                  addToast("Theme Mode Updated", `Switched appearance to ${label}`, "info");
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                  active
                    ? "bg-[#5C3D2E] text-[#FFFBF7] border-[#5C3D2E] shadow-md ring-2 ring-[#D88A5C]"
                    : "bg-[#FFFBF7] border-[#E6DCCD] text-[#3B281C] hover:bg-[#F5EFE6]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${active ? "bg-[#3B281C]" : "bg-[#F5EFE6] text-[#8B5E3C]"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {active && (
                    <span className="text-[10px] uppercase font-bold bg-[#D88A5C] text-[#FFFBF7] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className={`font-bold text-sm ${active ? "text-[#FFFBF7]" : "text-[#3B281C]"}`}>{label}</div>
                  <p className={`text-[11px] mt-0.5 ${active ? "text-[#E6DAD0]" : "text-[#705D52]"}`}>{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {
    /* Notifications */
  }
      <div className="cozy-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#E07A5F]" />
          <h3 className="font-serif font-bold text-base text-[#3B281C]">Notifications & Reminders</h3>
        </div>

        <div className="space-y-3 text-xs text-[#3B281C]">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#E6DCCD] cursor-pointer">
            <div>
              <div className="font-semibold">Daily Reflection Reminder</div>
              <p className="text-[10px] text-[#8C7667]">Receive a gentle nudge every evening at 8:00 PM</p>
            </div>
            <input
    type="checkbox"
    checked={dailyReminders}
    onChange={(e) => setDailyReminders(e.target.checked)}
    className="accent-[#5C3D2E] w-4 h-4"
  />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#E6DCCD] cursor-pointer">
            <div>
              <div className="font-semibold">Weekly Wellness Digest</div>
              <p className="text-[10px] text-[#8C7667]">Get a summary of your mood trends and reflection streak</p>
            </div>
            <input
    type="checkbox"
    checked={emailNotifications}
    onChange={(e) => setEmailNotifications(e.target.checked)}
    className="accent-[#5C3D2E] w-4 h-4"
  />
          </label>
        </div>
      </div>

      {
    /* Data Export & Privacy */
  }
      <div className="cozy-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#889868]" />
          <h3 className="font-serif font-bold text-base text-[#3B281C]">Data Backup & Export</h3>
        </div>

        <p className="text-xs text-[#705D52] leading-relaxed">
          Your privacy is sacred. You can export all your journal entries, mood logs, and reflection records as a portable JSON file at any time.
        </p>

        <button
    onClick={handleExportData}
    className="cozy-btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 border border-[#E6DCCD]"
  >
          <Download className="w-4 h-4" />
          <span>Export Complete Journal Data (JSON)</span>
        </button>
      </div>
    </div>;
};
