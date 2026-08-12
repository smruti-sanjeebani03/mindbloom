import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  Heart,
  BookOpen,
  X,
  Search,
  Plus,
  Sparkles,
  Lock,
} from "lucide-react";

import { CozyBadge } from "../../components/common/UIComponents";

import {
  AutumnLeafIllustration,
  StorytellerCatIllustration,
} from "../../components/illustrations/CozyIllustrations";

import { useAuth } from "../../contexts/AuthContext";

/*
|--------------------------------------------------------------------------
| STORIES OF HOPE
|--------------------------------------------------------------------------
| These are curated reading stories.
|
| IMPORTANT:
| - They are NOT loaded from /api/stories/
| - User-submitted Bloom Stories do NOT appear here
| - This page is purely for reading and inspiration
|--------------------------------------------------------------------------
*/

const CATEGORIES = [
  "All",
  "Anxiety",
  "Stress",
  "Burnout",
  "Self Growth",
  "Personal Recovery",
  "Relationships",
  "Other",
];

const FALLBACK_STORIES = [
  {
    id: "hope-1",
    title: "Finding Peace After Months of Overwhelm",
    category: "Anxiety",
    author_name: "A Hopeful Member",
    is_anonymous: false,
    created_at: "2 days ago",
    likes: 18,
    content:
      "There was a time when waking up felt like carrying a heavy weight. Through daily micro-journaling and breathing pauses, I slowly learned to quiet my mind. Healing isn't linear, but every small breath counts. When I started writing down my feelings without judgment, things began to shift. If you are going through a dark night right now, please know that morning always comes.",
  },

  {
    id: "hope-2",
    title: "Learning to Bloom at My Own Pace",
    category: "Self Growth",
    author_name: "Anonymous Sprout",
    is_anonymous: true,
    created_at: "4 days ago",
    likes: 24,
    content:
      "I used to compare my journey to everyone else's highlight reel. Taking a step back and practicing self-compassion helped me realize that my pace is valid. You don't have to rush your healing. Giving myself permission to rest was the single most courageous decision I made this year.",
  },

  {
    id: "hope-3",
    title: "Overcoming Workplace Burnout & Finding Joy",
    category: "Burnout",
    author_name: "Elena M.",
    is_anonymous: false,
    created_at: "1 week ago",
    likes: 31,
    content:
      "Working 70-hour weeks left me emotionally exhausted. Taking time to set firm boundaries and journaling every evening helped me rediscover my passion and reconnect with loved ones. I learned that saying 'no' to overwork is saying 'yes' to my own peace.",
  },

  {
    id: "hope-4",
    title: "Small Steps Through Seasonal Anxiety",
    category: "Anxiety",
    author_name: "Quiet Observer",
    is_anonymous: true,
    created_at: "2 weeks ago",
    likes: 15,
    content:
      "As the seasons change, my mood often dips. Joining this community reminded me that asking for help is a strength, not a weakness. Everyday reflection keeps me grounded in what truly matters.",
  },

  {
    id: "hope-5",
    title: "Rebuilding Resilience After Personal Loss",
    category: "Personal Recovery",
    author_name: "Marcus T.",
    is_anonymous: false,
    created_at: "3 weeks ago",
    likes: 42,
    content:
      "Grief takes time, and healing is messy. Sharing moments of honesty with fellow community members reminded me that hope quietens despair step by step.",
  },

  {
    id: "hope-6",
    title: "Finding Harmony in Quiet Mornings",
    category: "Stress",
    author_name: "Sarah Jenkins",
    is_anonymous: false,
    created_at: "1 month ago",
    likes: 29,
    content:
      "Replacing morning scroll time with five minutes of mindful reflection transformed my relationship with stress. Small habits pave the way to peace. I learned that I don't need to fix everything at once. Sometimes a quiet morning is enough to begin again.",
  },
];

