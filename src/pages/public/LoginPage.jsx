import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { CozyCatLogo } from "../../components/illustrations/CozyIllustrations";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleAuthButton } from "../../components/common/GoogleAuthButton";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = (typeof location.state?.from === "string" ? location.state.from : location.state?.from?.pathname) || "/app";

  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  const cleanEmail = email.trim();

  const result = await loginUser(cleanEmail, password);

  if (!result || !result.success) {
    setError(
      result?.message ||
      "Login failed. Please check your credentials and try again."
    );
    return;
  }

  if (
    result.user?.is_staff ||
    result.user?.is_superuser ||
    result.user?.role === "admin"
  ) {
    navigate("/admin/dashboard", { replace: true });
  } else {
    navigate(returnPath || "/app", { replace: true });
  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md cozy-card p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#5C3D2E] text-[#FFFBF7] flex items-center justify-center shadow-md">
            <CozyCatLogo className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#3B281C]">Welcome Back</h1>
          <p className="text-xs text-[#705D52]">Enter your details to open your warm journal sanctuary.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FDF0ED] dark:bg-[#3A221C] border border-[#E07A5F] text-[#A83D24] dark:text-[#FF9E80] text-xs flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#E07A5F]" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                className="cozy-input w-full !pl-10 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#5C3D2E]">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-[#8B5E3C] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                className={`cozy-input w-full !pl-10 !pr-10 text-xs transition-colors ${
                  error
                    ? "border-[#E07A5F] bg-[#FDF0ED]/40 focus:ring-[#E07A5F]"
                    : password.length > 0 && !hasSpecialChar
                    ? "border-[#E07A5F]/70"
                    : password.length > 0 && hasSpecialChar
                    ? "border-[#889868]"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7667] hover:text-[#3B281C] p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password.length > 0 && !hasSpecialChar && (
              <p className="mt-1.5 text-[11px] text-[#C45E44] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Must include a special character (e.g. <code>!@#$%^&*</code>)
              </p>
            )}
          </div>

          <button type="submit" className="cozy-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2">
            <span>Sign In to MindBloom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google Authentication */}
        <GoogleAuthButton mode="login" />

        <div className="text-center pt-2 border-t border-[#EFE6DC]">
          <p className="text-xs text-[#705D52]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#8B5E3C] hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { registerUser, addToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;
  const returnPath = location.state?.from?.pathname || "/app";

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!hasSpecialChar) {
      setError("Password is weak! Please include at least one special character (e.g. !@#$%^&*).");
      if (addToast) {
        addToast("Weak Password ⚠️", "Please include at least one special character in your password (!@#$%^&*)", "warning");
      }
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    setError("");

const cleanEmail = email.trim();

const result = await loginUser(cleanEmail, password);

if (!result || !result.success) {
  setError(
    result?.message ||
    "Login failed. Please check your credentials and try again."
  );
  return;
}

if (
  result.user?.is_staff ||
  result.user?.is_superuser ||
  result.user?.role === "admin"
) {
  navigate("/admin/dashboard", { replace: true });
} else {
  navigate(returnPath || "/app", { replace: true });
} }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md cozy-card p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#5C3D2E] text-[#FFFBF7] flex items-center justify-center shadow-md">
            <CozyCatLogo className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#3B281C]">Join MindBloom</h1>
          <p className="text-xs text-[#705D52]">Start your cozy emotional wellness journey today.</p>
        </div>

        {redirectMessage && (
          <div className="p-3.5 rounded-xl bg-[#FDF0ED] dark:bg-[#32231B] border border-[#E07A5F]/40 text-[#8C3A27] dark:text-[#FFB199] text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E07A5F]" />
            <span className="font-medium leading-relaxed">{redirectMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-[#FDF0ED] border border-[#F4A28C] text-[#C45E44] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Full Name <span className="text-[#E07A5F]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="cozy-input w-full !pl-10 text-xs"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Email Address <span className="text-[#E07A5F]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="cozy-input w-full !pl-10 text-xs"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#5C3D2E]">
                Password <span className="text-[#E07A5F]">*</span>
              </label>
              {password.length > 0 && (
                <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                  hasSpecialChar ? "text-[#6A8258]" : "text-[#C45E44]"
                }`}>
                  {hasSpecialChar ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Strong</>
                  ) : (
                    <><AlertCircle className="w-3.5 h-3.5" /> Weak (No special char)</>
                  )}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                className={`cozy-input w-full !pl-10 !pr-10 text-xs transition-colors ${
                  password.length > 0 && !hasSpecialChar
                    ? "border-[#E07A5F] bg-[#FDF0ED]/50 focus:ring-[#E07A5F]"
                    : password.length > 0 && hasSpecialChar
                    ? "border-[#889868] bg-[#FAFDF8] focus:ring-[#889868]"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7667] hover:text-[#3B281C] p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password.length > 0 && !hasSpecialChar && (
              <div className="mt-2 p-2.5 rounded-xl bg-[#FDF0ED] dark:bg-[#38261E] border border-[#E07A5F]/40 text-[#A83D24] dark:text-[#FF9E80] text-[11px] flex items-center gap-2 shadow-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-[#E07A5F] shrink-0" />
                <span>
                  <strong>Weak Password:</strong> Must include at least one special character (e.g. <code>!@#$%^&*</code>).
                </span>
              </div>
            )}
            {password.length > 0 && hasSpecialChar && (
              <div className="mt-2 p-2.5 rounded-xl bg-[#FAFDF8] dark:bg-[#25321F] border border-[#889868]/40 text-[#4F6832] dark:text-[#B5DB92] text-[11px] flex items-center gap-2 shadow-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#6A8258] shrink-0" />
                <span>
                  <strong>Strong Password:</strong> Contains required special character.
                </span>
              </div>
            )}
          </div>

          {/* Confirmation Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#5C3D2E]">
                Confirm Password <span className="text-[#E07A5F]">*</span>
              </label>
              {passwordsMatch && (
                <span className="text-[11px] text-[#6A8258] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords Match
                </span>
              )}
              {passwordMismatch && (
                <span className="text-[11px] text-[#C45E44] font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Mismatch
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Re-enter password to confirm"
                className={`cozy-input w-full !pl-10 !pr-10 text-xs transition-colors ${
                  passwordMismatch
                    ? "border-[#E07A5F] bg-[#FDF0ED] focus:ring-[#E07A5F]"
                    : passwordsMatch
                    ? "border-[#889868] bg-[#FAFDF8] focus:ring-[#889868]"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7667] hover:text-[#3B281C] p-1"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" className="cozy-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2">
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google Authentication */}
        <GoogleAuthButton mode="register" />

        <div className="text-center pt-2 border-t border-[#EFE6DC]">
          <p className="text-xs text-[#705D52]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#8B5E3C] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md cozy-card p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#3B281C]">Reset Password</h1>
          <p className="text-xs text-[#705D52]">We'll send a warm link to recover your account.</p>
        </div>

        {sent ? <div className="p-4 bg-[#EAEFE6] border border-[#D2DEC8] text-[#4F5D3D] rounded-xl text-center text-xs space-y-2">
            <p className="font-semibold">Reset instructions sent to {email}</p>
            <p className="text-[11px]">Please check your inbox. You can return to login now.</p>
            <Link to="/login" className="cozy-btn-primary block text-xs py-2 mt-2">
              Back to Sign In
            </Link>
          </div> : <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">Your Registered Email</label>
              <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="shree@mindbloom.app"
    className="cozy-input w-full text-xs"
  />
            </div>

            <button type="submit" className="cozy-btn-primary w-full py-3 text-xs">
              Send Recovery Link
            </button>
          </form>}

        <div className="text-center">
          <Link to="/login" className="text-xs text-[#8B5E3C] hover:underline">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>;
};
