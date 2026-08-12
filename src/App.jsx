import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PublicLayout, AppLayout, AdminLayout } from "./components/layout/Layouts";
import { HomePage } from "./pages/public/HomePage";
import { AboutPage } from "./pages/public/AboutPage";
import { FeaturesPage } from "./pages/public/FeaturesPage";
import { StoriesPage } from "./pages/public/StoriesPage";
import { TestimonialsPage } from "./pages/public/TestimonialsPage";
import { ContactPage } from "./pages/public/ContactPage";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./pages/public/LoginPage";
import { PrivacyPage } from "./pages/public/PrivacyPage";
import { TermsPage } from "./pages/public/TermsPage";
import { SecurityPage } from "./pages/public/SecurityPage";
import { DashboardPage } from "./pages/app/DashboardPage";
import { BloomBotPage } from "./pages/app/BloomBotPage";
import { JournalPage } from "./pages/app/JournalPage";
import { MoodTrackerPage } from "./pages/app/MoodTrackerPage";
import { ReflectPage } from "./pages/app/ReflectPage";
import { DiscoverPage } from "./pages/app/DiscoverPage";
import { InspirePage } from "./pages/app/InspirePage";
import { BloomStories } from "./pages/app/BloomStoriesPage";
import { ProfilePage } from "./pages/app/ProfilePage";
import { SettingsPage } from "./pages/app/SettingsPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminStoriesPage } from "./pages/admin/AdminStoriesPage";
import { AdminInspirePage } from "./pages/admin/AdminInspirePage";
import { AdminAiInsightsPage } from "./pages/admin/AdminAiInsightsPage";
import { AdminAnalyticsPage } from "./pages/admin/AdminAnalyticsPage";
import { AdminSettingsPage, AdminProfilePage } from "./pages/admin/AdminSettingsPage";

const AdminProtectedRoute = ({ children }) => {
  const { isAdmin, user } = useAuth();
  if (!isAdmin) {
    if (user && user.isLoggedIn) {
      return (
        <div className="min-h-screen bg-[#FFFBF7] dark:bg-[#1A1412] flex items-center justify-center p-4 text-center">
          <div className="max-w-md bg-[#FAF6F0] dark:bg-[#251E19] p-8 space-y-4 border border-[#E07A5F] rounded-2xl shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">Access Denied</h2>
            <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
              Administrator privileges required. You are logged in as a regular user and cannot access the Administrator Application.
            </p>
            <div className="pt-2">
              <Link to="/app" className="cozy-btn-primary text-xs px-5 py-2.5 inline-block">
                Return to User Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const UserProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoggedIn = Boolean(user && user.isLoggedIn && user.email);
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location
        }}
        replace
      />
    );
  }
  return <>{children}</>;
};

export const AppContent = () => {
  return (
    <Routes>
      {/* PUBLIC MARKETING & AUTH ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Route>

      {/* USER APPLICATION ROUTES */}
      <Route
        path="/app"
        element={
          <UserProtectedRoute>
            <AppLayout />
          </UserProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="bloombot" element={<BloomBotPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="mood" element={<MoodTrackerPage />} />
        <Route path="reflect" element={<ReflectPage />} />
        <Route path="stories" element={<BloomStories />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="inspire" element={<InspirePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* ADMIN PANEL ROUTES */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="stories" element={<AdminStoriesPage />} />
        <Route path="inspire" element={<AdminInspirePage />} />
        <Route path="ai-insights" element={<AdminAiInsightsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* FALLBACK REDIRECT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