export const StoriesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | AUTHENTICATION
  |--------------------------------------------------------------------------
  */

  const isAuthenticated = Boolean(
    user &&
      user.isLoggedIn !== false &&
      (user.email || user.name)
  );

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedStory, setSelectedStory] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | SIGN-IN REDIRECT
  |--------------------------------------------------------------------------
  */

  const handleSignInRedirect = () => {
    navigate("/login", {
      state: {
        from: "/stories",
        message:
          "Sign in to unlock the complete collection of inspiring stories from the MindBloom community and share your own journey.",
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | DATE FORMATTER
  |--------------------------------------------------------------------------
  */

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";

    if (
      dateString.includes("ago") ||
      dateString.includes("Recent")
    ) {
      return dateString;
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | FILTER STORIES
  |--------------------------------------------------------------------------
  */

  const filteredStories = FALLBACK_STORIES.filter(
    (story) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (
          story.category &&
          story.category.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

      const query =
        searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        story.title
          .toLowerCase()
          .includes(query) ||
        story.content
          .toLowerCase()
          .includes(query) ||
        story.category
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    }
  );

  /*
  |--------------------------------------------------------------------------
  | PUBLIC PREVIEW
  |--------------------------------------------------------------------------
  |
  | Logged out:
  |   First 2 = readable
  |   Remaining = locked
  |
  | Logged in:
  |   Everything = readable
  |--------------------------------------------------------------------------
  */

  const unlockedStories = isAuthenticated
    ? filteredStories
    : filteredStories.slice(0, 2);

  const lockedStories = isAuthenticated
    ? []
    : filteredStories.slice(2);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#FFFBF7] dark:bg-[#1A1412] text-[#3B281C] dark:text-[#FFFBF7] py-12 px-4 sm:px-6 lg:px-8 space-y-12">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="max-w-4xl mx-auto text-center space-y-4">

        <div className="flex justify-center mb-1">
          <StorytellerCatIllustration
            className="w-32 h-32 sm:w-40 sm:h-40 filter drop-shadow-xs"
          />
        </div>

        <CozyBadge icon={Sprout}>
          🌱 Stories from MindBloom Members
        </CozyBadge>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
          Stories of Hope
        </h1>

        <p className="text-base sm:text-lg text-[#5C3A2E]/80 dark:text-[#D4C3B3] max-w-2xl mx-auto leading-relaxed font-serif">
          Real stories of courage, healing, growth,
          and new beginnings. Every journey reminds
          us that healing is possible and that nobody
          has to walk alone.
        </p>

        {/* Authenticated users can go directly to Bloom Stories */}

        {isAuthenticated && (
          <div className="pt-2">

            <Link
              to="/app/stories"
              className="cozy-btn-primary text-xs sm:text-sm px-6 py-2.5 inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />

              <span>
                Share Your Story
              </span>
            </Link>

          </div>
        )}

      </div>

      {/* =====================================================
          SEARCH + CATEGORY FILTER
      ===================================================== */}

      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* SEARCH */}

          <div className="relative w-full sm:w-72">

            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667]" />

            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF3EA] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#382D25] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
            />

          </div>

          {/* CATEGORY BUTTONS */}

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">

            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory ===
                  category
                    ? "bg-[#E07A5F] text-white shadow-sm"
                    : "bg-[#FAF3EA] dark:bg-[#251E19] text-[#705D52] dark:text-[#D4C3B3] hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C]"
                }`}
              >
                {category}
              </button>
            ))}

          </div>

        </div>

      </div>

      {/* =====================================================
          STORIES
      ===================================================== */}

      {filteredStories.length === 0 ? (

        <div className="cozy-card p-12 text-center space-y-3 max-w-md mx-auto">

          <AutumnLeafIllustration
            className="w-16 h-16 mx-auto opacity-60"
          />

          <h3 className="font-serif text-lg font-bold">
            No stories found
          </h3>

          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3]">
            Try selecting another category or
            resetting your search.
          </p>

        </div>

      ) : (

        <div className="space-y-6 max-w-5xl mx-auto">

          {/* =================================================
              READABLE STORIES
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {unlockedStories.map((story) => (

              <article
                key={story.id}
                className="cozy-card p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#E07A5F]/50 transition-all group shadow-sm bg-[#FFFBF7] dark:bg-[#221B16]"
              >

                <div className="space-y-3">

                  <div className="flex items-center justify-between">

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E07A5F]/15 text-[#E07A5F] dark:bg-[#E07A5F]/25">
                      {story.category}
                    </span>

                    <span className="text-[11px] font-medium text-[#8C7667] dark:text-[#B09E91]">
                      {formatDate(
                        story.created_at
                      )}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStory(
                        story
                      )
                    }
                    className="text-left w-full"
                  >
                    <h3 className="font-serif text-lg sm:text-xl font-bold group-hover:text-[#E07A5F] transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                  </button>

                  <p className="text-xs sm:text-sm text-[#5C3D2E]/90 dark:text-[#D4C3B3] leading-relaxed line-clamp-3 font-serif">
                    "{story.content}"
                  </p>

                </div>

                <div className="pt-4 border-t border-[#E6DCCD]/60 dark:border-[#3E3228]/60 flex items-center justify-between text-xs text-[#8C7667] dark:text-[#B09E91]">

                  <span className="font-medium text-[#3B281C] dark:text-[#FFFBF7]">
                    By{" "}
                    {story.is_anonymous
                      ? "Anonymous"
                      : story.author_name ||
                        "Anonymous"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStory(
                        story
                      )
                    }
                    className="text-xs font-semibold text-[#E07A5F] hover:text-[#B8543B] flex items-center gap-1 transition"
                  >
                    <span>
                      Read More
                    </span>

                    <BookOpen className="w-3.5 h-3.5" />
                  </button>

                </div>

              </article>

            ))}

          </div>

          {/* =================================================
              LOCKED STORIES — ONLY WHEN LOGGED OUT
          ================================================= */}

          {!isAuthenticated &&
            lockedStories.length > 0 && (

              <div className="relative rounded-3xl overflow-hidden p-1 border border-[#EAD8C7] dark:border-[#3E3228] mt-6">

                {/* BLURRED PREVIEW STORIES */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 filter blur-md select-none pointer-events-none opacity-50 p-4">

                  {lockedStories
                    .slice(0, 2)
                    .map((story) => (

                      <div
                        key={story.id}
                        className="cozy-card p-6 rounded-3xl flex flex-col justify-between space-y-4 bg-[#FFFBF7] dark:bg-[#221B16]"
                      >

                        <div className="space-y-3">

                          <div className="flex items-center justify-between">

                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E07A5F]/15 text-[#E07A5F]">
                              {story.category}
                            </span>

                            <span className="text-[11px] font-medium text-[#8C7667]">
                              {formatDate(
                                story.created_at
                              )}
                            </span>

                          </div>

                          <h3 className="font-serif text-lg font-bold">
                            {story.title}
                          </h3>

                          <p className="text-xs text-[#5C3D2E]/90 line-clamp-3 font-serif">
                            "{story.content}"
                          </p>

                        </div>

                        <div className="pt-4 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#8C7667]">

                          <span>
                            By{" "}
                            {story.is_anonymous
                              ? "Anonymous"
                              : story.author_name ||
                                "Anonymous"}
                          </span>

                          <span className="text-[#E07A5F] font-semibold">
                            Read More
                          </span>

                        </div>

                      </div>

                    ))}

                </div>

                {/* FROSTED GLASS */}

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 sm:p-10 bg-[#FFFBF7]/85 dark:bg-[#1A1412]/90 backdrop-blur-md text-center space-y-5 rounded-3xl border border-[#EAD8C7]/60 dark:border-[#3E3228]/60 shadow-xl">

                  <div className="w-14 h-14 rounded-2xl bg-[#E07A5F]/15 dark:bg-[#E07A5F]/25 text-[#E07A5F] flex items-center justify-center shadow-inner">

                    <Sprout className="w-7 h-7" />

                  </div>

                  <div className="space-y-3 max-w-lg">

                    <h3 className="font-serif text-2xl sm:text-3xl font-extrabold">
                      Want to read more?
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5C3D2E]/90 dark:text-[#D4C3B3] leading-relaxed font-serif">
                      Sign in to unlock the complete
                      collection of inspiring stories
                      from the MindBloom community.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleSignInRedirect
                    }
                    className="cozy-btn-primary text-xs sm:text-sm px-8 py-3.5 inline-flex items-center gap-2.5 shadow-lg hover:scale-105 transition-all font-semibold"
                  >

                    <Lock className="w-4 h-4" />

                    <span>
                      🔐 Sign In to Continue
                    </span>

                  </button>

                </div>

              </div>

            )}

        </div>

      )}

      {/* =====================================================
          AUTHENTICATED SHARE BANNER
      ===================================================== */}

      {isAuthenticated && (

        <div className="p-8 rounded-3xl max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#EAD8C7] dark:border-[#3E3228] bg-[#FFFBF7] dark:bg-[#251E19] shadow-md">

          <div className="space-y-2 text-center sm:text-left">

            <h3 className="font-serif text-xl font-bold flex items-center justify-center sm:justify-start gap-2">

              <Sparkles className="w-5 h-5 text-[#E07A5F]" />

              <span>
                Have a Story of Hope to Share?
              </span>

            </h3>

            <p className="text-xs sm:text-sm text-[#5C3D2E] dark:text-[#E8D8C8] font-medium max-w-xl leading-relaxed">
              Your words can be the quiet comfort
              someone needs today. Share your
              journey anonymously or with your name
              in MindBloom.
            </p>

          </div>

          <Link
            to="/app/stories"
            className="cozy-btn-primary text-xs sm:text-sm px-6 py-3 shrink-0 inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all"
          >

            <Plus className="w-4 h-4" />

            <span>
              Share Your Story
            </span>

          </Link>

        </div>

      )}

      {/* =====================================================
          STORY READING MODAL
      ===================================================== */}

      {selectedStory && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">

          <div className="bg-[#FFFBF7] dark:bg-[#221B16] border border-[#E6DCCD] dark:border-[#382D25] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">

            <button
              type="button"
              onClick={() =>
                setSelectedStory(null)
              }
              className="absolute top-4 right-4 text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] p-1.5 rounded-full hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C] transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* CATEGORY + DATE */}

            <div className="flex items-center gap-2">

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E07A5F]/15 text-[#E07A5F]">
                {selectedStory.category ||
                  "General"}
              </span>

              <span className="text-xs text-[#8C7667] dark:text-[#B09E91]">
                {formatDate(
                  selectedStory.created_at
                )}
              </span>

            </div>

            {/* TITLE */}

            <div className="space-y-3">

              <h2 className="font-serif text-2xl font-bold">
                {selectedStory.title}
              </h2>

              <div className="text-xs font-medium text-[#8C7667] dark:text-[#B09E91]">
                By{" "}
                {selectedStory.is_anonymous
                  ? "Anonymous"
                  : selectedStory.author_name ||
                    "Anonymous"}
              </div>

            </div>

            {/* CONTENT */}

            <div className="text-xs sm:text-sm text-[#5C3D2E]/90 dark:text-[#D4C3B3] leading-relaxed font-serif whitespace-pre-line border-t border-b border-[#E6DCCD]/60 dark:border-[#3E3228]/60 py-5">
              {selectedStory.content}
            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between pt-2">

              <div className="flex items-center gap-2 text-xs text-[#8C7667]">

                <Heart className="w-4 h-4 text-[#E07A5F]" />

                <span>
                  {selectedStory.likes || 0}{" "}
                  members resonated with this
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedStory(null)
                }
                className="cozy-btn-secondary text-xs px-5 py-2"
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