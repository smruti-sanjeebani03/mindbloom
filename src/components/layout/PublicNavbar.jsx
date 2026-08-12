import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { MapleLeafIcon, CozyCatLogo, MapleLeafCluster } from "../illustrations/CozyIllustrations";
import { ThemeToggle } from "../common/ThemeToggle";
export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "🌱 Stories of Hope", path: "/stories" },
    { name: "About", path: "/about" },
    { name: "Testimonials", path: "/testimonials" }
  ];
  const isActive = (path) => location.pathname === path;
  return <header className="sticky top-0 z-40 bg-[#FFFBF7]/90 backdrop-blur-md border-b border-[#EAD8C7]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {
    /* Brand Logo on Left */
  }
        <Link to="/" className="flex items-center gap-3 group">
          <div className="group-hover:scale-105 transition-transform shrink-0">
            <CozyCatLogo className="w-10 h-10 sm:w-11 sm:h-11" />
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3B281C] block leading-none">
              Mind<span className="text-[#8B5E3C]">Bloom</span>
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#705D52] flex items-center gap-1 mt-0.5">
              <span>Reflect. Heal. Bloom.</span>
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#D88A5C]" />
            </span>
          </div>
        </Link>

        {
    /* Desktop Nav Links matching reference image */
  }
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => <Link
    key={link.name}
    to={link.path}
    className={`text-sm font-medium transition-all relative py-1 ${isActive(link.path) && link.name === "Home" ? 'text-[#3B281C] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D88A5C] after:rounded-full' : "text-[#5C3A2E]/80 hover:text-[#3B281C]"}`}
  >
              {link.name}
            </Link>)}
        </nav>

        {/* Action Buttons matching reference image */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/register"
            className="cozy-btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-xs"
          >
            <span>Sign In</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FFE8D6]" />
          </Link>
        </div>

        {
    /* Mobile menu trigger */
  }
        <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="md:hidden p-2 text-[#5C3A2E] rounded-xl hover:bg-[#FFF5EC] transition"
  >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {
    /* Mobile Drawer */
  }
      {mobileMenuOpen && <div className="md:hidden bg-[#FFFBF7] border-b border-[#E6DCCD] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => <Link
    key={link.path}
    to={link.path}
    onClick={() => setMobileMenuOpen(false)}
    className={`block py-2 text-base font-medium rounded-lg px-3 ${isActive(link.path) ? "bg-[#F5EFE6] text-[#3B281C] font-bold" : "text-[#705D52] hover:bg-[#FAF6F0]"}`}
  >
              {link.name}
            </Link>)}
          <div className="pt-3 border-t border-[#E6DCCD] flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-[#705D52]">Theme Appearance</span>
              <ThemeToggle />
            </div>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center cozy-btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>}
    </header>;
};
export const PublicFooter = () => {
  return <footer className="bg-[#5C3D2E] text-[#F5EFE6] pt-16 pb-12 border-t border-[#4A3022] relative overflow-hidden">
      {
    /* Background Maple Leaf Decoration */
  }
      <div className="absolute right-6 top-6 opacity-20 dark:opacity-35 pointer-events-none">
        <MapleLeafCluster className="w-48 h-48" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#705D52]/40">
          {
    /* Col 1 */
  }
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FFFBF7] text-[#5C3D2E] flex items-center justify-center relative p-1">
                <CozyCatLogo className="w-7 h-7" />
                <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F] absolute -top-1 -right-1" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#FFFBF7] flex items-center gap-1.5">
                <span>MindBloom</span>
                <MapleLeafIcon className="w-4 h-4 text-[#E29578]" />
              </span>
            </div>
            <p className="text-xs text-[#D4C3B3] leading-relaxed">
              Your AI-powered emotional wellness sanctuary. Inspired by warm coffee mornings, thoughtful journals, autumn maple breezes, and gentle daily reflections.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif font-semibold text-base text-[#FFFBF7] mb-4 flex items-center gap-1.5">
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D4C3B3]">
              <li><Link to="/" className="hover:text-[#FFFBF7] transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#FFFBF7] transition">Our Story</Link></li>
              <li><Link to="/features" className="hover:text-[#FFFBF7] transition">Features & BloomBot</Link></li>
              <li><Link to="/testimonials" className="hover:text-[#FFFBF7] transition">User Stories</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif font-semibold text-base text-[#FFFBF7] mb-4 flex items-center gap-1.5">
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Wellness Tools</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D4C3B3]">
              <li><Link to="/app/bloombot" className="hover:text-[#FFFBF7] transition">BloomBot AI Assistant</Link></li>
              <li><Link to="/app/journal" className="hover:text-[#FFFBF7] transition">Guided Journaling</Link></li>
              <li><Link to="/app/mood" className="hover:text-[#FFFBF7] transition">Mood & Emotion Tracker</Link></li>
              <li><Link to="/app/reflect" className="hover:text-[#FFFBF7] transition">Daily Reflection & Gratitude</Link></li>
              <li><Link to="/app/discover" className="hover:text-[#FFFBF7] transition">Breathing Exercises & Audio</Link></li>
            </ul>
          </div>

          {
    /* Col 4 */
  }
          <div>
            <h4 className="font-serif font-semibold text-base text-[#FFFBF7] mb-4 flex items-center gap-1.5">
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#E29578]" />
              <span>Legal & Policies</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D4C3B3]">
              <li><Link to="/privacy" className="hover:text-[#FFFBF7] transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#FFFBF7] transition">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-[#FFFBF7] transition">Data Encryption</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D4C3B3] gap-4">
          <p>© {(/* @__PURE__ */ new Date()).getFullYear()} MindBloom Emotional Wellness Inc. All rights reserved.</p>
          <p className="font-handwriting text-base text-[#E6C594] flex items-center gap-1.5">
            <span>Crafted with warmth, intention & cozy autumn care</span>
            <MapleLeafIcon className="w-4 h-4 text-[#E07A5F]" />
          </p>
        </div>
      </div>
    </footer>;
};
