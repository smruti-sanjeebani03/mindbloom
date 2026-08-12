import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Smile,
  BookOpen,
  Flame,
  Bot,
  Heart,
  PenTool,
  Clock,
  Award,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/apiService";
import {
  CozyCatLogo,
  AutumnLeafIllustration,
  MapleLeafIcon,
  MapleLeafCluster,
  MapleLeafDivider,
} from "../../components/illustrations/CozyIllustrations";
import {
  MoodTrendChart,
  WeeklyReflectionDonut,
} from "../../components/common/CozyCharts";
import { CozyBadge } from "../../components/common/UIComponents";
import { extractFirstName } from "../../utils/nameUtils";

const fallingLeaves = [
  {
    id: 1,
    left: "12%",
    size: "w-6 h-6",
    color: "text-[#E07A5F]",
    duration: 2.8,
    delay: 0.1,
    xOffset: 20,
  },
  {
    id: 2,
    left: "32%",
    size: "w-8 h-8",
    color: "text-[#D88A5C]",
    duration: 3.4,
    delay: 0.2,
    xOffset: -25,
  },
  {
    id: 3,
    left: "55%",
    size: "w-5 h-5",
    color: "text-[#E8A598]",
    duration: 2.6,
    delay: 0.05,
    xOffset: 15,
  },
  {
    id: 4,
    left: "75%",
    size: "w-7 h-7",
    color: "text-[#D4A373]",
    duration: 3.1,
    delay: 0.3,
    xOffset: -20,
  },
  {
    id: 5,
    left: "90%",
    size: "w-6 h-6",
    color: "text-[#E07A5F]",
    duration: 2.9,
    delay: 0.15,
    xOffset: 25,
  },
];

const getGreetingByTime = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 16) {
    return "Good Afternoon";
  }

  if (hour >= 16 && hour < 24) {
    return "Good Evening";
  }

  return "Good Night";
};

/*
 * Converts a reflection entry into a reliable YYYY-MM-DD date.
 *
 * Priority:
 * 1. reflection_date
 * 2. date
 * 3. created_at
 */
const getReflectionDate = (entry) => {
  if (!entry) {
    return null;
  }

  if (entry.reflection_date) {
    return String(entry.reflection_date).slice(0, 10);
  }

  if (entry.date) {
    return String(entry.date).slice(0, 10);
  }

  if (entry.created_at) {
    return String(entry.created_at).slice(0, 10);
  }

  return null;
};

/*
 * Calculates the CURRENT reflection streak.
 *
 * Important:
 * - Multiple reflections on the same day count as ONE day.
 * - Gratitude + self-talk on the same day count as ONE day.
 * - The current streak must include today.
 * - A missing day breaks the streak.
 */
const getActivityDate = (entry, type = "") => {
  if (!entry) {
    return null;
  }

  // --------------------------------------------------
  // Reflection entries
  // reflection_date is already YYYY-MM-DD
  // --------------------------------------------------
  if (entry.reflection_date) {
    return String(entry.reflection_date).slice(0, 10);
  }

  // --------------------------------------------------
  // Journal / other entries
  // created_at is usually an ISO UTC timestamp.
  // Convert it to the user's LOCAL date.
  // --------------------------------------------------
  if (entry.created_at) {
    const date = new Date(entry.created_at);

    if (!Number.isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }
  }

  // Fallback
  if (entry.date) {
    const value = String(entry.date);

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
  }

  return null;
};


