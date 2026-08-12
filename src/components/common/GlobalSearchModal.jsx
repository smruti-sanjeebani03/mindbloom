import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  LayoutDashboard,
  Cat,
  BookOpen,
  Smile,
  Leaf,
  Sprout,
  Compass,
  Sparkles,
  User,
  ArrowRight,
  FileText,
  Heart,
  MessageSquare,
  Command
} from "lucide-react";
import { apiService } from "../../services/apiService";
import { MapleLeafIcon } from "../illustrations/CozyIllustrations";

const APP_FEATURES = [
  { name: "Dashboard", path: "/app", icon: LayoutDashboard, category: "Features", description: "Overview of your wellness journey & streak" },
  { name: "BloomBot AI Companion", path: "/app/bloombot", icon: Cat, category: "Features", description: "Talk to your warm cat AI companion" },
  { name: "Journal & Diary", path: "/app/journal", icon: BookOpen, category: "Features", description: "Write and reflect on your daily thoughts" },
  { name: "Mood Tracker", path: "/app/mood", icon: Smile, category: "Features", description: "Log and visualize your daily emotional check-ins" },
  { name: "Daily Reflect", path: "/app/reflect", icon: Leaf, category: "Features", description: "Guided prompt exercises and daily gratitude" },
  { name: "Bloom Stories", path: "/app/stories", icon: Sprout, category: "Features", description: "Read and share supportive community stories" },
  { name: "Discover Resources", path: "/app/discover", icon: Compass, category: "Features", description: "Explore mental health guides, breathing & mindfulness tools" },
  { name: "Inspire & Affirmations", path: "/app/inspire", icon: Sparkles, category: "Features", description: "Daily uplifting quotes and positive affirmations" },
  { name: "Profile & Settings", path: "/app/profile", icon: User, category: "Features", description: "Manage your personal goals and account settings" },
];

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [recentJournals, setRecentJournals] = useState([]);
  const [communityStories, setCommunityStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      // Load recent journals from backend
      apiService.fetchJournalsFromBackend()
        .then((data) => {
          if (Array.isArray(data)) {
            setRecentJournals(data.slice(0, 5));
          }
        })
        .catch((e) => console.error("Error reading journals for search:", e));

      // Load stories
      setLoading(true);
      apiService.fetchStoriesFromBackend()
        .then((data) => {
          if (Array.isArray(data)) {
            setCommunityStories(data.slice(0, 5));
          }
        })
        .catch((err) => console.warn("Search modal story fetch error:", err))
        .finally(() => setLoading(false));
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Filter features
  const filteredFeatures = APP_FEATURES.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  );

  // Filter journals
  const filteredJournals = recentJournals.filter(
    (j) =>
      j.title?.toLowerCase().includes(q) ||
      j.content?.toLowerCase().includes(q) ||
      j.mood?.toLowerCase().includes(q)
  );

  // Filter stories
  const filteredStories = communityStories.filter(
    (s) =>
      s.title?.toLowerCase().includes(q) ||
      s.content?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q)
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const hasResults =
    filteredFeatures.length > 0 ||
    filteredJournals.length > 0 ||
    filteredStories.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#2B231D]/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Modal backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#FFFBF7] dark:bg-[#251E18] border border-[#E6DCCD] dark:border-[#382D25] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10">
        {/* Search Header */}
        <div className="p-4 border-b border-[#EFE6DC] dark:border-[#382D25] flex items-center gap-3 bg-[#FAF6F0] dark:bg-[#2B231D]">
          <Search className="w-5 h-5 text-[#E07A5F] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features, journals, stories, or tips..."
            className="w-full bg-transparent text-sm sm:text-base text-[#3B281C] dark:text-[#FFFBF7] placeholder-[#8C7667] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#EFE6DC] dark:bg-[#382D25] text-[#705D52] dark:text-[#C5B5A7] hover:bg-[#E2CEBC] dark:hover:bg-[#483A30] transition shrink-0 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 flex-1">
          {!q && (
            <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8C7667] dark:text-[#A89689] flex items-center gap-1.5">
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Quick Navigation & Features</span>
            </div>
          )}

          {/* Features Section */}
          {filteredFeatures.length > 0 && (
            <div className="space-y-1">
              {q && (
                <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8C7667] dark:text-[#A89689]">
                  Features & Tools ({filteredFeatures.length})
                </div>
              )}
              {filteredFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FAF6F0] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] text-[#5C3D2E] dark:text-[#E2C0A8] group-hover:bg-[#5C3D2E] group-hover:text-[#FFFBF7] transition">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#3B281C] dark:text-[#FFFBF7]">
                          {item.name}
                        </div>
                        <div className="text-xs text-[#8C7667] dark:text-[#A89689]">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C7667] group-hover:text-[#E07A5F] group-hover:translate-x-0.5 transition" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent Journals Section */}
          {filteredJournals.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8C7667] dark:text-[#A89689] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Journal Entries ({filteredJournals.length})</span>
              </div>
              {filteredJournals.map((j) => (
                <button
                  key={j.id || j.date}
                  onClick={() => handleSelect("/app/journal")}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#FAF6F0] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] text-[#5C3D2E] dark:text-[#E2C0A8]">
                      <FileText className="w-4.5 h-4.5 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#3B281C] dark:text-[#FFFBF7] truncate">
                        {j.title || "Untitled Entry"}
                      </div>
                      <div className="text-xs text-[#8C7667] dark:text-[#A89689] truncate">
                        {j.content || j.date || "Personal reflection"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#8C7667] shrink-0 ml-2">
                    {j.date}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Community Stories Section */}
          {filteredStories.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8C7667] dark:text-[#A89689] flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Bloom Stories ({filteredStories.length})</span>
              </div>
              {filteredStories.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect("/app/stories")}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F5EFE6] dark:hover:bg-[#342B24] transition text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#FAF6F0] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] text-[#5C3D2E] dark:text-[#E2C0A8]">
                      <MessageSquare className="w-4.5 h-4.5 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#3B281C] dark:text-[#FFFBF7] truncate">
                        {s.title}
                      </div>
                      <div className="text-xs text-[#8C7667] dark:text-[#A89689] truncate">
                        {s.category} • {s.content?.slice(0, 60)}...
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C7667] group-hover:text-[#E07A5F] shrink-0 ml-2 transition" />
                </button>
              ))}
            </div>
          )}

          {/* No Results found */}
          {q && !hasResults && (
            <div className="py-8 text-center text-[#8C7667] dark:text-[#A89689]">
              <p className="text-sm font-semibold">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for "BloomBot", "Journal", "Mood", or "Stories"</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-[#FAF6F0] dark:bg-[#2B231D] border-t border-[#EFE6DC] dark:border-[#382D25] flex items-center justify-between text-[11px] text-[#8C7667] dark:text-[#A89689]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold bg-[#EFE6DC] dark:bg-[#382D25] px-1.5 py-0.5 rounded text-[10px]">
              <Command className="w-3 h-3" /> K
            </span>
            <span>to open anytime</span>
          </div>
          <div className="flex items-center gap-1">
            <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>MindBloom Quick Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
