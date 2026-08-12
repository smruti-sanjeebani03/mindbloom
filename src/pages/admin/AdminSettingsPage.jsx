import { useState, useEffect } from "react";
import { Check, Lock, ShieldCheck, Mail, Globe, Wrench, UserCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/apiService";

export const AdminSettingsPage = () => {
  const { addToast } = useAuth();
  const [appName, setAppName] = useState("MindBloom");
  const [contactEmail, setContactEmail] = useState("support@mindbloom.app");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [aiModel, setAiModel] = useState("Gemini 2.5 Flash");
  const [safetyThreshold, setSafetyThreshold] = useState("Strict (High Sensitivity)");

  const handleSave = (e) => {
    e.preventDefault();
    addToast("Admin Settings Saved ⚙️", "Platform parameters and system settings updated.", "success");
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
          Admin Settings
        </h1>
        <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] mt-1">
          Configure application parameters, contact details, maintenance mode, and AI model endpoints.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Application Settings */}
        <div className="cozy-card p-6 space-y-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">
          <h3 className="font-serif font-bold text-base text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#E07A5F]" />
            <span>General Application Settings</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
              Application Name
            </label>
            <input
              type="text"
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="cozy-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="cozy-input w-full text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-semibold text-xs text-[#3B281C] dark:text-[#FFFBF7] block">
                Maintenance Mode
              </span>
              <span className="text-[11px] text-[#8C7667]">
                Temporarily pause user access for system upgrades.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-12 h-6 rounded-full p-1 transition duration-200 ease-in-out ${
                maintenanceMode ? "bg-[#E07A5F]" : "bg-[#E6DCCD] dark:bg-[#3D3128]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform duration-200 ease-in-out ${
                  maintenanceMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* AI Model Pipeline Configuration */}
        <div className="cozy-card p-6 space-y-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">
          <h3 className="font-serif font-bold text-base text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#889868]" />
            <span>AI Model Pipeline Configuration</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
              Primary LLM Engine
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="cozy-input w-full text-xs bg-white dark:bg-[#2F2620]"
            >
              <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Optimized for Low Latency)</option>
              <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Deep Research & Complex Empathetic Dialogue)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
              Safety Filter Threshold
            </label>
            <select
              value={safetyThreshold}
              onChange={(e) => setSafetyThreshold(e.target.value)}
              className="cozy-input w-full text-xs bg-white dark:bg-[#2F2620]"
            >
              <option value="Strict (High Sensitivity)">Strict (High Sensitivity - Instant Crisis Referral)</option>
              <option value="Moderate">Moderate (Standard Safety Rules)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="cozy-btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Save Admin Settings</span>
        </button>
      </form>
    </div>
  );
};

export const AdminProfilePage = () => {
  const { addToast } = useAuth();
  const [profile, setProfile] = useState(apiService.getAdminProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState(profile.name || "Shree Sanjeebani");
  const [email, setEmail] = useState(profile.email || "smrutisanjeebani0310@gmail.com");
  const [title, setTitle] = useState(profile.title || "Head of Operations & Administration");

  // Password modal states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = apiService.updateAdminProfile({
      name: name.trim(),
      email: email.trim(),
      title: title.trim()
    });
    setProfile(updated);
    setIsEditing(false);
    addToast("Profile Updated ✨", "Admin profile details saved successfully", "success");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast("Password Mismatch", "New passwords do not match.", "warning");
      return;
    }
    if (newPassword.length < 4) {
      addToast("Weak Password", "Password must be at least 4 characters long.", "warning");
      return;
    }

    addToast("Password Changed 🔐", "Admin security password updated successfully.", "success");
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const getInitial = (n) => {
    return n ? n.charAt(0).toUpperCase() : "A";
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            Admin Profile
          </h1>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] mt-1">
            Administrator identity, security credentials, and management authorization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="cozy-btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="cozy-btn-primary text-xs px-4 py-2"
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Admin Card */}
      <div className="cozy-card p-6 space-y-6 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">
        <div className="flex items-start sm:items-center gap-5">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E07A5F] shadow-xs"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#E07A5F] text-[#FFFBF7] font-serif font-bold text-3xl flex items-center justify-center shadow-xs shrink-0">
              {getInitial(profile.name)}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                {profile.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAEFE6] text-[#4F5D3D] border border-[#D2DEC8]">
                {profile.role || "Administrator"}
              </span>
            </div>
            <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] font-medium">{profile.title}</p>
            <p className="text-xs text-[#8C7667]">{profile.email} • Root Privileges</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-[#EFE6DC] dark:border-[#3D3128] space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7]">
              Update Administrator Details
            </h4>

            <div>
              <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="cozy-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cozy-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
                Administrative Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="cozy-input w-full text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="cozy-btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button type="submit" className="cozy-btn-primary text-xs px-5 py-2">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-4 border-t border-[#EFE6DC] dark:border-[#3D3128] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128]">
              <span className="text-[10px] text-[#8C7667] uppercase tracking-wider block font-semibold">
                Security Access
              </span>
              <span className="font-bold text-[#3B281C] dark:text-[#FFFBF7]">Full Management Portal</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128]">
              <span className="text-[10px] text-[#8C7667] uppercase tracking-wider block font-semibold">
                Account Status
              </span>
              <span className="font-bold text-[#889868]">Active & Verified</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128]">
              <span className="text-[10px] text-[#8C7667] uppercase tracking-wider block font-semibold">
                Auth Mechanism
              </span>
              <span className="font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                {profile.authProvider || "MindBloom SSO"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E6DCCD] dark:border-[#3D3128] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E07A5F]" />
                <span>Change Admin Password</span>
              </h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="cozy-input w-full"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="cozy-input w-full"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="cozy-input w-full"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6DCCD] dark:border-[#3D3128]">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="cozy-btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="cozy-btn-primary text-xs px-5 py-2">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