const calculateReflectionStreak = (
  journals = [],
  reflections = []
) => {
  const activityDates = new Set();

  // Journals
  if (Array.isArray(journals)) {
    journals.forEach((journal) => {
      const date = getActivityDate(journal, "journal");

      if (date) {
        activityDates.add(date);
      }
    });
  }

  // Gratitude + Self-talk
  if (Array.isArray(reflections)) {
    reflections.forEach((reflection) => {
      const date = getActivityDate(
        reflection,
        "reflection"
      );

      if (date) {
        activityDates.add(date);
      }
    });
  }

  if (activityDates.size === 0) {
    return 0;
  }

  // Sort newest → oldest
  const sortedDates = [...activityDates].sort(
    (a, b) =>
      new Date(`${b}T00:00:00`) -
      new Date(`${a}T00:00:00`)
  );

  // Today's local date
  const today = new Date();

  const todayString =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  // Yesterday's local date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayString =
    `${yesterday.getFullYear()}-` +
    `${String(yesterday.getMonth() + 1).padStart(2, "0")}-` +
    `${String(yesterday.getDate()).padStart(2, "0")}`;

  const latestDate = sortedDates[0];

  // If the latest activity is older than yesterday,
  // the streak has genuinely ended.
  if (
    latestDate !== todayString &&
    latestDate !== yesterdayString
  ) {
    return 0;
  }

  // Count consecutive active days
  let streak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const previousDate = new Date(
      `${sortedDates[i - 1]}T00:00:00`
    );

    const currentDate = new Date(
      `${sortedDates[i]}T00:00:00`
    );

    const difference = Math.round(
      (previousDate - currentDate) /
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

export const DashboardPage = () => {
  const { user } = useAuth();

  const [journals, setJournals] = useState([]);
  const [moods, setMoods] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [todayQuote, setTodayQuote] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        /*
         * We intentionally fetch gratitude and self-talk separately.
         * Both are reflection activities.
         */
        const [
          journalsData,
          moodsData,
          gratitudeData,
          selfTalkData,
          conversationsData,
        ] = await Promise.all([
          apiService.getJournals(),
          apiService.getMoods(),
          apiService.fetchGratitudeBackend(),
          apiService.fetchSelfTalkBackend(),
          apiService.getConversations(),
        ]);

        const gratitudeEntries = Array.isArray(gratitudeData)
          ? gratitudeData
          : [];

        const selfTalkEntries = Array.isArray(selfTalkData)
          ? selfTalkData
          : [];

        const reflectionEntries = [
          ...gratitudeEntries,
          ...selfTalkEntries,
        ];

        setJournals(
          Array.isArray(journalsData)
            ? journalsData
            : []
        );

        setMoods(
          Array.isArray(moodsData)
            ? moodsData
            : []
        );

        setReflections(reflectionEntries);

        setConversations(
          Array.isArray(conversationsData)
            ? conversationsData
            : []
        );
      } catch (error) {
        console.error(
          "Error loading dashboard data:",
          error
        );
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    const loadTodayQuote = async () => {
      try {
        const response = await fetch(
          "/api/inspire/today/"
        );

        const data = await response.json();

        if (
          response.ok &&
          data.success &&
          data.data &&
          data.data.quote
        ) {
          setTodayQuote({
            quote:
              data.data.quote.content ||
              data.data.quote.text,
            author:
              data.data.quote.author ||
              "MindBloom",
          });
        }
      } catch (error) {
        console.error(
          "Error fetching today's quote:",
          error
        );
      }
    };

    loadTodayQuote();
  }, []);

  const firstName = extractFirstName(
    user?.name ||
      user?.full_name ||
      user?.email ||
      "",
    user?.email || ""
  );

  const greetingText = getGreetingByTime();

 const getLocalDateString = (value) => {
  if (!value) {
    return null;
  }

  const valueString = String(value);

  // Date-only value: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(valueString)) {
    return valueString;
  }

  // Backend timestamp:
  // Example: 2026-08-10T15:38:57.876257Z
  const parsedDate = new Date(valueString);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const year = parsedDate.getFullYear();

  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    parsedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// Get TODAY according to the user's local timezone
const today = new Date();

const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");


// Only moods logged TODAY are considered
const todaysMoods = moods.filter((mood) => {
  const moodDate = getLocalDateString(
    mood.date ||
      mood.created_at ||
      mood.createdAt
  );

  return moodDate === todayString;
});


// Get the latest mood from TODAY only
const latestMood =
  todaysMoods.length > 0
    ? [...todaysMoods].sort(
        (a, b) =>
          new Date(
            b.created_at ||
              b.createdAt ||
              b.date ||
              0
          ) -
          new Date(
            a.created_at ||
              a.createdAt ||
              a.date ||
              0
          )
      )[0]
    : null;

  const totalJournals = journals.length;

  const totalConversations =
    conversations.length;

  const recentJournal =
    journals.length > 0
      ? [...journals].sort(
          (a, b) =>
            new Date(
              b.created_at ||
                b.date ||
                0
            ) -
            new Date(
              a.created_at ||
                a.date ||
                0
            )
        )[0]
      : null;

  /*
   * THIS is the only streak declaration.
   * No duplicate calculateReflectionStreak
   * and no hard-coded 0.
   */
 const streakDays =
  calculateReflectionStreak(
    journals,
    reflections
  );

  const wellnessScore = Math.min(
    100,
    Math.round(
      ((
        Math.min(
          journals.length,
          7
        ) +
        Math.min(
          moods.length,
          7
        ) +
        Math.min(
          reflections.length,
          7
        )
      ) /
        21) *
        100
    )
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        ease: [
          0.16,
          1,
          0.3,
          1,
        ],
      }}
      className="space-y-6 pb-12 relative overflow-hidden"
    >
      {/* Floating Welcome Maple Leaves Animation */}
      <div className="absolute inset-x-0 top-0 h-48 pointer-events-none z-20 overflow-hidden">
        {fallingLeaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{
              y: -25,
              opacity: 0,
              rotate: -20,
            }}
            animate={{
              y: [-20, 110],
              x: [
                0,
                leaf.xOffset,
                0,
              ],
              opacity: [
                0,
                0.85,
                0.85,
                0,
              ],
              rotate: [
                -20,
                25,
                65,
              ],
            }}
            transition={{
              duration:
                leaf.duration,
              delay: leaf.delay,
              ease: "easeInOut",
            }}
            style={{
              left: leaf.left,
            }}
            className="absolute"
          >
            <MapleLeafIcon
              className={`${leaf.size} ${leaf.color} filter drop-shadow-xs`}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating Background Maple Leaves */}
      <div className="absolute top-2 right-4 opacity-85 dark:opacity-95 pointer-events-none z-0 filter drop-shadow-xs">
        <MapleLeafIcon className="w-12 h-12 text-[#E07A5F] rotate-12" />
      </div>

      <div className="absolute top-[520px] left-1 opacity-80 dark:opacity-90 pointer-events-none z-0 filter drop-shadow-xs">
        <MapleLeafIcon className="w-10 h-10 text-[#D88A5C] -rotate-12" />
      </div>

      {/* Top Welcome Banner */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          delay: 0.1,
        }}
        className="cozy-card-warm p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#E6DCCD]"
      >
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">
              <span>
                {greetingText},{" "}
                {firstName} 👋
              </span>

              <motion.div
                initial={{
                  rotate: -35,
                  scale: 0,
                }}
                animate={{
                  rotate: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 180,
                }}
              >
                <MapleLeafIcon className="w-7 h-7 text-[#E07A5F] shrink-0" />
              </motion.div>
            </h1>
          </div>

          <p className="font-serif text-sm text-[#705D52] italic flex items-center gap-1.5">
            <span>
              “Every small step matters.”
            </span>
            <MapleLeafIcon className="w-4 h-4 text-[#D4A373]" />
          </p>
        </div>

        {/* Action Button */}
        <Link
          to="/app/journal"
          className="cozy-btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shrink-0 z-10"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>
            Write in Journal
          </span>
        </Link>

        {/* Ambient Maple Cluster */}
        <div className="absolute right-4 -bottom-4 opacity-85 dark:opacity-95 pointer-events-none filter drop-shadow-sm">
          <MapleLeafCluster className="w-40 h-40" />
        </div>
      </motion.div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

        {/* Mood Today */}
        <Link
          to="/app/mood"
          className="cozy-card p-4 space-y-2 relative overflow-hidden block hover:border-[#D4A373] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C7667]">
              Mood Today
            </span>

            <div className="w-7 h-7 rounded-lg bg-[#FAF2E6] text-[#D4A373] flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
          </div>

          <div className="text-base sm:text-lg font-serif font-bold text-[#3B281C] capitalize">
            {latestMood
              ? latestMood.mood
              : "Not Logged"}
          </div>

          <div className="text-[10px] text-[#889868] flex items-center gap-1 font-medium">
            <span>
              {latestMood
                ? `😊 Logged ${
                    latestMood.date ||
                    latestMood.created_at ||
                    ""
                  }`
                : "Tap to record mood"}
            </span>
          </div>
        </Link>

        {/* Journal Entries */}
        <Link
          to="/app/journal"
          className="cozy-card p-4 space-y-2 block hover:border-[#8B5E3C] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C7667]">
              Journal Entries
            </span>

            <div className="w-7 h-7 rounded-lg bg-[#F5EFE6] text-[#8B5E3C] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl font-serif font-bold text-[#3B281C]">
            {totalJournals}
          </div>

          <div className="text-[10px] text-[#8C7667]">
            Total Entries
          </div>
        </Link>

        {/* Reflection Streak */}
        <Link
          to="/app/reflect"
          className="cozy-card p-4 space-y-2 block hover:border-[#E07A5F] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C7667]">
              Reflection Streak
            </span>

            <div className="w-7 h-7 rounded-lg bg-[#FBEBE6] text-[#E07A5F] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl font-serif font-bold text-[#3B281C]">
            {streakDays}
          </div>

          <div className="text-[10px] text-[#E07A5F] font-semibold">
            {streakDays > 0
              ? "Days Active 🔥"
              : "Start Streak Today"}
          </div>
        </Link>

        {/* AI Conversations */}
        <Link
          to="/app/bloombot"
          className="cozy-card p-4 space-y-2 block hover:border-[#D4A373] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C7667]">
              AI Conversations
            </span>

            <div className="w-7 h-7 rounded-lg bg-[#FAF2E6] text-[#D4A373] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl font-serif font-bold text-[#3B281C]">
            {totalConversations}
          </div>

          <div className="text-[10px] text-[#8C7667]">
            Active Chats
          </div>
        </Link>

        {/* Wellness Score */}
        <div className="cozy-card p-4 space-y-2 col-span-2 sm:col-span-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#705D52] dark:text-[#EAD6C5]">
              Wellness Score
            </span>

            <div className="w-7 h-7 rounded-lg bg-[#EAEFE6] dark:bg-[#23351F] text-[#3D522B] dark:text-[#C5E1B4] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-serif font-bold text-[#3B281C] dark:text-[#FFFBF7]">
              {wellnessScore}%
            </span>
          </div>

          <div className="text-[10px] text-[#3D522B] dark:text-[#C5E1B4] font-semibold">
            {wellnessScore > 0
              ? "Keep Growing!"
              : "Ready to start"}
          </div>

          <div className="absolute -right-2 -bottom-2 w-12 h-12 opacity-80 pointer-events-none">
            <CozyCatLogo className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Mood Trend */}
        <div className="lg:col-span-5 cozy-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#3B281C] flex items-center gap-1.5">
              <MapleLeafIcon className="w-4 h-4 text-[#E07A5F]" />
              <span>
                Mood Trend
              </span>
            </h3>

            <span className="text-[10px] text-[#8C7667] bg-[#F5EFE6] px-2 py-0.5 rounded-full font-medium">
              This Week
            </span>
          </div>

          <MoodTrendChart
            moods={moods}
          />
        </div>

        {/* Weekly Reflection Donut */}
        <div className="lg:col-span-4 cozy-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#3B281C] flex items-center gap-1.5">
              <MapleLeafIcon className="w-4 h-4 text-[#E29578]" />
              <span>
                Weekly Reflection
              </span>
            </h3>

            <span className="text-[10px] text-[#8C7667] bg-[#F5EFE6] px-2 py-0.5 rounded-full font-medium">
              Progress
            </span>
          </div>

          <WeeklyReflectionDonut
            journals={journals}
            moods={moods}
            reflections={reflections}
          />
        </div>

        {/* Daily Challenge */}
        <div className="lg:col-span-3 cozy-card-warm p-5 space-y-3 flex flex-col justify-between relative overflow-hidden border border-[#E6DCCD]">
          <div className="space-y-2">
            <span className="text-xs font-serif font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1">
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>
                Daily Challenge
              </span>
            </span>

            <p className="text-xs text-[#3B281C] font-semibold leading-relaxed">
              Write down 3 things that made you smile today.
            </p>
          </div>

          <Link
            to="/app/reflect"
            className="cozy-btn-primary text-xs py-2 px-3 text-center block rounded-xl mt-3"
          >
            Start Challenge
          </Link>

          <div className="absolute right-2 bottom-1 opacity-85 dark:opacity-95 pointer-events-none filter drop-shadow-xs">
            <AutumnLeafIllustration className="w-16 h-16" />
          </div>
        </div>
      </div>

      <MapleLeafDivider className="my-2" />

      {/* THIRD ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Recent Journal */}
        <div className="cozy-card p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif font-bold text-[#8B5E3C] flex items-center gap-1.5">
                <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>
                  Recent Journal
                </span>
              </span>

              {recentJournal && (
                <span className="text-[10px] text-[#8C7667] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {recentJournal.time ||
                    recentJournal.date ||
                    ""}
                </span>
              )}
            </div>

            {recentJournal ? (
              <p className="text-xs text-[#4A3B32] italic leading-relaxed line-clamp-3">
                "{recentJournal.content}"
              </p>
            ) : (
              <p className="text-xs text-[#8C7667] italic leading-relaxed py-2">
                No journal entries yet. Start writing your daily reflections!
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#EFE6DC]">
            {recentJournal ? (
              <CozyBadge variant="sage">
                {recentJournal.emotionTag ||
                  "Thoughtful"}
              </CozyBadge>
            ) : (
              <span className="text-[11px] text-[#A08A7C] italic">
                Fresh Start
              </span>
            )}

            <Link
              to="/app/journal"
              className="text-xs font-bold text-[#5C3D2E] hover:underline flex items-center gap-1"
            >
              <span>
                {recentJournal
                  ? "View Journal"
                  : "Write Journal"}
              </span>
              →
            </Link>
          </div>
        </div>

        {/* Quote of the Day */}
        <div className="cozy-card p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif font-bold text-[#8B5E3C] dark:text-[#F5C799] flex items-center gap-1.5">
                <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>
                  Quote of the Day
                </span>
              </span>

              <Heart className="w-4 h-4 text-[#E07A5F] fill-current" />
            </div>

            <p className="font-serif text-sm text-[#3B281C] dark:text-[#F7EBE1] italic leading-relaxed">
              "
              {todayQuote?.quote ||
                "Peace comes from within. Do not seek it without."}
              "
            </p>

            <p className="text-[11px] text-[#705D52] dark:text-[#D8C4B2] text-right mt-1 font-medium">
              —{" "}
              {todayQuote?.author ||
                "MindBloom"}
            </p>
          </div>

          <Link
            to="/app/inspire"
            className="text-xs font-bold text-[#5C3D2E] dark:text-[#FF9E79] hover:underline flex items-center gap-1 pt-2 border-t border-[#EFE6DC] dark:border-[#382D25]"
          >
            <span>
              More Inspiration
            </span>
            →
          </Link>
        </div>

        {/* Reflection Prompt */}
        <div className="cozy-card p-5 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-serif font-bold text-[#E07A5F] flex items-center gap-1.5 mb-1">
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>
                Reflection Prompt
              </span>
            </span>

            <p className="text-xs text-[#3B281C] font-medium mt-2 leading-relaxed">
              What is one thing that made you proud of yourself this week?
            </p>
          </div>

          <Link
            to="/app/reflect"
            className="cozy-btn-secondary text-xs py-2 px-3 text-center block rounded-xl"
          >
            Write Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};