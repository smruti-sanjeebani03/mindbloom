import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/apiService";

import {
  Mail,
  Flame,
  BookOpen,
  Award,
  PenTool,
  Check,
  Sparkles,
  Camera,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  UserX,
} from "lucide-react";

import { CozyBadge } from "../../components/common/UIComponents";

import {
  MapleLeafIcon,
  MapleLeafCluster,
} from "../../components/illustrations/CozyIllustrations";


export const ProfilePage = () => {
  const {
    user,
    setUser,
    addToast,
    deleteAccount,
  } = useAuth();


  // =========================================================
  // UI STATES
  // =========================================================

  const [isEditing, setIsEditing] = useState(false);

  const [showAiGenerator, setShowAiGenerator] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [isLoadingStats, setIsLoadingStats] =
    useState(true);


  // =========================================================
  // PROFILE FORM
  // =========================================================

  const isPreloadedBio =
    user?.bio &&
    (
      user.bio.includes("Embracing slow living") ||
      user.bio.includes("mindfulness & intentional growth")
    );

  const cleanBio = isPreloadedBio
    ? ""
    : user?.bio || "";

  const [name, setName] =
    useState(user?.name || "");

  const [bio, setBio] =
    useState(cleanBio);


  // Keep form synchronized with authenticated user.
  useEffect(() => {
    setName(user?.name || "");

    const nextBio =
      user?.bio &&
      (
        user.bio.includes("Embracing slow living") ||
        user.bio.includes("mindfulness & intentional growth")
      )
        ? ""
        : user?.bio || "";

    setBio(nextBio);
  }, [user]);


  // =========================================================
  // PROFILE STATISTICS
  // =========================================================

  const [totalJournals, setTotalJournals] =
    useState(0);

  const [totalMoodLogs, setTotalMoodLogs] =
    useState(0);

  const [streakDays, setStreakDays] =
    useState(0);

  const [wellnessScore, setWellnessScore] =
    useState(0);


  // =========================================================
  // AI AVATAR
  // =========================================================

  const [aiPrompt, setAiPrompt] =
    useState("");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const fileInputRef =
    useRef(null);


  // =========================================================
  // DATE HELPERS
  // =========================================================

  /*
   * Converts backend timestamps into the user's
   * local YYYY-MM-DD date.
   *
   * Example:
   *
   * Backend:
   * 2026-08-09T18:30:27Z
   *
   * India:
   * 2026-08-10
   *
   * This is important because Django stores UTC timestamps.
   */

  const getLocalDateString = (value) => {
    if (!value) {
      return null;
    }

    const valueString = String(value);

    // Already YYYY-MM-DD
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(valueString)
    ) {
      return valueString;
    }

    const parsedDate =
      new Date(valueString);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return null;
    }

    const year =
      parsedDate.getFullYear();

    const month =
      String(
        parsedDate.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        parsedDate.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // =========================================================
  // GET ACTIVITY DATE
  // =========================================================

  const getReflectionDate = (entry) => {
    if (!entry) {
      return null;
    }

    return (
      getLocalDateString(
        entry.reflection_date
      ) ||

      getLocalDateString(
        entry.date
      ) ||

      getLocalDateString(
        entry.created_at
      ) ||

      getLocalDateString(
        entry.createdAt
      ) ||

      getLocalDateString(
        entry.updated_at
      ) ||

      getLocalDateString(
        entry.updatedAt
      )
    );
  };


  // =========================================================
  // DATE WITHOUT TIME
  // =========================================================

  const getStartOfLocalDay = (date) => {
    const result = new Date(date);

    result.setHours(
      0,
      0,
      0,
      0
    );

    return result;
  };


  // =========================================================
  // CURRENT WELLNESS STREAK
  // =========================================================

  /*
   * IMPORTANT STREAK RULE
   *
   * Today:
   * Activity today -> streak continues.
   *
   * Yesterday:
   * If the most recent activity was yesterday,
   * the streak is still shown as active.
   *
   * Older than yesterday:
   * Streak is broken -> 0.
   *
   * This prevents the UI from suddenly showing
   * "0 Days" immediately after midnight.
   */

  const calculateReflectionStreak = (
    entries
  ) => {
    if (
      !Array.isArray(entries) ||
      entries.length === 0
    ) {
      return 0;
    }


    // -------------------------------------------------------
    // Collect valid local dates
    // -------------------------------------------------------

    const dates = entries
      .map(getReflectionDate)
      .filter(Boolean);


    if (dates.length === 0) {
      return 0;
    }


    // -------------------------------------------------------
    // Remove duplicate dates
    // -------------------------------------------------------

    const uniqueDates = [
      ...new Set(dates),
    ];


    // -------------------------------------------------------
    // Sort newest -> oldest
    // -------------------------------------------------------

    uniqueDates.sort(
      (a, b) =>
        new Date(`${b}T00:00:00`) -
        new Date(`${a}T00:00:00`)
    );


    if (
      uniqueDates.length === 0
    ) {
      return 0;
    }


    // -------------------------------------------------------
    // Today
    // -------------------------------------------------------

    const today =
      getStartOfLocalDay(
        new Date()
      );


    const todayString =
      [
        today.getFullYear(),

        String(
          today.getMonth() + 1
        ).padStart(2, "0"),

        String(
          today.getDate()
        ).padStart(2, "0"),
      ].join("-");


    // -------------------------------------------------------
    // Yesterday
    // -------------------------------------------------------

    const yesterday =
      new Date(today);

    yesterday.setDate(
      yesterday.getDate() - 1
    );


    const yesterdayString =
      [
        yesterday.getFullYear(),

        String(
          yesterday.getMonth() + 1
        ).padStart(2, "0"),

        String(
          yesterday.getDate()
        ).padStart(2, "0"),
      ].join("-");


    const latestDate =
      uniqueDates[0];


    /*
     * KEY FIX:
     *
     * Previously:
     *
     * latestDate !== today -> 0
     *
     * Now:
     *
     * latestDate === today -> active
     * latestDate === yesterday -> active
     * otherwise -> broken
     */

    if (
      latestDate !== todayString &&
      latestDate !== yesterdayString
    ) {
      return 0;
    }


    // -------------------------------------------------------
    // Start streak from latest activity
    // -------------------------------------------------------

    let streak = 1;


    for (
      let i = 1;
      i < uniqueDates.length;
      i++
    ) {
      const previousDate =
        new Date(
          `${uniqueDates[i - 1]}T00:00:00`
        );

      const currentDate =
        new Date(
          `${uniqueDates[i]}T00:00:00`
        );


      const difference =
        Math.round(
          (
            previousDate -
            currentDate
          ) /
            (1000 * 60 * 60 * 24)
        );


      if (difference === 1) {
        streak += 1;
      } else {
        break;
      }
    }


    return streak;
  };


  // =========================================================
  // LOAD REAL BACKEND DATA
  // =========================================================

  useEffect(() => {
    let isMounted = true;


    const loadProfileData =
      async () => {

        try {
          setIsLoadingStats(true);


          /*
           * Load all real backend data.
           */

          const [
            journalsData,
            moodsData,
            gratitudeData,
            selfTalkData,
            profileResult,
          ] = await Promise.all([

            apiService.getJournals(),

            apiService.getMoods(),

            apiService.getReflections(),

            apiService.fetchSelfTalkBackend(),

            apiService.fetchUserProfileBackend(),

          ]);


          if (!isMounted) {
            return;
          }


          // ---------------------------------------------------
          // Normalize API responses
          // ---------------------------------------------------

          const journals =
            Array.isArray(journalsData)
              ? journalsData
              : [];


          const moods =
            Array.isArray(moodsData)
              ? moodsData
              : [];


          const gratitude =
            Array.isArray(gratitudeData)
              ? gratitudeData
              : [];


          const selfTalk =
            Array.isArray(selfTalkData)
              ? selfTalkData
              : [];


          // ---------------------------------------------------
          // ALL WELLNESS ACTIVITIES
          // ---------------------------------------------------

          const streakEntries = [
            ...journals,
            ...moods,
            ...gratitude,
            ...selfTalk,
          ];


          // ---------------------------------------------------
          // COUNTS
          // ---------------------------------------------------

          const journalCount =
            journals.length;


          const moodCount =
            moods.length;


          // ---------------------------------------------------
          // STREAK
          // ---------------------------------------------------

          const reflectionStreak =
            calculateReflectionStreak(
              streakEntries
            );


          // ---------------------------------------------------
          // WELLNESS SCORE
          // ---------------------------------------------------

          const journalActivity =
            Math.min(
              journalCount,
              7
            );


          const moodActivity =
            Math.min(
              moodCount,
              7
            );


          const reflectionActivity =
            Math.min(
              gratitude.length +
                selfTalk.length,
              7
            );


          const activityTotal =
            journalActivity +
            moodActivity +
            reflectionActivity;


          const calculatedWellnessScore =
            Math.min(
              100,
              Math.round(
                (activityTotal / 21) *
                  100
              )
            );


          // ---------------------------------------------------
          // SET STATISTICS
          // ---------------------------------------------------

          setTotalJournals(
            journalCount
          );


          setTotalMoodLogs(
            moodCount
          );


          setStreakDays(
            reflectionStreak
          );


          setWellnessScore(
            Number.isFinite(
              calculatedWellnessScore
            )
              ? calculatedWellnessScore
              : 0
          );


          // ---------------------------------------------------
          // REAL PROFILE DATA
          // ---------------------------------------------------

          if (
            profileResult?.success &&
            profileResult?.data
          ) {

            const profileData =
              profileResult.data;


            const updatedUser = {
              ...user,

              name:
                profileData.full_name ||
                user?.name ||
                "",

              email:
                profileData.email ||
                user?.email ||
                "",

              bio:
                profileData.bio ??
                user?.bio ??
                "",

              date_joined:
                profileData.date_joined ||
                user?.date_joined ||
                null,

              chat_count:
                profileData.chat_count ??
                user?.chat_count ??
                0,

              subscription_type:
                profileData.subscription_type ||
                user?.subscription_type ||
                "free",

              subscription_status:
                profileData.subscription_status ||
                user?.subscription_status ||
                "inactive",

              subscription_expiry:
                profileData.subscription_expiry ||
                user?.subscription_expiry ||
                null,
            };


            setUser(
              updatedUser
            );
          }

        } catch (error) {

          console.error(
            "Error loading profile data:",
            error
          );


          if (isMounted) {

            setTotalJournals(0);

            setTotalMoodLogs(0);

            setStreakDays(0);

            setWellnessScore(0);
          }

        } finally {

          if (isMounted) {
            setIsLoadingStats(false);
          }
        }
      };


    loadProfileData();


    return () => {
      isMounted = false;
    };

  }, []);


  // =========================================================
  // MEMBER SINCE
  // =========================================================

  const formatMemberSince =
    (dateValue) => {

      if (!dateValue) {
        return "—";
      }


      const parsedDate =
        new Date(dateValue);


      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return "—";
      }


      return parsedDate.toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    };


  const memberSince =
    formatMemberSince(
      user?.date_joined ||
      user?.joinedDate ||
      user?.created_at
    );


  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSaveProfile =
    async (e) => {

      e.preventDefault();


      try {

        const result =
          await apiService.updateUserProfileBackend({
            full_name: name,
            bio: bio,
          });


        if (!result.success) {

          addToast(
            "Profile Update Failed",
            result.message ||
              "Could not update your profile.",
            "warning"
          );

          return;
        }


        const updatedUser = {
          ...user,

          name:
            result.data.full_name ||
            name,

          bio:
            result.data.bio ??
            bio,

          email:
            result.data.email ||
            user?.email ||
            "",

          date_joined:
            result.data.date_joined ||
            user?.date_joined ||
            null,

          chat_count:
            result.data.chat_count ??
            user?.chat_count ??
            0,

          subscription_type:
            result.data.subscription_type ||
            user?.subscription_type ||
            "free",

          subscription_status:
            result.data.subscription_status ||
            user?.subscription_status ||
            "inactive",

          subscription_expiry:
            result.data.subscription_expiry ||
            user?.subscription_expiry ||
            null,
        };


        // Keep local cache + AuthContext synchronized
        const cachedUser =
          apiService.updateUser(
            updatedUser
          );


        setUser(cachedUser);

        setIsEditing(false);


        addToast(
          "Profile Saved",
          "Your name and bio have been updated.",
          "success"
        );

      } catch (error) {

        console.error(
          "Error saving profile:",
          error
        );


        addToast(
          "Profile Update Failed",
          "Unable to save your profile. Please try again.",
          "warning"
        );
      }
    };


  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  const handleFileUpload =
    (e) => {

      const file =
        e.target.files?.[0];


      if (!file) {
        return;
      }


      if (
        file.size >
        5 * 1024 * 1024
      ) {

        addToast(
          "File too large",
          "Please select an image smaller than 5MB",
          "warning"
        );

        return;
      }


      const reader =
        new FileReader();


      reader.onloadend =
        () => {

          const dataUrl =
            reader.result;


          const updated =
            apiService.updateUser({
              avatarUrl: dataUrl,
            });


          setUser(updated);


          addToast(
            "Photo Uploaded",
            "Your custom profile photo is now active!",
            "success"
          );
        };


      reader.readAsDataURL(file);
    };


  // =========================================================
  // AI AVATAR
  // =========================================================

  const handleGenerateAiAvatar =
    async (e) => {

      e.preventDefault();


      const keyword =
        aiPrompt.trim() ||
        "Autumn Sage";


      setIsGenerating(true);


      try {

        const generatedUrl =
          await apiService.generateAiAvatar(
            keyword
          );


        const updated =
          apiService.updateUser({
            avatarUrl: generatedUrl,
          });


        setUser(updated);

        setIsGenerating(false);

        setShowAiGenerator(false);

        setAiPrompt("");


        addToast(
          "AI Avatar Created!",
          `Generated cozy AI avatar for "${keyword}"`,
          "success"
        );

      } catch (err) {

        console.error(
          "AI avatar generation failed",
          err
        );


        setIsGenerating(false);


        addToast(
          "Generation Error",
          "Could not generate AI avatar. Please try again.",
          "warning"
        );
      }
    };


  // =========================================================
  // REMOVE AVATAR
  // =========================================================

  const handleRemoveAvatar =
    () => {

      const updated =
        apiService.updateUser({
          avatarUrl: "",
        });


      setUser(updated);


      addToast(
        "Avatar Removed",
        "Restored default profile picture",
        "info"
      );
    };


  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const handleConfirmDelete =
    () => {

      deleteAccount();

      setShowDeleteModal(false);

      setName(
        "MindBloom Member"
      );

      setBio("");
    };


  // =========================================================
  // AVATAR
  // =========================================================

  const currentAvatarUrl =
    user?.avatarUrl ||
    `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(
      user?.name || "Member"
    )}&backgroundColor=efe6dc`;


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">

      {/* Hidden File Input */}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />


      {/* =====================================================
          MAIN PROFILE CARD
      ===================================================== */}

      <div className="cozy-card p-6 sm:p-8 space-y-6 relative overflow-hidden">

        <div className="absolute right-4 top-4 opacity-30 dark:opacity-45 pointer-events-none">
          <MapleLeafCluster className="w-28 h-28" />
        </div>


        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">

          {/* Avatar */}

          <div className="flex flex-col items-center gap-2">

            <img
              src={currentAvatarUrl}
              alt={
                user?.name ||
                "Member"
              }
              className="w-28 h-28 rounded-full object-cover border-4 border-[#F5EFE6] dark:border-[#382D25] shadow-md bg-[#FAF6F0]"
            />


            {/* Avatar Buttons */}

            <div className="flex items-center gap-1.5 mt-1">

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2B231D] border border-[#E6DCCD] dark:border-[#382D25] text-[#5C3D2E] dark:text-[#E2D4C3] hover:bg-[#EFE6DC] transition text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Upload</span>
              </button>


              <button
                type="button"
                onClick={() =>
                  setShowAiGenerator(
                    !showAiGenerator
                  )
                }
                className="px-2.5 py-1.5 rounded-xl bg-[#FAF2E6] dark:bg-[#342820] border border-[#D4A373] text-[#8B5E3C] dark:text-[#E8A87C] hover:bg-[#EFE0CD] transition text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>AI Avatar</span>
              </button>


              {user?.avatarUrl && (
                <button
                  type="button"
                  onClick={
                    handleRemoveAvatar
                  }
                  title="Remove avatar"
                  className="p-1.5 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

            </div>
          </div>


          {/* User Information */}

          <div className="space-y-3 text-center sm:text-left flex-1">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">

              <div>

                <h1 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center justify-center sm:justify-start gap-2">

                  <span>
                    {user?.name ||
                      "MindBloom Member"}
                  </span>

                  <MapleLeafIcon className="w-5 h-5 text-[#E07A5F]" />

                </h1>


                <p className="text-xs text-[#8C7667] flex items-center justify-center sm:justify-start gap-1 mt-0.5">

                  <Mail className="w-3.5 h-3.5" />

                  {user?.email ||
                    "No email set"}

                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setIsEditing(
                    !isEditing
                  )
                }
                className="cozy-btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 shrink-0"
              >

                <PenTool className="w-3.5 h-3.5" />

                <span>
                  {isEditing
                    ? "Close Form"
                    : "Edit Profile"}
                </span>

              </button>

            </div>


            {/* Bio */}

            {cleanBio ? (

              <p className="text-xs text-[#705D52] dark:text-[#D1C3B7] italic leading-relaxed bg-[#FAF6F0]/60 dark:bg-[#2A221C] p-3 rounded-xl border border-[#E6DCCD]/60 dark:border-[#382D25]">
                "{cleanBio}"
              </p>

            ) : (

              <p className="text-xs text-[#A08A7C] italic">
                No bio written yet. Click 'Edit Profile' to write a personal quote or reflection.
              </p>

            )}


            {/* Badges */}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">

              <CozyBadge variant="autumn">
                🔥{" "}
                {isLoadingStats
                  ? "..."
                  : streakDays}{" "}
                Day Streak
              </CozyBadge>


              <CozyBadge variant="sage">
                🌿 Wellness Score{" "}
                {isLoadingStats
                  ? "..."
                  : wellnessScore}%
              </CozyBadge>


              <CozyBadge variant="gold">
                ✨ Member since{" "}
                {memberSince}
              </CozyBadge>


              {user?.authProvider &&
                user.authProvider !==
                  "Email" && (

                  <CozyBadge variant="terracotta">

                    {user.authProvider ===
                    "Google"
                      ? "🌐 Google Authenticator"
                      : "👍 Facebook Authenticator"}

                  </CozyBadge>

                )}

            </div>

          </div>
        </div>


        {/* ===================================================
            AI AVATAR GENERATOR
        =================================================== */}

        {showAiGenerator && (

          <form
            onSubmit={
              handleGenerateAiAvatar
            }
            className="pt-4 border-t border-[#EFE6DC] dark:border-[#382D25] space-y-3 bg-[#FAF6F0] dark:bg-[#251E18] p-4 rounded-2xl border border-[#E6DCCD] dark:border-[#382D25]"
          >

            <div className="flex items-center justify-between">

              <label className="block text-xs font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-1.5">

                <Sparkles className="w-4 h-4 text-[#D4A373]" />

                <span>
                  Generate AI Avatar
                </span>

              </label>


              <button
                type="button"
                onClick={() =>
                  setShowAiGenerator(
                    false
                  )
                }
                className="text-[11px] text-[#8C7667] hover:underline"
              >
                Cancel
              </button>

            </div>


            <p className="text-[11px] text-[#705D52] dark:text-[#A39082]">
              Type a word, name, or vibe to instantly generate a unique cozy vector avatar:
            </p>


            <div className="flex flex-col sm:flex-row items-center gap-2">

              <input
                type="text"
                value={aiPrompt}
                onChange={(e) =>
                  setAiPrompt(
                    e.target.value
                  )
                }
                placeholder="e.g. 'autumn coffee', 'peaceful sage', 'mindful reader'..."
                className="cozy-input text-xs w-full flex-1"
                disabled={isGenerating}
              />


              <button
                type="submit"
                disabled={isGenerating}
                className="cozy-btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto bg-[#D4A373] hover:bg-[#B88758]"
              >

                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isGenerating
                      ? "animate-spin"
                      : ""
                  }`}
                />

                <span>
                  {isGenerating
                    ? "Generating..."
                    : "Generate & Set Avatar"}
                </span>

              </button>

            </div>


            <div className="space-y-1.5 pt-1">

              <span className="text-[10px] font-semibold text-[#8C7667] dark:text-[#A39082]">
                Try a suggestion:
              </span>


              <div className="flex flex-wrap gap-1.5">

                {[
                  "Autumn Sage",
                  "Cozy Tea Reader",
                  "Mindful Fox",
                  "Golden Hour Zen",
                  "Morning Rain",
                  "Forest Walker",
                  "Warm Hearth",
                ].map((sug) => (

                  <button
                    key={sug}
                    type="button"
                    onClick={() =>
                      setAiPrompt(sug)
                    }
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[#EFE6DC] dark:bg-[#342820] text-[#5C3D2E] dark:text-[#E8A87C] hover:bg-[#D4A373] hover:text-white dark:hover:bg-[#D4A373] dark:hover:text-white transition font-medium border border-[#E6DCCD] dark:border-[#42342B]"
                  >
                    ✨ {sug}
                  </button>

                ))}

              </div>
            </div>

          </form>

        )}


        {/* ===================================================
            EDIT PROFILE FORM
        =================================================== */}

        {isEditing && (

          <form
            onSubmit={
              handleSaveProfile
            }
            className="pt-4 border-t border-[#EFE6DC] dark:border-[#382D25] space-y-4"
          >

            <div>

              <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#E2D4C3] mb-1">
                Display Name
              </label>


              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter your display name..."
                className="cozy-input w-full text-xs"
              />

            </div>


            <div>

              <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#E2D4C3] mb-1">
                Bio / Personal Quote
              </label>


              <textarea
                rows={3}
                value={bio}
                onChange={(e) =>
                  setBio(
                    e.target.value
                  )
                }
                placeholder="Write your custom bio or personal reflection quote here..."
                className="cozy-input w-full text-xs leading-relaxed"
              />

            </div>


            <div className="flex items-center gap-2 pt-1">

              <button
                type="submit"
                className="cozy-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >

                <Check className="w-4 h-4" />

                <span>
                  Save Profile Changes
                </span>

              </button>


              <button
                type="button"
                onClick={() =>
                  setIsEditing(false)
                }
                className="cozy-btn-secondary text-xs py-2 px-3"
              >
                Cancel
              </button>

            </div>

          </form>

        )}

      </div>


      {/* =====================================================
          STATISTICS GRID
      ===================================================== */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* Total Journals */}

        <div className="cozy-card p-4 text-center space-y-1">

          <BookOpen className="w-5 h-5 mx-auto text-[#8B5E3C]" />

          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {isLoadingStats
              ? "..."
              : totalJournals}
          </div>

          <div className="text-[10px] text-[#8C7667]">
            Total Journals
          </div>

        </div>


        {/* Reflection / Wellness Streak */}

        <div className="cozy-card p-4 text-center space-y-1">

          <Flame className="w-5 h-5 mx-auto text-[#E07A5F]" />

          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {isLoadingStats
              ? "..."
              : `${streakDays} Days`}
          </div>

          <div className="text-[10px] text-[#8C7667]">
            Wellness Streak
          </div>

        </div>


        {/* Mood Logs */}

        <div className="cozy-card p-4 text-center space-y-1">

          <Award className="w-5 h-5 mx-auto text-[#D4A373]" />

          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {isLoadingStats
              ? "..."
              : totalMoodLogs}
          </div>

          <div className="text-[10px] text-[#8C7667]">
            Mood Logs
          </div>

        </div>


        {/* Wellness */}

        <div className="cozy-card p-4 text-center space-y-1">

          <Award className="w-5 h-5 mx-auto text-[#889868]" />

          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {isLoadingStats
              ? "..."
              : `${wellnessScore}%`}
          </div>

          <div className="text-[10px] text-[#8C7667]">
            Wellness Index
          </div>

        </div>

      </div>


      {/* =====================================================
          ACCOUNT MANAGEMENT
      ===================================================== */}

      <div className="cozy-card p-6 space-y-4 border border-[#E6DCCD] dark:border-[#382D25]">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2.5">

            <div className="w-8 h-8 rounded-xl bg-[#FBEBE6] dark:bg-[#321B16] text-[#E07A5F] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>


            <div>

              <h3 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7]">
                Account Management
              </h3>


              <p className="text-[11px] text-[#8C7667]">
                Manage account privacy, clear local data, or delete your profile
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setShowDeleteModal(
                true
              )
            }
            className="px-3 py-2 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition text-xs font-semibold flex items-center gap-1.5 border border-[#F0B8A8]"
          >

            <UserX className="w-3.5 h-3.5" />

            <span>
              Delete Account
            </span>

          </button>

        </div>

      </div>


      {/* =====================================================
          DELETE ACCOUNT MODAL
      ===================================================== */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">

          <div className="cozy-card max-w-md w-full p-6 space-y-5 bg-[#FFFBF7] dark:bg-[#251E18] border-2 border-[#E07A5F] shadow-xl">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-2xl bg-[#FBEBE6] text-[#B8543B] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>


              <div className="space-y-1">

                <h3 className="font-serif font-bold text-lg text-[#3B281C] dark:text-[#FFFBF7]">
                  Delete Account & Erase Data?
                </h3>


                <p className="text-xs text-[#705D52] dark:text-[#CBBBB0] leading-relaxed">
                  Are you sure you want to delete your account? This action is permanent and will completely erase:
                </p>

              </div>

            </div>


            <ul className="text-xs text-[#8C7667] dark:text-[#A8988C] space-y-1.5 pl-4 list-disc bg-[#FAF6F0] dark:bg-[#1D1713] p-3 rounded-xl border border-[#E6DCCD] dark:border-[#382D25]">

              <li>
                All journal entries and custom notes
              </li>

              <li>
                Your daily reflection streak history
              </li>

              <li>
                Saved mood logs and wellness score
              </li>

              <li>
                Your custom profile name, bio, and avatar
              </li>

            </ul>


            <div className="flex items-center justify-end gap-2 pt-2">

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                className="cozy-btn-secondary text-xs py-2 px-4"
              >
                Cancel & Keep Account
              </button>


              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                className="cozy-btn-primary text-xs py-2 px-4 bg-[#B8543B] hover:bg-[#A0452E] flex items-center gap-1.5"
              >

                <Trash2 className="w-3.5 h-3.5" />

                <span>
                  Yes, Delete Account
                </span>

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};