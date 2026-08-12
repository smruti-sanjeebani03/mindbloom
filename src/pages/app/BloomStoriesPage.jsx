import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Sprout,
  Flag,
  PenSquare,
  Search,
  Filter,
  X,
  Lock,
  BookOpen,
  Trash2,
  Edit3,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";

import {
  CozyCatLogo,
  MapleLeafIcon,
  AutumnLeafIllustration,
  StorytellerCatIllustration,
} from "../../components/illustrations/CozyIllustrations";

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = [
  "All",
  "Anxiety",
  "Stress",
  "Burnout",
  "Self Confidence",
  "Depression Recovery",
  "College Life",
  "Career",
  "Personal Growth",
  "Relationships",
  "Other",
];

const FORM_CATEGORIES = CATEGORIES.filter(
  (category) => category !== "All"
);

const REPORT_REASONS = [
  "Abuse",
  "Hate Speech",
  "Harassment",
  "Spam",
  "Misinformation",
  "Other",
];

/* =========================================================
   MOCK / COMMUNITY STORIES
========================================================= */

const MOCK_BLOOM_STORIES = [
  {
    id: "mock-1",
    title: "Learning to Bloom at My Own Pace",
    category: "Personal Growth",
    content:
      "I spent years comparing my journey with everyone else's. Eventually, I realised that healing does not have a deadline. Learning to celebrate small progress helped me become gentler with myself. I no longer need to have everything figured out to feel proud of where I am.",
    author_name: "Anonymous",
    is_anonymous: true,
    created_at: "2026-08-01T10:00:00",
    isMock: true,
  },

  {
    id: "mock-2",
    title: "Finding My Way Through College Burnout",
    category: "College Life",
    content:
      "There was a semester when every assignment felt impossible and every day felt exhausting. I slowly learned to stop treating rest as something I had to earn. Asking for help, taking small breaks, and focusing on one task at a time helped me find my rhythm again.",
    author_name: "A MindBloom Member",
    is_anonymous: true,
    created_at: "2026-07-28T10:00:00",
    isMock: true,
  },

  {
    id: "mock-3",
    title: "The Day I Finally Said No",
    category: "Self Confidence",
    content:
      "I used to say yes to everything because I was afraid of disappointing people. The first time I respectfully said no, I felt guilty. But that guilt slowly turned into relief. Boundaries didn't make me selfish. They helped me understand that my own wellbeing matters too.",
    author_name: "Anonymous",
    is_anonymous: true,
    created_at: "2026-07-25T10:00:00",
    isMock: true,
  },

  {
    id: "mock-4",
    title: "Small Steps Through Anxiety",
    category: "Anxiety",
    content:
      "My anxiety used to convince me that I had to solve everything immediately. I started practising something much simpler: one breath, one thought, one small action at a time. It didn't make everything disappear, but it made life feel manageable again.",
    author_name: "Quiet Observer",
    is_anonymous: true,
    created_at: "2026-07-20T10:00:00",
    isMock: true,
  },

  {
    id: "mock-5",
    title: "Choosing Rest Without Feeling Guilty",
    category: "Burnout",
    content:
      "I thought being productive every minute was proof that I was doing well. Eventually I realised that exhaustion isn't an achievement. Learning to rest without apologising for it became one of the most important parts of my recovery.",
    author_name: "A Hopeful Member",
    is_anonymous: true,
    created_at: "2026-07-15T10:00:00",
    isMock: true,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export const BloomStories = () => {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);

  const navigate = useNavigate();
  const location = useLocation();
  const feedRef = useRef(null);

  /* =======================================================
     FEED STATE
  ======================================================= */

  const [stories, setStories] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [showShareModal, setShowShareModal] =
    useState(false);

  const [activeStoryModal, setActiveStoryModal] =
    useState(null);

  const [reportingStory, setReportingStory] =
    useState(null);

  const [editingStory, setEditingStory] =
    useState(null);

  const [showThankYouModal, setShowThankYouModal] =
    useState(false);

  /* =======================================================
     SHARE FORM
  ======================================================= */

  const [formTitle, setFormTitle] =
    useState("");

  const [formCategory, setFormCategory] =
    useState("Anxiety");

  const [formContent, setFormContent] =
    useState("");

  const [publishOption, setPublishOption] =
    useState("anonymous");

  const [formErrors, setFormErrors] =
    useState({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =======================================================
     EDIT FORM
  ======================================================= */

  const [editTitle, setEditTitle] =
    useState("");

  const [editCategory, setEditCategory] =
    useState("Anxiety");

  const [editContent, setEditContent] =
    useState("");

  const [editIsAnonymous, setEditIsAnonymous] =
    useState(false);

  /* =======================================================
     REPORT FORM
  ======================================================= */

  const [reportReason, setReportReason] =
    useState("Abuse");

  const [reportDetails, setReportDetails] =
    useState("");

  const [reportSubmittedToast, setReportSubmittedToast] =
    useState(false);

  /* =========================================================
     OWNERSHIP CHECK
  ========================================================= */

  const isOwnStory = (story) => {
    if (!user || !story) {
      return false;
    }

    if (story.isMock) {
      return false;
    }

    /*
     * Anonymous stories must NEVER be marked
     * as the user's own story.
     */
    if (story.is_anonymous) {
      return false;
    }

    /*
     * Prefer backend user ID if available.
     */
    const userId =
      user.id ??
      user.user_id ??
      user.pk;

    const storyUserId =
      story.user_id ??
      story.userId ??
      (typeof story.user === "object"
        ? story.user?.id
        : story.user);

    if (
      userId != null &&
      storyUserId != null &&
      String(userId) === String(storyUserId)
    ) {
      return true;
    }

    /*
     * Fallback to name comparison.
     *
     * Your current submit logic sends the first name,
     * so we compare both full name and first name.
     */
    const storyAuthor =
      story.author_name
        ?.trim()
        .toLowerCase();

    const userName =
      user.name
        ?.trim()
        .toLowerCase();

    if (!storyAuthor || !userName) {
      return false;
    }

    const userFirstName =
      userName.split(/\s+/)[0];

    return (
      storyAuthor === userName ||
      storyAuthor === userFirstName
    );
  };

  /* =========================================================
     SORT STORIES
  ========================================================= */

  const sortStories = (storyList) => {
    return [...storyList].sort((a, b) => {
      const aIsMine = isOwnStory(a);
      const bIsMine = isOwnStory(b);

      /*
       * YOUR STORY ALWAYS COMES FIRST.
       */
      if (aIsMine && !bIsMine) {
        return -1;
      }

      if (!aIsMine && bIsMine) {
        return 1;
      }

      /*
       * Mock stories remain after the user's story.
       *
       * Real community stories are then ordered
       * newest first.
       */
      if (a.isMock && !b.isMock) {
        return 1;
      }

      if (!a.isMock && b.isMock) {
        return -1;
      }

      const dateA =
        new Date(a.created_at).getTime() || 0;

      const dateB =
        new Date(b.created_at).getTime() || 0;

      return dateB - dateA;
    });
  };

  /* =========================================================
     FILTER MOCK STORIES
  ========================================================= */

  const filterMockStories = () => {
    const query =
      searchQuery.trim().toLowerCase();

    return MOCK_BLOOM_STORIES.filter(
      (story) => {
        const matchesCategory =
          selectedCategory === "All" ||
          story.category === selectedCategory;

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

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );
  };

  /* =========================================================
     LOAD STORIES
  ========================================================= */

  const loadStories = async () => {
    setIsLoading(true);

    try {
      const backendStories =
        await apiService.fetchStoriesFromBackend(
          selectedCategory,
          searchQuery
        );

      const databaseStories =
        Array.isArray(backendStories)
          ? backendStories
          : [];

      /*
       * Mock stories + PostgreSQL stories.
       */
      const mockStories =
        filterMockStories();

      const combinedStories = [
        ...mockStories,
        ...databaseStories,
      ];

      /*
       * IMPORTANT:
       * Sort AFTER combining everything.
       *
       * Therefore:
       *
       * ❤️ Your Story
       * ↓
       * 🌱 Other database stories
       * ↓
       * 🌱 Mock stories
       */
      const sortedStories =
        sortStories(combinedStories);

      setStories(sortedStories);
    } catch (error) {
      console.error(
        "Failed to load Bloom Stories:",
        error
      );

      /*
       * Even if backend is unavailable,
       * the mock stories should still appear.
       */
      setStories(
        sortStories(filterMockStories())
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     LOAD WHEN CATEGORY CHANGES
  ========================================================= */

  useEffect(() => {
    loadStories();
  }, [selectedCategory]);

  /* =========================================================
     RESTORE SAVED DRAFT
  ========================================================= */

  useEffect(() => {
    const savedDraft =
      sessionStorage.getItem(
        "mindbloom_story_draft"
      );

    if (!savedDraft) {
      return;
    }

    try {
      const parsed =
        JSON.parse(savedDraft);

      if (
        parsed.title ||
        parsed.content
      ) {
        setFormTitle(
          parsed.title || ""
        );

        setFormCategory(
          parsed.category || "Anxiety"
        );

        setFormContent(
          parsed.content || ""
        );

        setPublishOption("profile");

        setShowShareModal(true);
      }
    } catch (error) {
      console.warn(
        "Failed to restore story draft:",
        error
      );
    }

    sessionStorage.removeItem(
      "mindbloom_story_draft"
    );
  }, [isAuthenticated]);

  /* =========================================================
     SYNC PUBLISH OPTION
  ========================================================= */

  useEffect(() => {
    if (isAuthenticated) {
      setPublishOption("profile");
    } else {
      setPublishOption("anonymous");
    }
  }, [isAuthenticated]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    loadStories();
  };

  /* =========================================================
     SCROLL
  ========================================================= */

  const scrollToFeed = () => {
    if (feedRef.current) {
      feedRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  /* =========================================================
     SHARE MODAL
  ========================================================= */

  const handleShareStoryClick = () => {
    setFormErrors({});
    setShowShareModal(true);
  };

  /* =========================================================
     CREATE STORY
  ========================================================= */

  const handleShareStory = async (event) => {
    event.preventDefault();

    setFormErrors({});

    const errors = {};

    if (!formTitle.trim()) {
      errors.title =
        "Please provide a title for your story.";
    }

    if (!formCategory) {
      errors.category =
        "Please select a category.";
    }

    if (!formContent.trim()) {
      errors.content =
        "Please write your story before sharing.";
    }

    if (
      Object.keys(errors).length > 0
    ) {
      setFormErrors(errors);
      return;
    }

    /*
     * Profile publishing requires login.
     */
    if (
      publishOption === "profile" &&
      !isAuthenticated
    ) {
      const draft = {
        title: formTitle,
        category: formCategory,
        content: formContent,
        publishOption: "profile",
      };

      sessionStorage.setItem(
        "mindbloom_story_draft",
        JSON.stringify(draft)
      );

      navigate("/login", {
        state: {
          from: location.pathname,
          message:
            "Please sign in to publish your story with your profile name. Your draft is saved!",
        },
      });

      return;
    }

    setIsSubmitting(true);

    const isAnonymous =
      publishOption === "anonymous";

    let authorName = "Anonymous";

    if (
      !isAnonymous &&
      user?.name
    ) {
      /*
       * Keep the existing behavior of displaying
       * the user's first name.
       *
       * isOwnStory() also understands this format.
       */
      const cleanName =
        user.name.trim();

      authorName =
        cleanName.split(/\s+/)[0] ||
        cleanName;
    }

    try {
      const result =
        await apiService.createStoryBackend({
          title: formTitle.trim(),
          category: formCategory,
          content: formContent.trim(),
          is_anonymous: isAnonymous,
          author_name: isAnonymous
            ? "Anonymous"
            : authorName,
        });

      if (result.success) {
        /*
         * Reset form.
         */
        setFormTitle("");
        setFormCategory("Anxiety");
        setFormContent("");

        setPublishOption(
          isAuthenticated
            ? "profile"
            : "anonymous"
        );

        setShowShareModal(false);

        setShowThankYouModal(true);

        /*
         * Reload and sort.
         *
         * Your story will now move to the top.
         */
        await loadStories();
      } else {
        if (result.errors) {
          setFormErrors(
            result.errors
          );
        } else {
          setFormErrors({
            general:
              result.message ||
              "Unable to submit story.",
          });
        }
      }
    } catch (error) {
      console.error(
        "Failed to submit story:",
        error
      );

      setFormErrors({
        general:
          "Something went wrong while sharing your story. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     EDIT MODAL
  ========================================================= */

  const openEditModal = (story) => {
    if (!isOwnStory(story)) {
      return;
    }

    setEditingStory(story);

    setEditTitle(
      story.title || ""
    );

    setEditCategory(
      story.category || "Anxiety"
    );

    setEditContent(
      story.content || ""
    );

    setEditIsAnonymous(
      Boolean(story.is_anonymous)
    );
  };

  /* =========================================================
     UPDATE STORY
  ========================================================= */

  const handleUpdateStory = async (event) => {
    event.preventDefault();

    if (!editingStory) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await apiService.updateStoryBackend(
          editingStory.id,
          {
            title: editTitle.trim(),
            category: editCategory,
            content: editContent.trim(),
            is_anonymous:
              editIsAnonymous,
            author_name:
              user?.name ||
              "MindBloom Member",
          }
        );

      if (result.success) {
        setEditingStory(null);

        if (
          activeStoryModal &&
          activeStoryModal.id ===
            editingStory.id
        ) {
          setActiveStoryModal(
            result.story
          );
        }

        await loadStories();
      } else {
        console.error(
          "Failed to update story:",
          result.message
        );
      }
    } catch (error) {
      console.error(
        "Failed to update story:",
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     DELETE STORY
  ========================================================= */

  const handleDeleteStory = async (
    storyId
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete your story?"
      )
    ) {
      return;
    }

    try {
      const result =
        await apiService.deleteStoryBackend(
          storyId
        );

      if (result.success) {
        if (
          activeStoryModal &&
          activeStoryModal.id ===
            storyId
        ) {
          setActiveStoryModal(null);
        }

        await loadStories();
      }
    } catch (error) {
      console.error(
        "Failed to delete story:",
        error
      );
    }
  };

  /* =========================================================
     REPORT STORY
  ========================================================= */

  const handleReportSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!reportingStory) {
      return;
    }

    try {
      const result =
        await apiService.reportStoryBackend(
          reportingStory.id,
          {
            reason: reportReason,
            details:
              reportDetails.trim(),
          }
        );

      if (result.success) {
        setReportingStory(null);

        setReportReason("Abuse");

        setReportDetails("");

        setReportSubmittedToast(true);

        setTimeout(() => {
          setReportSubmittedToast(
            false
          );
        }, 5000);
      }
    } catch (error) {
      console.error(
        "Failed to report story:",
        error
      );
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (value) => {
    if (!value) {
      return "Recently";
    }

    if (
      typeof value === "string" &&
      value.includes("ago")
    ) {
      return value;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     STORY CARD
  ========================================================= */

  const StoryCard = ({
    story,
    publicPreview = false,
  }) => {
    const mine =
      isOwnStory(story);

    return (
      <div
        className={`cozy-card-warm p-6 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md relative group ${
          mine
            ? "border-[#E07A5F]/60 shadow-md ring-1 ring-[#E07A5F]/10"
            : "border-[#E6DCCD] dark:border-[#382D25]"
        }`}
      >
        <div className="space-y-3">

          {/* HEADER */}

          <div className="flex items-center justify-between gap-2">

            <div className="flex items-center gap-2 flex-wrap">

              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FAF3EA] dark:bg-[#2D231C] text-[#8B5E3C] dark:text-[#E0A882] border border-[#E6DCCD] dark:border-[#382D25]">
                {story.category}
              </span>

              {story.isMock && (
                <span className="px-2 py-1 rounded-full text-[9px] font-semibold bg-[#889868]/10 text-[#6C7D4D]">
                  Community
                </span>
              )}

              {mine && (
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-[#E07A5F]/10 text-[#C45F45]">
                  ❤️ Your Story
                </span>
              )}

            </div>

            {!publicPreview && (
              <div className="flex items-center gap-2">

                {/* EDIT / DELETE */}

                {mine && (
                  <div className="flex items-center gap-1 bg-[#FFFBF7] dark:bg-[#2B231D] px-2 py-0.5 rounded-lg border border-[#E6DCCD] dark:border-[#382D25]">

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(story)
                      }
                      title="Edit your story"
                      className="p-1 text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteStory(
                          story.id
                        )
                      }
                      title="Delete story"
                      className="p-1 text-[#B8543B] hover:text-red-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                )}

                {/* REPORT */}

                {!story.isMock && (
                  <button
                    type="button"
                    onClick={() =>
                      setReportingStory(
                        story
                      )
                    }
                    className="text-[11px] text-[#8C7667] hover:text-[#B8543B] dark:hover:text-[#E07A5F] flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-[#F5EFE6] dark:hover:bg-[#342B24]"
                    title="Report story"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      Report
                    </span>
                  </button>
                )}

              </div>
            )}

          </div>

          {/* TITLE */}

          <h3
            onClick={() =>
              setActiveStoryModal(
                story
              )
            }
            className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7] hover:text-[#E07A5F] dark:hover:text-[#E07A5F] cursor-pointer transition line-clamp-2"
          >
            {story.title}
          </h3>

          {/* CONTENT */}

          <p className="text-xs sm:text-sm text-[#5C3D2E]/90 dark:text-[#D4C3B3] leading-relaxed line-clamp-3 font-serif">
            {story.content}
          </p>

        </div>

        {/* FOOTER */}

        <div className="pt-4 mt-4 border-t border-[#EFE6DC] dark:border-[#342B24] flex items-center justify-between text-xs text-[#8C7667] dark:text-[#B09E91]">

          <div className="flex items-center gap-2 min-w-0">

            <div className="w-6 h-6 rounded-full bg-[#FAF3EA] dark:bg-[#2D231C] border border-[#E6DCCD] dark:border-[#382D25] flex items-center justify-center text-[10px] font-bold text-[#5C3D2E] dark:text-[#E07A5F] shrink-0">
              {story.is_anonymous
                ? "A"
                : story.author_name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  "M"}
            </div>

            <span className="font-medium text-[#3B281C] dark:text-[#FFFBF7] truncate">
              {story.is_anonymous
                ? "Anonymous"
                : story.author_name}
            </span>

            <span className="text-[10px] opacity-60 whitespace-nowrap">
              • {formatDate(
                story.created_at
              )}
            </span>

          </div>

          <button
            type="button"
            onClick={() =>
              setActiveStoryModal(
                story
              )
            }
            className="text-xs font-semibold text-[#E07A5F] hover:text-[#B8543B] flex items-center gap-1 transition cursor-pointer shrink-0"
          >
            <span>Read More</span>
            <BookOpen className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* =====================================================
          REPORT SUCCESS TOAST
      ===================================================== */}

      {reportSubmittedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#3B281C] text-[#FFFBF7] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-[#E07A5F]/40 animate-slide-in">

          <ShieldCheck className="w-5 h-5 text-[#889868]" />

          <span className="text-xs font-medium">
            Thank you for helping keep Bloom Stories safe & encouraging! 🌸
          </span>

        </div>
      )}

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="cozy-card-warm p-6 sm:p-10 rounded-3xl relative overflow-hidden border border-[#E6DCCD] dark:border-[#382D25] shadow-sm">

        <div className="absolute right-[-20px] bottom-[-20px] opacity-15 dark:opacity-30 pointer-events-none">
          <AutumnLeafIllustration className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">

          <div className="shrink-0 flex flex-col items-center">

            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#FFFBF7] dark:bg-[#2A221C] border-2 border-[#EAD8C7] dark:border-[#3E3228] flex items-center justify-center p-2 shadow-md relative group">

              <StorytellerCatIllustration className="w-full h-full transform group-hover:scale-105 transition-transform" />

              <div className="absolute -top-2 -right-2 bg-[#E07A5F] text-white p-1 rounded-full shadow-xs">
                <MapleLeafIcon className="w-4 h-4" />
              </div>

            </div>

            <span className="text-[11px] font-bold text-[#8C7667] dark:text-[#B09E91] tracking-wider uppercase mt-2.5">
              Storyteller Mascot
            </span>

          </div>

          <div className="space-y-4 text-center md:text-left flex-1">

            <div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3B281C] dark:text-[#FFFBF7] leading-tight flex items-center justify-center md:justify-start gap-2">
                <span>
                  🌱 Welcome to Bloom Stories
                </span>
              </h1>

              <p className="text-xs sm:text-sm font-semibold text-[#8B5E3C] dark:text-[#E0A882] tracking-wide mt-1.5">
                Real stories. Real courage. Real hope.
              </p>

            </div>

            <div className="bg-[#FFFBF7]/80 dark:bg-[#2A221C]/80 p-4 sm:p-5 rounded-2xl border border-[#EAD8C7]/60 dark:border-[#3E3228]/60 shadow-xs">

              <p className="text-xs sm:text-sm text-[#5C3D2E]/90 dark:text-[#D4C3B3] leading-relaxed font-serif italic whitespace-pre-line">
                "Every story here comes from someone who chose courage over silence.

                Whether you're here to read, find hope, or share your own journey, we're grateful you're here.

                Your story might become the reason someone believes tomorrow can be a little brighter."
              </p>

            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">

              <button
                type="button"
                onClick={scrollToFeed}
                className="cozy-btn-secondary text-xs sm:text-sm px-5 py-2.5 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>📖 Read Stories</span>
              </button>

              <button
                type="button"
                onClick={
                  handleShareStoryClick
                }
                className="cozy-btn-primary text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>
                  ✍️ Share Your Story
                </span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          COMMUNITY FEED HEADER
      ===================================================== */}

      <div
        ref={feedRef}
        className="space-y-5 pt-2"
      >

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DCCD] dark:border-[#382D25] pb-4">

          <div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">

              <span>
                Community Stories
              </span>

              <MapleLeafIcon className="w-5 h-5 text-[#E07A5F]" />

            </h2>

            <p className="text-xs text-[#8C7667] dark:text-[#B09E91] mt-0.5">
              Read lived experiences, personal insights, and encouraging moments shared by members.
            </p>

          </div>

          {/* SEARCH */}

          <form
            onSubmit={
              handleSearchSubmit
            }
            className="relative w-full sm:w-64"
          >

            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />

            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFFBF7] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F]"
            />

          </form>

        </div>

        {/* CATEGORY PILLS */}

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">

          <Filter className="w-4 h-4 text-[#8C7667] shrink-0 mr-1 hidden sm:block" />

          {CATEGORIES.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory ===
                  category
                    ? "bg-[#5C3D2E] dark:bg-[#E07A5F] text-[#FFFBF7] font-semibold shadow-xs"
                    : "bg-[#FFFBF7] dark:bg-[#2B231D] text-[#705D52] dark:text-[#D4C3B3] border border-[#E6DCCD] dark:border-[#382D25] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24]"
                }`}
              >
                {category}
              </button>
            )
          )}

        </div>

      </div>

      {/* =====================================================
          STORIES
      ===================================================== */}

      {isLoading ? (

        <div className="py-16 text-center space-y-3">

          <div className="w-10 h-10 border-3 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-xs text-[#8C7667] font-serif italic">
            Gathering community stories with care...
          </p>

        </div>

      ) : stories.length === 0 ? (

        <div className="py-16 px-4 text-center cozy-card-warm rounded-3xl border border-[#E6DCCD] dark:border-[#382D25] max-w-lg mx-auto space-y-4">

          <div className="w-16 h-16 rounded-2xl bg-[#FFFBF7] dark:bg-[#2A221C] border border-[#EAD8C7] dark:border-[#3E3228] flex items-center justify-center mx-auto text-[#E07A5F]">

            <Sprout className="w-8 h-8" />

          </div>

          <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            No stories found in this category yet
          </h3>

          <p className="text-xs text-[#8C7667] dark:text-[#B09E91] leading-relaxed">
            Be the first person to share a story or reflection in{" "}
            {selectedCategory === "All"
              ? "this space"
              : selectedCategory}
            . Your story could bring hope to someone today!
          </p>

          <button
            type="button"
            onClick={
              handleShareStoryClick
            }
            className="cozy-btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2 cursor-pointer"
          >
            <PenSquare className="w-4 h-4" />
            <span>
              Share Your Story
            </span>
          </button>

        </div>

      ) : isAuthenticated ? (

        /* ===================================================
           LOGGED-IN:
           SHOW ALL STORIES
        =================================================== */

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
            />
          ))}

        </div>

      ) : (

        /* ===================================================
           LOGGED-OUT:
           FIRST TWO READABLE
           REMAINDER LOCKED
        =================================================== */

        <div className="space-y-8">

          {/* FIRST TWO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {stories
              .slice(0, 2)
              .map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  publicPreview
                />
              ))}

          </div>

          {/* LOCKED STORIES */}

          <div className="relative mt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 filter blur-sm select-none pointer-events-none opacity-40">

              {(
                stories.length > 2
                  ? stories.slice(2)
                  : MOCK_BLOOM_STORIES.slice(
                      2
                    )
              ).map(
                (story, index) => (

                  <div
                    key={
                      story.id ||
                      `locked-${index}`
                    }
                    className="cozy-card-warm p-6 rounded-2xl border border-[#E6DCCD] dark:border-[#382D25] flex flex-col justify-between"
                  >

                    <div className="space-y-3">

                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FAF3EA] text-[#8B5E3C]">
                        {story.category}
                      </span>

                      <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                        {story.title}
                      </h3>

                      <p className="text-xs text-[#5C3D2E] dark:text-[#D4C3B3] line-clamp-3 font-serif">
                        {story.content}
                      </p>

                    </div>

                    <div className="pt-4 mt-4 border-t border-[#EFE6DC] flex justify-between text-xs text-[#8C7667]">

                      <span>
                        By{" "}
                        {story.is_anonymous
                          ? "Anonymous"
                          : story.author_name}
                      </span>

                      <span className="font-semibold text-[#E07A5F]">
                        Read More
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* SIGN IN OVERLAY */}

            <div className="absolute inset-0 flex items-center justify-center p-4 z-10">

              <div className="cozy-card-warm p-8 sm:p-10 rounded-3xl text-center space-y-4 border-2 border-[#EAD8C7] dark:border-[#3E3228] shadow-2xl max-w-lg w-full bg-[#FFFBF7]/95 dark:bg-[#221B16]/95 backdrop-blur-md">

                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E07A5F]/15 dark:bg-[#E07A5F]/25 text-[#E07A5F] flex items-center justify-center">

                  <Sprout className="w-6 h-6" />

                </div>

                <div className="space-y-2">

                  <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#3B281C] dark:text-[#FFFBF7]">
                    More inspiring stories are waiting for you.
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C3D2E]/90 dark:text-[#D4C3B3] leading-relaxed font-serif">
                    Sign in to continue reading.
                  </p>

                </div>

                <div className="pt-2 flex justify-center">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/login",
                        {
                          state: {
                            from:
                              location.pathname,
                            message:
                              "Sign in to continue reading the complete collection and become part of the MindBloom community.",
                          },
                        }
                      )
                    }
                    className="cozy-btn-primary text-xs sm:text-sm px-8 py-3 flex items-center gap-2 shadow-lg cursor-pointer transform hover:scale-105 transition-all"
                  >

                    <Lock className="w-4 h-4" />

                    <span>
                      Sign In
                    </span>

                    <ArrowRight className="w-4 h-4" />

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          SHARE STORY MODAL
      ===================================================== */}

      {showShareModal && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">

          <div className="bg-[#FFFBF7] dark:bg-[#221B16] border border-[#E6DCCD] dark:border-[#382D25] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">

            <button
              type="button"
              onClick={() =>
                setShowShareModal(false)
              }
              className="absolute top-5 right-5 text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] p-1 rounded-full hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#342B24] pb-4">

              <div className="w-12 h-12 rounded-2xl bg-[#FAF3EA] dark:bg-[#2D231C] border border-[#E6DCCD] dark:border-[#382D25] flex items-center justify-center p-1 text-[#E07A5F] shrink-0">

                <StorytellerCatIllustration className="w-full h-full" />

              </div>

              <div>

                <h3 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Share Your Story 🌱
                </h3>

                <p className="text-xs text-[#8C7667] dark:text-[#B09E91]">
                  Your lived experience can illuminate someone else's healing journey.
                </p>

              </div>

            </div>

            {formErrors.general && (

              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400">
                {formErrors.general}
              </div>

            )}

            <form
              onSubmit={handleShareStory}
              className="space-y-4"
            >

              {/* TITLE */}

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Story Title{" "}
                  <span className="text-[#E07A5F]">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Finding Peace After Chronic Burnout"
                  value={formTitle}
                  onChange={(event) =>
                    setFormTitle(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F]"
                />

                {formErrors.title && (
                  <p className="text-[11px] text-red-500">
                    {formErrors.title}
                  </p>
                )}

              </div>

              {/* CATEGORY */}

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Category{" "}
                  <span className="text-[#E07A5F]">
                    *
                  </span>
                </label>

                <select
                  value={formCategory}
                  onChange={(event) =>
                    setFormCategory(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F]"
                >

                  {FORM_CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

                {formErrors.category && (
                  <p className="text-[11px] text-red-500">
                    {formErrors.category}
                  </p>
                )}

              </div>

              {/* CONTENT */}

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Your Personal Journey / Experience{" "}
                  <span className="text-[#E07A5F]">
                    *
                  </span>
                </label>

                <textarea
                  rows={6}
                  placeholder="Share your experience, what helped you through tough times, or encouragement for others..."
                  value={formContent}
                  onChange={(event) =>
                    setFormContent(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F] resize-none leading-relaxed font-serif"
                />

                {formErrors.content && (
                  <p className="text-[11px] text-red-500">
                    {formErrors.content}
                  </p>
                )}

              </div>

              {/* PUBLISH OPTIONS */}

              <div className="space-y-2 pt-1">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Publishing Option{" "}
                  <span className="text-[#E07A5F]">
                    *
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* ANONYMOUS */}

                  <button
                    type="button"
                    onClick={() =>
                      setPublishOption(
                        "anonymous"
                      )
                    }
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      publishOption ===
                      "anonymous"
                        ? "border-[#E07A5F] bg-[#FFF8F5] dark:bg-[#2F2119] ring-2 ring-[#E07A5F]/20"
                        : "border-[#E6DCCD] dark:border-[#382D25] bg-[#FAF3EA]/50 dark:bg-[#2D231C]/50 hover:border-[#D4C3B3]"
                    }`}
                  >

                    <div className="flex items-center justify-between mb-1">

                      <span className="text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                        🌸 Publish Anonymously
                      </span>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          publishOption ===
                          "anonymous"
                            ? "border-[#E07A5F] bg-[#E07A5F]"
                            : "border-[#D4C3B3]"
                        }`}
                      >

                        {publishOption ===
                          "anonymous" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}

                      </div>

                    </div>

                    <p className="text-[11px] text-[#8C7667] dark:text-[#B09E91] leading-tight">
                      Appears as{" "}
                      <span className="font-semibold">
                        Anonymous
                      </span>
                      .
                    </p>

                  </button>

                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={() =>
                      setPublishOption(
                        "profile"
                      )
                    }
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      publishOption ===
                      "profile"
                        ? "border-[#E07A5F] bg-[#FFF8F5] dark:bg-[#2F2119] ring-2 ring-[#E07A5F]/20"
                        : "border-[#E6DCCD] dark:border-[#382D25] bg-[#FAF3EA]/50 dark:bg-[#2D231C]/50 hover:border-[#D4C3B3]"
                    }`}
                  >

                    <div className="flex items-center justify-between mb-1">

                      <span className="text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                        👤 Publish With My Name
                      </span>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          publishOption ===
                          "profile"
                            ? "border-[#E07A5F] bg-[#E07A5F]"
                            : "border-[#D4C3B3]"
                        }`}
                      >

                        {publishOption ===
                          "profile" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}

                      </div>

                    </div>

                    <p className="text-[11px] text-[#8C7667] dark:text-[#B09E91] leading-tight">
                      {isAuthenticated
                        ? `Publishes using your profile name (${user?.name || "MindBloom Member"}).`
                        : "Requires signing in to attach to your profile."}
                    </p>

                  </button>

                </div>

                {!isAuthenticated &&
                  publishOption ===
                    "profile" && (

                    <div className="p-3 bg-[#FAF3EA] dark:bg-[#2D231C] border border-[#E07A5F]/30 rounded-xl text-xs text-[#8C3A27] dark:text-[#FFB199] flex items-center gap-2 mt-2">

                      <Lock className="w-4 h-4 shrink-0 text-[#E07A5F]" />

                      <span>
                        Signing in is required to publish with your profile name. Your draft will be saved automatically!
                      </span>

                    </div>
                  )}

              </div>

              {/* ACTIONS */}

              <div className="pt-2 flex items-center justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowShareModal(
                      false
                    )
                  }
                  className="px-5 py-2.5 text-xs font-medium text-[#705D52] dark:text-[#D4C3B3] hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C] rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cozy-btn-primary text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >

                  {isSubmitting ? (
                    <span>
                      Sharing...
                    </span>
                  ) : publishOption ===
                      "profile" &&
                    !isAuthenticated ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Sign In & Publish
                      </span>
                    </>
                  ) : (
                    <>
                      <Sprout className="w-4 h-4" />
                      <span>
                        🌱 Share Story
                      </span>
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          THANK YOU MODAL
      ===================================================== */}

      {showThankYouModal && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">

          <div className="bg-[#FFFBF7] dark:bg-[#221B16] border border-[#E6DCCD] dark:border-[#382D25] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center shadow-2xl relative">

            <div className="w-20 h-20 rounded-3xl bg-[#FAF3EA] dark:bg-[#2D231C] border-2 border-[#EAD8C7] dark:border-[#3E3228] flex items-center justify-center mx-auto p-2 relative">

              <CozyCatLogo className="w-full h-full" />

              <div className="absolute -top-2 -right-2 bg-[#889868] text-white p-1 rounded-full shadow-xs">
                <MapleLeafIcon className="w-4 h-4" />
              </div>

            </div>

            <div className="space-y-3">

              <h3 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                Thank you for trusting this space 🌸
              </h3>

              <p className="text-xs sm:text-sm text-[#5C3D2E] dark:text-[#D4C3B3] leading-relaxed font-serif italic">
                "Thank you for trusting this space with your story. 🌸 Someone may read your words and realise they are not alone. Your courage has the power to inspire hope."
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowThankYouModal(
                  false
                )
              }
              className="w-full cozy-btn-primary py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <span>
                Explore Stories
              </span>

              <BookOpen className="w-4 h-4" />

            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          STORY DETAIL MODAL
      ===================================================== */}

      {activeStoryModal && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">

          <div className="bg-[#FFFBF7] dark:bg-[#221B16] border border-[#E6DCCD] dark:border-[#382D25] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">

            <button
              type="button"
              onClick={() =>
                setActiveStoryModal(
                  null
                )
              }
              className="absolute top-5 right-5 text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] p-1 rounded-full hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">

              <div className="flex items-center gap-2 flex-wrap">

                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FAF3EA] dark:bg-[#2D231C] text-[#8B5E3C] dark:text-[#E0A882] border border-[#E6DCCD] dark:border-[#3E3228]">
                  {activeStoryModal.category}
                </span>

                {isOwnStory(
                  activeStoryModal
                ) && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E07A5F]/10 text-[#C45F45]">
                    ❤️ Your Story
                  </span>
                )}

                <span className="text-xs text-[#8C7667] dark:text-[#B09E91]">
                  • Published{" "}
                  {formatDate(
                    activeStoryModal.created_at
                  )}
                </span>

              </div>

              <h2 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7] leading-tight">
                {activeStoryModal.title}
              </h2>

              <div className="flex items-center gap-2 pt-1 pb-3 border-b border-[#EFE6DC] dark:border-[#342B24]">

                <div className="w-8 h-8 rounded-full bg-[#FAF3EA] dark:bg-[#2D231C] border border-[#E6DCCD] dark:border-[#382D25] flex items-center justify-center text-xs font-bold text-[#5C3D2E] dark:text-[#E07A5F]">

                  {activeStoryModal.is_anonymous
                    ? "A"
                    : activeStoryModal.author_name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "M"}

                </div>

                <div>

                  <span className="text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7] block">

                    {activeStoryModal.is_anonymous
                      ? "Anonymous Member"
                      : activeStoryModal.author_name}

                  </span>

                  <span className="text-[10px] text-[#8C7667] dark:text-[#B09E91]">
                    MindBloom Community Member
                  </span>

                </div>

              </div>

              <div className="text-sm text-[#3B281C]/90 dark:text-[#E0D5CC] leading-relaxed whitespace-pre-wrap font-serif pt-2">
                {activeStoryModal.content}
              </div>

            </div>

            <div className="pt-4 border-t border-[#EFE6DC] dark:border-[#342B24] flex items-center justify-between">

              {!activeStoryModal.isMock ? (
                <button
                  type="button"
                  onClick={() => {
                    setReportingStory(
                      activeStoryModal
                    );
                    setActiveStoryModal(
                      null
                    );
                  }}
                  className="text-xs text-[#8C7667] hover:text-[#B8543B] flex items-center gap-1.5 transition"
                >
                  <Flag className="w-4 h-4" />
                  <span>
                    Report Story
                  </span>
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={() =>
                  setActiveStoryModal(
                    null
                  )
                }
                className="cozy-btn-secondary text-xs px-5 py-2 font-semibold"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          REPORT MODAL
      ===================================================== */}

      {reportingStory && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">

          <div className="bg-[#FFFBF7] dark:bg-[#221B16] border border-[#E6DCCD] dark:border-[#382D25] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">

            <button
              type="button"
              onClick={() =>
                setReportingStory(
                  null
                )
              }
              className="absolute top-5 right-5 text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] p-1 rounded-full hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#342B24] pb-4">

              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-[#B8543B]">
                <Flag className="w-5 h-5" />
              </div>

              <div>

                <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Report Story
                </h3>

                <p className="text-xs text-[#8C7667] dark:text-[#B09E91]">
                  Help us maintain a safe & encouraging environment.
                </p>

              </div>

            </div>

            <form
              onSubmit={
                handleReportSubmit
              }
              className="space-y-4"
            >

              <div className="space-y-2">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Reason for Reporting
                </label>

                <div className="grid grid-cols-2 gap-2">

                  {REPORT_REASONS.map(
                    (reason) => (

                      <button
                        key={reason}
                        type="button"
                        onClick={() =>
                          setReportReason(
                            reason
                          )
                        }
                        className={`p-2.5 rounded-xl text-xs font-medium text-left border transition ${
                          reportReason ===
                          reason
                            ? "bg-[#5C3D2E] dark:bg-[#E07A5F] text-[#FFFBF7] border-[#5C3D2E] dark:border-[#E07A5F]"
                            : "bg-[#FAF6F0] dark:bg-[#2A221C] text-[#5C3D2E] dark:text-[#D4C3B3] border-[#E6DCCD] dark:border-[#382D25] hover:bg-[#F5EFE6]"
                        }`}
                      >
                        {reason}
                      </button>

                    )
                  )}

                </div>

              </div>

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Additional Details (Optional)
                </label>

                <textarea
                  rows={3}
                  placeholder="Provide context if helpful..."
                  value={reportDetails}
                  onChange={(event) =>
                    setReportDetails(
                      event.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F] resize-none"
                />

              </div>

              <div className="pt-2 flex items-center justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setReportingStory(
                      null
                    )
                  }
                  className="px-4 py-2 text-xs font-medium text-[#705D52] dark:text-[#D4C3B3] hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C] rounded-xl transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#B8543B] text-[#FFFBF7] px-5 py-2 rounded-xl text-xs font-semibold hover:bg-[#9E422C] transition shadow-xs"
                >
                  Submit Report
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          EDIT STORY MODAL
      ===================================================== */}

      {editingStory && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">

          <div className="bg-[#FFFBF7] dark:bg-[#221B16] border border-[#E6DCCD] dark:border-[#382D25] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 relative">

            <button
              type="button"
              onClick={() =>
                setEditingStory(
                  null
                )
              }
              className="absolute top-5 right-5 text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7] p-1 rounded-full hover:bg-[#F5EFE6] dark:hover:bg-[#2D231C] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#EFE6DC] dark:border-[#342B24] pb-4">

              <div className="w-10 h-10 rounded-2xl bg-[#FAF3EA] dark:bg-[#2D231C] border border-[#E6DCCD] dark:border-[#382D25] flex items-center justify-center text-[#E07A5F]">
                <Edit3 className="w-5 h-5" />
              </div>

              <div>

                <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Edit Your Story
                </h3>

                <p className="text-xs text-[#8C7667] dark:text-[#B09E91]">
                  Update your story title, category, or content.
                </p>

              </div>

            </div>

            <form
              onSubmit={
                handleUpdateStory
              }
              className="space-y-4"
            >

              {/* TITLE */}

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Story Title
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F]"
                />

              </div>

              {/* CATEGORY */}

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Category
                </label>

                <select
                  value={editCategory}
                  onChange={(event) =>
                    setEditCategory(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F]"
                >

                  {FORM_CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* CONTENT */}

              <div className="space-y-1.5">

                <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Story Content
                </label>

                <textarea
                  rows={6}
                  value={editContent}
                  onChange={(event) =>
                    setEditContent(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E6DCCD] dark:border-[#382D25] rounded-xl text-[#3B281C] dark:text-[#FFFBF7] focus:outline-none focus:border-[#E07A5F] resize-none leading-relaxed font-serif"
                />

              </div>

              {/* ANONYMOUS TOGGLE */}

              <div className="p-3 bg-[#FAF3EA] dark:bg-[#2D231C] border border-[#E6DCCD] dark:border-[#382D25] rounded-2xl flex items-center justify-between">

                <span className="text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  Publish Anonymously
                </span>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">

                  <input
                    type="checkbox"
                    checked={
                      editIsAnonymous
                    }
                    onChange={(event) =>
                      setEditIsAnonymous(
                        event.target.checked
                      )
                    }
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-[#D4C3B3] dark:bg-[#4A3D33] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E07A5F]" />

                </label>

              </div>

              {/* ACTIONS */}

              <div className="pt-2 flex items-center justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setEditingStory(
                      null
                    )
                  }
                  className="px-4 py-2 text-xs font-medium text-[#705D52] dark:text-[#D4C3B3] hover:bg-[#F5EFE6] rounded-xl transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cozy-btn-primary text-xs px-5 py-2 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default BloomStories;