import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(apiService.getUser());
  const [isAdmin, setIsAdmin] = useState(apiService.isAdminLoggedIn());
  const [toasts, setToasts] = useState([]);

  // =====================================================
  // INITIAL AUTH / PROFILE REFRESH
  // =====================================================

  useEffect(() => {
    const cachedUser = apiService.getUser();
    setUser(cachedUser);

    // Refresh profile from Django backend if JWT exists
    if (apiService.getAccessToken()) {
      apiService.fetchUserProfileBackend().then((res) => {
        if (res.success && res.data) {
          const fresh = apiService.getUser();
          setUser(fresh);
        }
      });
    }
  }, []);

  // =====================================================
  // NORMAL USER LOGIN
  // =====================================================

  const loginUser = async (email, password) => {
    const res = await apiService.loginUser(email, password);

    if (!res.success) {
      addToast(
        "Login Failed ⚠️",
        res.message,
        "warning"
      );

      return res;
    }

    setUser(res.user);

    addToast(
      "Welcome back!",
      `Signed in as ${res.user.name || email}`,
      "success"
    );

    return {
      success: true,
      user: res.user,
    };
  };

  // =====================================================
  // NORMAL USER REGISTRATION
  // =====================================================

  const registerUser = async (
    email,
    name,
    password
  ) => {
    const regRes =
      await apiService.registerAccount({
        email,
        name,
        password,
      });

    if (!regRes.success) {
      addToast(
        "Registration Failed ⚠️",
        regRes.message,
        "warning"
      );

      return regRes;
    }

    addToast(
      "Registration Successful 🎉",
      "Your account has been created. Logging you in...",
      "success"
    );

    return loginUser(email, password);
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const loginWithGoogleToken = async (
    idToken,
    isAdminMode = false,
    adminCode = ""
  ) => {
    const res =
      await apiService.authenticateGoogleToken(
        idToken,
        isAdminMode ? adminCode : ""
      );

    if (!res.success || !res.user) {
      addToast(
        "Google Sign-In Failed ⚠️",
        res.message ||
          "Failed to authenticate with Google.",
        "warning"
      );

      return {
        success: false,
        message: res.message,
      };
    }

    const gUser = res.user;

    // ===================================================
    // GOOGLE ADMIN LOGIN
    // ===================================================

    if (isAdminMode) {
      // Backend must confirm administrator privileges.
      if (
        !gUser.is_staff &&
        !gUser.is_superuser
      ) {
        addToast(
          "Admin Access Required 🛡️",
          "This Google account has not been granted MindBloom administrator access.",
          "warning"
        );

        return {
          success: false,
          message:
            "Administrator privileges required.",
        };
      }

      apiService.setAdminLoggedIn(true);

      apiService.updateAdminProfile({
        name: gUser.name,
        email: gUser.email,
        authProvider: "Google OAuth 2.0",
      });

      setUser(gUser);
      setIsAdmin(true);

      addToast(
        "Admin Authenticated 🛡️",
        `Welcome ${gUser.name}!`,
        "success"
      );

      return {
        success: true,
        user: gUser,
      };
    }

    // ===================================================
    // NORMAL GOOGLE LOGIN
    // ===================================================

    setUser(gUser);

    addToast(
      "Google Sign-In Successful 🌐",
      `Welcome back, ${gUser.name}!`,
      "success"
    );

    return {
      success: true,
      user: gUser,
    };
  };

  // =====================================================
  // GOOGLE LOGIN FALLBACK
  // =====================================================

  const loginWithGoogle = () => {
    addToast(
      "Google Sign-In Required",
      "Please click 'Continue with Google' to complete Google OAuth authentication.",
      "warning"
    );

    return false;
  };

  // =====================================================
  // NORMAL USER LOGOUT
  // =====================================================

  const logoutUser = async () => {
    const resetUser =
      await apiService.logoutUser();

    setUser(resetUser);

    addToast(
      "Signed out",
      "Hope to see you soon at MindBloom",
      "info"
    );
  };

  // =====================================================
  // DELETE USER ACCOUNT
  // =====================================================

  const deleteAccount = () => {
    const resetUser =
      apiService.deleteAccount();

    setUser(resetUser);

    addToast(
      "Account Deleted",
      "Your profile and session data have been completely removed.",
      "info"
    );
  };

  // =====================================================
  // MANUAL ADMIN LOGIN
  // =====================================================

  const loginAdmin = async (
  name,
  email,
  password,
  adminCode = ""
) => {
  try {
    const response = await fetch(
      "/api/auth/admin-login/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          admin_code: adminCode.trim(),
        }),
      }
    );

    const result = await response.json();

    console.log(
      "Admin login response:",
      result
    );

    if (
      response.ok &&
      result.status === "success" &&
      result.data
    ) {
      const data = result.data;
      const backendUser = data.user;

      const adminUser = {
        email: backendUser.email,

        name:
          backendUser.full_name ||
          name.trim(),

        isLoggedIn: true,

        is_staff:
          backendUser.is_staff || false,

        is_superuser:
          backendUser.is_superuser || false,
      };

      // Save JWT
      apiService.setTokens(
        data.access_token,
        data.refresh_token
      );

      // Save user
      apiService.updateUser(adminUser);

      // Save admin session
      apiService.setAdminLoggedIn(true);

      apiService.updateAdminProfile({
        name: adminUser.name,
        email: adminUser.email,
        authProvider:
          "Email / Password",
      });

      setUser(adminUser);
      setIsAdmin(true);

      addToast(
        "Admin Authenticated 🛡️",
        `Welcome ${adminUser.name}!`,
        "success"
      );

      return true;
    }

    // Backend gives us the actual reason
    const errorMessage =
      result.errors?.non_field_errors?.[0] ||
      result.errors?.name?.[0] ||
      result.errors?.email?.[0] ||
      result.errors?.password?.[0] ||
      result.message ||
      "Administrator authentication failed.";

    console.error(
      "Admin authentication failed:",
      result
    );

    addToast(
      "Admin Authentication Failed ⚠️",
      errorMessage,
      "warning"
    );

    return false;

  } catch (error) {
    console.error(
      "Admin Login Error:",
      error
    );

    addToast(
      "Admin Authentication Failed ⚠️",
      "Unable to communicate with MindBloom backend server.",
      "warning"
    );

    return false;
  }
};

  // =====================================================
  // ADMIN LOGOUT
  // =====================================================

  const logoutAdmin = () => {
    apiService.setAdminLoggedIn(false);

    setIsAdmin(false);

    addToast(
      "Admin Logged Out",
      "Returned to standard public view",
      "info"
    );
  };

  // =====================================================
  // TOAST SYSTEM
  // =====================================================

  const addToast = (
    title,
    message,
    type = "success"
  ) => {
    const id =
      `toast-${Date.now()}-` +
      Math.random()
        .toString(36)
        .substr(2, 4);

    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.filter(
        (toast) => toast.id !== id
      )
    );
  };

  // =====================================================
  // CONTEXT PROVIDER
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,

        isAdmin,

        // Normal authentication
        loginUser,
        registerUser,

        // Google authentication
        loginWithGoogle,
        loginWithGoogleToken,

        // Logout
        logoutUser,
        logoutAdmin,

        // Account
        deleteAccount,

        // Admin authentication
        loginAdmin,

        // Toasts
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =======================================================
// useAuth HOOK
// =======================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};