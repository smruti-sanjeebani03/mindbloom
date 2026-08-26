import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  Heart,
  BookOpen,
  X,
  Search,
  Plus,
  Sparkles,
  Lock
} from "lucide-react";
import { CozyBadge } from "../../components/common/UIComponents";
import {
  AutumnLeafIllustration,
  StorytellerCatIllustration
} from "../../components/illustrations/CozyIllustrations";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";

const CATEGORIES = [
  "All",
  "Anxiety",
  "Stress",
  "Burnout",
  "Self Growth",
  "Personal Recovery",
  "Relationships",
  "Other"
];

export const FALLBACK_STORIES = [
  {
    id: "f1",
    title: "Finding Peace After Months of Overwhelm",
    category: "Anxiety",
    author_name: "A Hopeful Member",
    is_anonymous: false,
    created_at: "2 days ago",
    likes: 18,
    content: "There was a time when waking up felt like carrying a heavy weight. Through daily micro-journaling and breathing pauses, I slowly learned to quiet my mind. Healing isn't linear, but every small breath counts. When I started writing down my feelings without judgment, things began to shift. If you are going through a dark night right now, please know that morning always comes."
  },
  {
    id: "f2",
    title: "Learning to Bloom at My Own Pace",
    category: "Self Growth",
    author_name: "Anonymous Sprout",
    is_anonymous: true,
    created_at: "4 days ago",
    likes: 24,
    content: "I used to compare my journey to everyone else's highlight reel. Taking a step back and practicing self-compassion helped me realize that my pace is valid. You don't have to rush your healing. Giving myself permission to rest was the single most courageous decision I made this year."
  },
  {
    id: "f3",
    title: "Overcoming Workplace Burnout & Finding Joy",
    category: "Burnout",
    author_name: "Elena M.",
    is_anonymous: false,
    created_at: "1 week ago",
    likes: 31,
    content: "Working 70-hour weeks left me emotionally exhausted. Taking time to set firm boundaries and journaling every evening helped me rediscover my passion and reconnect with loved ones. I learned that saying 'no' to overwork is saying 'yes' to my own peace."
  },
  {
    id: "f4",
    title: "Small Steps Through Seasonal Anxiety",
    category: "Anxiety",
    author_name: "Quiet Observer",
    is_anonymous: true,
    created_at: "2 weeks ago",
    likes: 15,
    content: "As the seasons change, my mood often dips. Joining this community reminded me that asking for help is a strength, not a weakness. Everyday reflection keeps me grounded in what truly matters."
  },
  {
    id: "f5",
    title: "Rebuilding Resilience after Personal Loss",
    category: "Personal Recovery",
    author_name: "Marcus T.",
    is_anonymous: false,
    created_at: "3 weeks ago",
    likes: 42,
    content: "Grief takes time, and healing is messy. Sharing moments of honesty with fellow community members reminded me that hope quietens despair step by step."
  },
  {
    id: "f6",
    title: "Finding Harmony in Quiet Mornings",
    category: "Stress",
    author_name: "Sarah Jenkins",
    is_anonymous: false,
    created_at: "1 month ago",
    likes: 29,
    content: "Replacing morning scroll time with five minutes of mindful reflection transformed my relationship with stress. Small habits pave the way to peace."
  }
];

