import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { CozyBadge } from "../../components/common/UIComponents";

export const AdminLoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAdminCode = adminCode.trim();

    try {
      const success = await loginAdmin(
        cleanName,
        cleanEmail,
        password,
        cleanAdminCode,
      );

      if (success) {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        setError(
          "Access Denied: Invalid credentials or account does not have administrator privileges.",
        );
      }
    } catch (err) {
      console.error("Admin login error:", err);

      setError("An error occurred during admin authentication.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#3B281C] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#FAF6F0] border border-[#E6DCCD] rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E07A5F] text-[#FFFBF7] flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <CozyBadge variant="autumn">Admin Console</CozyBadge>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#3B281C]">
            Admin Access Portal
          </h1>

          <p className="text-xs text-[#705D52]">
            MindBloom Management & Executive Console
          </p>
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FDF0ED] border border-[#E07A5F] text-[#A83D24] text-xs flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#E07A5F]" />

            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* =================================================
            ADMIN LOGIN FORM
        ================================================= */}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          {/* =================================================
              ADMINISTRATOR NAME
          ================================================= */}

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Administrator Name <span className="text-[#E07A5F]">*</span>
            </label>

            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />

              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="e.g. XYZ"
                className="cozy-input w-full !pl-10 text-xs"
              />
            </div>
          </div>

          {/* =================================================
              ADMIN EMAIL
          ================================================= */}

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Admin Email Address <span className="text-[#E07A5F]">*</span>
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="admin@mindbloom.app"
                className="cozy-input w-full !pl-10 text-xs"
              />
            </div>
          </div>

          {/* =================================================
              SECURITY PASSWORD
          ================================================= */}

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Security Password <span className="text-[#E07A5F]">*</span>
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Enter security password"
                className="cozy-input w-full !pl-10 !pr-10 text-xs"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] hover:text-[#5C3D2E] transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              ADMIN INVITATION CODE
          ================================================= */}

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Admin Invitation Code
            </label>

            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />

              <input
                type={showAdminCode ? "text" : "password"}
                value={adminCode}
                onChange={(e) => {
                  setAdminCode(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Enter invitation code"
                className="cozy-input w-full !pl-10 !pr-10 text-xs"
              />

              <button
                type="button"
                onClick={() => setShowAdminCode((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] hover:text-[#5C3D2E] transition"
                aria-label={
                  showAdminCode
                    ? "Hide administrator code"
                    : "Show administrator code"
                }
              >
                {showAdminCode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-[10px] text-[#8C7667] mt-2 leading-relaxed">
              First-time administrators only. Use the invitation code provided
              by the MindBloom administrator.
            </p>
          </div>

          {/* =================================================
              SIGN IN BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="cozy-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 bg-[#E07A5F] hover:bg-[#C45E44] transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>
              {loading ? "Authenticating..." : "Sign In to Admin Panel"}
            </span>

            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* =================================================
            GOOGLE ADMIN AUTHENTICATION
        ================================================= */}

        {/* =================================================
            RETURN TO USER LOGIN
        ================================================= */}

        <div className="pt-2 border-t border-[#EFE6DC] text-center">
          <Link
            to="/login"
            className="text-xs text-[#8C7667] hover:text-[#D88A5C] flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />

            <span>Return to User Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};