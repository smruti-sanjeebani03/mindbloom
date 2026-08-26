import { useState, useEffect } from "react";

import {
  Users,
  BookOpen,
  Smile,
  Leaf,
  Quote,
  Sparkles,
  FileText,
  Mail,
} from "lucide-react";

import { CozyBadge } from "../../components/common/UIComponents";
import { apiService } from "../../services/apiService";


export const AdminDashboardPage = () => {

  // =========================================================
  // ADMIN DATA
  // =========================================================

  const [users, setUsers] = useState([]);
  const [journals, setJournals] = useState([]);
  const [moods, setMoods] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [articles, setArticles] = useState([]);

  const [affirmationsCount, setAffirmationsCount] =
    useState(8);

  const [newslettersCount, setNewslettersCount] =
    useState(2);

  const [isLoading, setIsLoading] =
    useState(true);


  // =========================================================
  // SAFE ARRAY HELPER
  // =========================================================

  /*
   * Backend responses can sometimes be:
   *
   * []
   *
   * or:
   *
   * {
   *   success: true,
   *   data: []
   * }
   *
   * This helper makes sure the UI always receives
   * an array.
   */

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
  // LOAD ADMIN DASHBOARD DATA
  // =========================================================

  useEffect(() => {

    let isMounted = true;


    const loadAdminData = async () => {

      try {

        setIsLoading(true);


        /*
         * Fetch all dashboard resources.
         *
         * Promise.allSettled() is deliberately used instead
         * of Promise.all().
         *
         * If one endpoint fails, the entire Admin Dashboard
         * should NOT become blank.
         */

        const results =
          await Promise.allSettled([

            apiService.getAdminUsers(),

            apiService.getJournals(),


            apiService.getMoods(),

            apiService.getReflections(),

            apiService.getQuotes(),

            apiService.getArticles(),

          ]);


        if (!isMounted) {
          return;
        }


        // -----------------------------------------------------
        // Users
        // -----------------------------------------------------

        if (
          results[0]?.status === "fulfilled"
        ) {

          setUsers(
            toArray(
              results[0].value
            )
          );

        } else {

          console.error(
            "Admin users fetch failed:",
            results[0]?.reason
          );

          setUsers([]);

        }


        // -----------------------------------------------------
        // Journals
        // -----------------------------------------------------

        if (
          results[1]?.status === "fulfilled"
        ) {

          setJournals(
            toArray(
              results[1].value
            )
          );

        } else {

          console.error(
            "Admin journals fetch failed:",
            results[1]?.reason
          );

          setJournals([]);

        }



        // -----------------------------------------------------
        // Moods
        // -----------------------------------------------------

        if (
          results[2]?.status === "fulfilled"
        ) {

          setMoods(
            toArray(
              results[2].value
            )
          );

        } else {

          console.error(
            "Admin moods fetch failed:",
            results[2]?.reason
          );

          setMoods([]);

        }


        // -----------------------------------------------------
        // Reflections
        // -----------------------------------------------------

        if (
          results[3]?.status === "fulfilled"
        ) {

          setReflections(
            toArray(
              results[3].value
            )
          );

        } else {

          console.error(
            "Admin reflections fetch failed:",
            results[3]?.reason
          );

          setReflections([]);

        }


        // -----------------------------------------------------
        // Quotes
        // -----------------------------------------------------

        if (
          results[4]?.status === "fulfilled"
        ) {

          setQuotes(
            toArray(
              results[4].value
            )
          );

        } else {

          console.error(
            "Admin quotes fetch failed:",
            results[4]?.reason
          );

          setQuotes([]);

        }


        // -----------------------------------------------------
        // Articles
        // -----------------------------------------------------

        if (
          results[5]?.status === "fulfilled"
        ) {

          setArticles(
            toArray(
              results[5].value
            )
          );

        } else {

          console.error(
            "Admin articles fetch failed:",
            results[5]?.reason
          );

          setArticles([]);

        }


        // =====================================================
        // AFFIRMATIONS
        // =====================================================

        try {

          const response =
            await fetch(
              "/api/inspire/affirmations/"
            );

          const data =
            await response.json();


          if (
            data?.success &&
            Array.isArray(data.data)
          ) {

            setAffirmationsCount(
              data.data.length
            );

          }

        } catch (error) {

          console.warn(
            "Affirmations count unavailable:",
            error
          );

        }


        // =====================================================
        // NEWSLETTERS
        // =====================================================

        try {

          const response =
            await fetch(
              "/api/inspire/newsletters/"
            );

          const data =
            await response.json();


          if (
            data?.success &&
            Array.isArray(data.data)
          ) {

            setNewslettersCount(
              data.data.length
            );

          }

        } catch (error) {

          console.warn(
            "Newsletters count unavailable:",
            error
          );

        }

      } catch (error) {

        console.error(
          "Admin dashboard loading error:",
          error
        );

      } finally {

        if (isMounted) {
          setIsLoading(false);
        }

      }

    };


    loadAdminData();


    return () => {
      isMounted = false;
    };

  }, []);


  // =========================================================
  // FORMAT USER DATE
  // =========================================================

  const formatDate = (value) => {

    if (!value) {
      return "—";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =========================================================
  // NORMALIZE ADMIN USER
  // =========================================================

  const getUserName = (user) => {

    return (
      user?.name ||
      user?.full_name ||
      user?.fullName ||
      user?.username ||
      "MindBloom User"
    );

  };


  const getUserEmail = (user) => {

    return (
      user?.email ||
      user?.user_email ||
      "—"
    );

  };


  const getUserJoinedDate = (user) => {

    return formatDate(
      user?.joinedDate ||
      user?.date_joined ||
      user?.created_at ||
      user?.createdAt
    );

  };


  const getUserStatus = (user) => {

    if (
      user?.status
    ) {
      return user.status;
    }


    if (
      user?.is_active === true
    ) {
      return "active";
    }


    if (
      user?.is_active === false
    ) {
      return "inactive";
    }


    return "active";

  };


  const getUserLastActive = (user) => {

    return formatDate(
      user?.lastActive ||
      user?.last_active ||
      user?.updated_at ||
      user?.updatedAt
    );

  };


  // =========================================================
  // DASHBOARD METRICS
  // =========================================================

  const metricCards = [

    {
      title: "Total Users",

      value: isLoading
        ? "..."
        : users.length,

      subtitle:
        users.length > 0
          ? "Active registered accounts"
          : "Platform initialized",

      icon: Users,

      border:
        "border-l-[#5C3D2E]",
    },


    {
      title:
        "Total Journal Entries",

      value: isLoading
        ? "..."
        : journals.length,

      subtitle:
        "Encrypted private records",

      icon: BookOpen,

      border:
        "border-l-[#D4A373]",
    },


    {
      title:
        "Total Mood Entries",

      value: isLoading
        ? "..."
        : moods.length,

      subtitle:
        "Logged emotional check-ins",

      icon: Smile,

      border:
        "border-l-[#889868]",
    },


    {
      title:
        "Total Reflection Entries",

      value: isLoading
        ? "..."
        : reflections.length,

      subtitle:
        "Gratitude & Self-Talk logs",

      icon: Leaf,

      border:
        "border-l-[#A89868]",
    },


    {
      title:
        "Total Quotes",

      value: isLoading
        ? "..."
        : quotes.length,

      subtitle:
        "Inspirational quote items",

      icon: Quote,

      border:
        "border-l-[#B8543B]",
    },


    {
      title:
        "Total Affirmations",

      value: isLoading
        ? "..."
        : affirmationsCount,

      subtitle:
        "Gentle daily prompts",

      icon: Sparkles,

      border:
        "border-l-[#D88A5C]",
    },


    {
      title:
        "Total Articles",

      value: isLoading
        ? "..."
        : articles.length,

      subtitle:
        "Wellness guides & reads",

      icon: FileText,

      border:
        "border-l-[#4F5D3D]",
    },


    {
      title:
        "Total Newsletters",

      value: isLoading
        ? "..."
        : newslettersCount,

      subtitle:
        "Published Bloom Letters",

      icon: Mail,

      border:
        "border-l-[#705D52]",
    },

  ];


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="space-y-6 pb-12">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="space-y-1">

        <h1 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

          Admin System Overview

        </h1>


        <p className="text-xs text-[#8C7667] dark:text-[#A8988B]">

          Real-time system health, user analytics, and platform content statistics.

        </p>

      </div>


      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {metricCards.map(
          (card, index) => {

            const IconComponent =
              card.icon;


            return (

              <div
                key={index}
                className={`
                  cozy-card
                  p-5
                  space-y-2
                  border-l-4
                  ${card.border}
                  bg-[#FFFBF7]
                  dark:bg-[#251E19]
                  border-[#E6DCCD]
                  dark:border-[#3D3128]
                `}
              >

                <div className="flex items-center justify-between text-xs text-[#8C7667] dark:text-[#A8988B]">

                  <span className="font-medium">

                    {card.title}

                  </span>


                  <IconComponent
                    className="w-4 h-4 text-[#5C3D2E] dark:text-[#D87D56]"
                  />

                </div>


                <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

                  {card.value}

                </div>


                <div className="text-[10px] text-[#889868] dark:text-[#B8C99A] font-semibold">

                  {card.subtitle}

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* ===================================================
          RECENT ACTIVE USERS
      =================================================== */}

      <div className="cozy-card p-6 space-y-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

        <div className="flex items-center justify-between">

          <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            Recent Active Users

          </h3>


          <CozyBadge variant="autumn">

            Live Feed

          </CozyBadge>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse text-xs">

            <thead>

              <tr className="border-b border-[#EFE6DC] dark:border-[#3D3128] text-[#8C7667] dark:text-[#A8988B] font-semibold">

                <th className="py-2.5 px-3">

                  User Name

                </th>


                <th className="py-2.5 px-3">

                  Email

                </th>


                <th className="py-2.5 px-3">

                  Joined Date

                </th>


                <th className="py-2.5 px-3">

                  Status

                </th>


                <th className="py-2.5 px-3">

                  Last Active

                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-[#EFE6DC] dark:divide-[#3D3128]">

              {users.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-[#8C7667] dark:text-[#A8988B] italic"
                  >

                    {isLoading
                      ? "Loading registered users..."
                      : "No registered user activity recorded yet."
                    }

                  </td>

                </tr>

              ) : (

                users.map(
                  (u, index) => (

                    <tr
                      key={
                        u?.id ??
                        u?.user_id ??
                        index
                      }
                      className="hover:bg-[#FAF6F0] dark:hover:bg-[#2F2620] transition"
                    >

                      <td className="py-3 px-3 font-semibold text-[#3B281C] dark:text-[#FFFBF7]">

                        {getUserName(u)}

                      </td>


                      <td className="py-3 px-3 text-[#705D52] dark:text-[#D4C3B3]">

                        {getUserEmail(u)}

                      </td>


                      <td className="py-3 px-3 text-[#8C7667] dark:text-[#A8988B]">

                        {getUserJoinedDate(u)}

                      </td>


                      <td className="py-3 px-3">

                        <CozyBadge
                          variant={
                            getUserStatus(u) ===
                            "active"
                              ? "sage"
                              : "autumn"
                          }
                        >

                          {getUserStatus(u)}

                        </CozyBadge>

                      </td>


                      <td className="py-3 px-3 text-[#8C7667] dark:text-[#A8988B]">

                        {getUserLastActive(u)}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
};