export const filterMockStories = (category = "All", query = "") => {
  return FALLBACK_STORIES.filter((s) => {
    const matchesCategory =
      category === "All" ||
      (s.category && s.category.toLowerCase() === category.toLowerCase());
    const matchesQuery =
      !query ||
      (s.title && s.title.toLowerCase().includes(query.toLowerCase())) ||
      (s.content && s.content.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });
};

export const StoriesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = Boolean(user && user.isLoggedIn !== false && (user.email || user.name));

  const [stories, setStories] = useState(FALLBACK_STORIES);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    async function loadStories() {
      try {
        const fetchedStories = await apiService.fetchStoriesFromBackend();
        if (fetchedStories && fetchedStories.length > 0) {
          setStories(fetchedStories);
        }
      } catch (err) {
        console.warn("Using fallback stories:", err);
      }
    }
    loadStories();
  }, []);

  const handleCreateClick = () => {
    if (isAuthenticated) {
      navigate("/app/stories");
    } else {
      navigate("/register", { state: { from: "/app/stories" } });
    }
  };

  const filteredStories = stories.filter((story) => {
    const matchesCat =
      selectedCategory === "All" ||
      (story.category && story.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesQuery =
      !searchQuery ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const unlockedStories = filteredStories.slice(0, 2);
  const lockedStories = filteredStories.slice(2);

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#3B281C] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HERO SECTION */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#FAF6F0] via-[#FFFBF7] to-[#EAEFE6] p-8 sm:p-12 border border-[#E6DCCD] overflow-hidden shadow-xs">
          <div className="max-w-2xl space-y-4 relative z-10">
            <CozyBadge icon={Sprout}>🌱 Stories from MindBloom Members</CozyBadge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3B281C] tracking-tight leading-tight">
              Stories of Hope & Renewal
            </h1>
            <p className="text-sm sm:text-base text-[#705D52] leading-relaxed">
              Read real, empathetic journeys shared by our compassionate community.
              Sign up or log in to read full entries and publish your own story.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleCreateClick}
                className="cozy-btn-primary text-xs px-5 py-3 flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Share Your Story</span>
              </button>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="cozy-btn-secondary text-xs px-5 py-3 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                  <span>Join Community</span>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 bottom-4 opacity-80 pointer-events-none">
            <StorytellerCatIllustration className="w-64 h-64" />
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTER */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8C7667] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories by keyword..."
                className="cozy-input pl-10 text-xs w-full bg-[#FFFBF7]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-[#E07A5F] text-[#FFFBF7] shadow-xs"
                      : "bg-[#FAF6F0] text-[#705D52] border border-[#E6DCCD] hover:bg-[#EFE6DC]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STORIES LISTING */}
        {filteredStories.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#FAF6F0] border border-[#E6DCCD] space-y-3">
            <BookOpen className="w-8 h-8 text-[#D4A373] mx-auto opacity-60" />
            <h3 className="font-serif font-bold text-lg text-[#3B281C]">No stories found</h3>
            <p className="text-xs text-[#705D52]">Try selecting another category or resetting search terms.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* UNLOCKED STORIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unlockedStories.map((story) => (
                <div
                  key={story.id}
                  className="cozy-card p-6 bg-[#FFFBF7] border border-[#E6DCCD] hover:border-[#D4A373] transition shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#8C7667]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EAEFE6] text-[#4F5D3D] font-semibold text-[10px]">
                        {story.category || "General"}
                      </span>
                      <span>{story.created_at || "Recent"}</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#3B281C] leading-snug">
                      {story.title}
                    </h3>

                    <p className="text-xs text-[#5C3D2E] leading-relaxed line-clamp-4">
                      {story.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EFE6DC] text-xs">
                    <span className="text-[#8C7667] font-medium">
                      — {story.is_anonymous ? "Anonymous Sprout" : story.author_name || "Community Member"}
                    </span>
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="text-[#E07A5F] font-semibold hover:underline"
                    >
                      Read Full Story →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* LOCKED STORIES CONTAINER WITH FROSTED GLASS OVERLAY */}
            {!isAuthenticated && lockedStories.length > 0 && (
              <div className="relative rounded-3xl overflow-hidden border border-[#E6DCCD] bg-[#FAF6F0] p-6 sm:p-10 text-center space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 blur-xs pointer-events-none select-none">
                  {(lockedStories.length > 0 ? lockedStories.slice(0, 2) : FALLBACK_STORIES.slice(2, 4)).map((story) => (
                    <div key={story.id} className="cozy-card p-6 bg-[#FFFBF7] border border-[#E6DCCD] space-y-3">
                      <h4 className="font-serif font-bold text-base">{story.title}</h4>
                      <p className="text-xs text-[#705D52] line-clamp-2">{story.content}</p>
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 bg-[#FFFBF7]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFE6DC] text-[#E07A5F] flex items-center justify-center border border-[#E6DCCD]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h3 className="font-serif font-bold text-xl text-[#3B281C]">
                      Unlock All Community Stories
                    </h3>
                    <p className="text-xs text-[#705D52] leading-relaxed">
                      Create a free MindBloom account or log in to unlock full access to all member stories, save entries, and share your journey.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to="/register"
                      className="cozy-btn-primary text-xs px-6 py-2.5 shadow-sm"
                    >
                      Register for Free
                    </Link>
                    <Link
                      to="/login"
                      className="cozy-btn-secondary text-xs px-5 py-2.5"
                    >
                      Log In
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FULL STORY READING MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFBF7] border border-[#E6DCCD] rounded-3xl p-6 sm:p-8 w-full max-w-xl space-y-5 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E6DCCD] pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAEFE6] text-[#4F5D3D] font-semibold text-[10px]">
                  {selectedStory.category || "General"}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#3B281C]">
                  {selectedStory.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-[#8C7667] hover:text-[#3B281C] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5C3D2E] leading-relaxed whitespace-pre-wrap">
              {selectedStory.content}
            </p>

            <div className="pt-4 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#8C7667]">
              <span>By {selectedStory.is_anonymous ? "Anonymous Sprout" : selectedStory.author_name || "Member"}</span>
              <button
                onClick={() => setSelectedStory(null)}
                className="cozy-btn-secondary text-xs px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;