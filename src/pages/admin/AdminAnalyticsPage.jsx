import { useEffect, useState } from "react";

import {
  MoodTrendChart,
  WeeklyReflectionDonut,
} from "../../components/common/CozyCharts";

import { CozyBadge } from "../../components/common/UIComponents";

import { apiService } from "../../services/apiService";

import {
  TrendingUp,
  Users,
  BookOpen,
  Leaf,
  Smile,
  Activity,
} from "lucide-react";


export const AdminAnalyticsPage = () => {

  // =========================================================
  // STATE
  // =========================================================

  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);


  // =========================================================
  // SAFE ARRAY NORMALIZER
  // =========================================================

  const toArray = (response) => {

    if (Array.isArray(response)) {
      return response;
    }

    if (
      response &&
      Array.isArray(response.data)
    ) {
      return response.data;
    }

    return [];

  };


  // =========================================================
  // LOAD ANALYTICS DATA
  // =========================================================

  useEffect(() => {

    let isMounted = true;


    const loadAnalytics = async () => {

      try {

        setLoading(true);


        /*
         * Fetch everything independently.
         *
         * Promise.allSettled() means one failed endpoint
         * won't destroy the entire Analytics page.
         */

        const results =
          await Promise.allSettled([

            apiService.getMoods(),

            apiService.getJournals(),

            apiService.getReflections(),

            apiService.getAdminUsers(),

          ]);


        if (!isMounted) {
          return;
        }


        // =====================================================
        // MOODS
        // =====================================================

        if (
          results[0]?.status ===
          "fulfilled"
        ) {

          setMoods(
            toArray(
              results[0].value
            )
          );

        } else {

          console.error(
            "Analytics moods fetch failed:",
            results[0]?.reason
          );

          setMoods([]);

        }


        // =====================================================
        // JOURNALS
        // =====================================================

        if (
          results[1]?.status ===
          "fulfilled"
        ) {

          setJournals(
            toArray(
              results[1].value
            )
          );

        } else {

          console.error(
            "Analytics journals fetch failed:",
            results[1]?.reason
          );

          setJournals([]);

        }


        // =====================================================
        // REFLECTIONS
        // =====================================================

        if (
          results[2]?.status ===
          "fulfilled"
        ) {

          setReflections(
            toArray(
              results[2].value
            )
          );

        } else {

          console.error(
            "Analytics reflections fetch failed:",
            results[2]?.reason
          );

          setReflections([]);

        }


        // =====================================================
        // USERS
        // =====================================================

        if (
          results[3]?.status ===
          "fulfilled"
        ) {

          setUsers(
            toArray(
              results[3].value
            )
          );

        } else {

          console.error(
            "Analytics users fetch failed:",
            results[3]?.reason
          );

          setUsers([]);

        }

      } catch (error) {

        console.error(
          "Analytics loading error:",
          error
        );


        if (isMounted) {

          setMoods([]);
          setJournals([]);
          setReflections([]);
          setUsers([]);

        }

      } finally {

        if (isMounted) {
          setLoading(false);
        }

      }

    };


    loadAnalytics();


    return () => {
      isMounted = false;
    };

  }, []);


  // =========================================================
  // MOOD CALCULATIONS
  // =========================================================

  const hasMoods =
    moods.length > 0;


  const totalScore =
    moods.reduce(
      (accumulator, mood) => {

        const score =
          Number(
            mood?.score
          );


        return (
          accumulator +
          (
            Number.isFinite(score)
              ? score
              : 5
          )
        );

      },
      0
    );


  const avgScore =
    hasMoods
      ? (
          totalScore /
          moods.length
        ).toFixed(1)
      : "0.0";


  // =========================================================
  // DAILY ACTIVE USERS
  // =========================================================

  const activeCount =
    users.filter(
      (user) => {

        const status =
          String(
            user?.status ||
            ""
          ).toLowerCase();


        return (
          status === "active" ||
          user?.is_active === true
        );

      }
    ).length;


  /*
   * Preserve your existing behaviour:
   * show at least 1 when the platform has no active-user
   * data yet.
   */

  const dauCount =
    Math.max(
      1,
      activeCount
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="space-y-6 pb-12">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div>

        <h1 className="font-serif text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

          Platform Analytics & Health

        </h1>


        <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] mt-1">

          Community mood trends, journal and reflection
          engagement, user growth, and daily active user
          metrics.

        </p>

      </div>


      {/* ===================================================
          TOP STAT ROW
      =================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


        {/* AVERAGE MOOD */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#889868] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Average Mood Index
            </span>

            <Smile className="w-4 h-4 text-[#889868]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : hasMoods
                ? `${avgScore} / 10`
                : "0.0 / 10"}

          </div>


          <div className="text-[10px] text-[#889868] font-semibold">

            Community average

          </div>

        </div>


        {/* JOURNAL ACTIVITY */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#D4A373] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Journal Activity
            </span>

            <BookOpen className="w-4 h-4 text-[#D4A373]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : journals.length}

          </div>


          <div className="text-[10px] text-[#8C7667]">

            Total entries written

          </div>

        </div>


        {/* REFLECTION ACTIVITY */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#E07A5F] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Reflection Activity
            </span>

            <Leaf className="w-4 h-4 text-[#E07A5F]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : reflections.length}

          </div>


          <div className="text-[10px] text-[#8C7667]">

            Gratitude & Self-Talk logs

          </div>

        </div>


        {/* DAU */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#5C3D2E] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Daily Active Users (DAU)
            </span>

            <Activity className="w-4 h-4 text-[#5C3D2E]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : dauCount}

          </div>


          <div className="text-[10px] text-[#889868] font-semibold">

            100% active rate

          </div>

        </div>

      </div>


      {/* ===================================================
          MOOD TRENDS
      =================================================== */}

      <div className="cozy-card p-6 space-y-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

        <div className="flex items-center justify-between">

          <div className="space-y-0.5">

            <h3 className="font-serif font-bold text-lg text-[#3B281C] dark:text-[#FFFBF7]">

              Community Mood Trends

            </h3>


            <p className="text-xs text-[#705D52] dark:text-[#D4C3B3]">

              Macro emotional health indices tracked over
              daily check-ins.

            </p>

          </div>


          <CozyBadge variant="autumn">

            Global Trajectory

          </CozyBadge>

        </div>


        <MoodTrendChart
          moods={moods}
        />

      </div>


      {/* ===================================================
          ACTIVITY + USER GROWTH
      =================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {/* =================================================
            WEEKLY ENGAGEMENT
        ================================================= */}

        <div className="cozy-card p-6 space-y-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <div className="flex items-center justify-between">

            <h3 className="font-serif font-bold text-base text-[#3B281C] dark:text-[#FFFBF7]">

              Weekly Engagement Breakdown

            </h3>


            <CozyBadge variant="sage">

              Habit Completion

            </CozyBadge>

          </div>


          <WeeklyReflectionDonut
            journals={journals}
            moods={moods}
            reflections={reflections}
          />

        </div>


        {/* =================================================
            USER GROWTH
        ================================================= */}

        <div className="cozy-card p-6 space-y-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <div className="flex items-center justify-between">

            <h3 className="font-serif font-bold text-base text-[#3B281C] dark:text-[#FFFBF7]">

              User Growth & Retention

            </h3>


            <CozyBadge variant="autumn">

              Active Community

            </CozyBadge>

          </div>


          <div className="space-y-3 text-xs">


            {/* TOTAL USERS */}

            <div className="p-3.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] flex items-center justify-between">

              <div>

                <span className="font-semibold text-[#3B281C] dark:text-[#FFFBF7] block">

                  Total Registered Accounts

                </span>


                <span className="text-[10px] text-[#8C7667]">

                  Verified MindBloom users

                </span>

              </div>


              <span className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">

                {loading
                  ? "..."
                  : users.length}

              </span>

            </div>


            {/* DAU */}

            <div className="p-3.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] flex items-center justify-between">

              <div>

                <span className="font-semibold text-[#3B281C] dark:text-[#FFFBF7] block">

                  Daily Active Users (DAU)

                </span>


                <span className="text-[10px] text-[#8C7667]">

                  Users active in past 24h

                </span>

              </div>


              <span className="font-serif text-lg font-bold text-[#889868]">

                {loading
                  ? "..."
                  : dauCount}

              </span>

            </div>


            {/* RETENTION */}

            <div className="p-3.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] flex items-center justify-between">

              <div>

                <span className="font-semibold text-[#3B281C] dark:text-[#FFFBF7] block">

                  Retention Rate

                </span>


                <span className="text-[10px] text-[#8C7667]">

                  30-day active retention

                </span>

              </div>


              <span className="font-serif text-lg font-bold text-[#E07A5F]">

                94.2%

              </span>

            </div>


          </div>

        </div>

      </div>


      {/* ===================================================
          DATA AVAILABILITY NOTE
      =================================================== */}

      {!loading &&
        moods.length === 0 &&
        journals.length === 0 &&
        reflections.length === 0 &&
        users.length === 0 && (

          <div className="cozy-card p-4 text-center">

            <p className="text-xs text-[#8C7667] dark:text-[#A8988B] italic">

              No analytics activity has been recorded yet.

            </p>

          </div>

        )}

    </div>

  );

};