import { useEffect, useState } from "react";

import { CozyBadge } from "../../components/common/UIComponents";
import { apiService } from "../../services/apiService";

import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
} from "lucide-react";


export const AdminAiInsightsPage = () => {

  // =========================================================
  // STATE
  // =========================================================

  const [insights, setInsights] = useState(null);

  const [loading, setLoading] =
    useState(true);


  // =========================================================
  // NORMALIZE INSIGHTS RESPONSE
  // =========================================================

  const normalizeInsights = (response) => {

    if (!response) {
      return null;
    }

    /*
     * Supports both direct and wrapped backend responses.
     */

    if (
      response.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
    ) {
      return response.data;
    }

    return response;

  };


  // =========================================================
  // LOAD FEEDBACK INSIGHTS
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const loadAiInsights = async () => {
      try {
        setLoading(true);

        const result =
          await apiService.fetchBloomBotAdminInsightsBackend();

        if (!isMounted) {
          return;
        }

        setInsights(
          normalizeInsights(result)
        );
      } catch (error) {
        console.error(
          "BloomBot admin feedback insights fetch failed:",
          error
        );

        if (isMounted) {
          setInsights(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAiInsights();

    return () => {
      isMounted = false;
    };
  }, []);


  // =========================================================
  // COMPUTED FEEDBACK STATS
  // =========================================================

  const helpfulCount =
    Number(
      insights?.helpful_responses || 0
    );

  const notHelpfulCount =
    Number(
      insights?.not_helpful_responses || 0
    );

  const helpfulPct =
    insights?.helpful_percentage ??
    0;

  const recentFeedbacks =
    Array.isArray(
      insights?.recent_feedback
    )
      ? insights.recent_feedback
      : [];


  // =========================================================
  // HELPER FOR FEEDBACK REASONS
  // =========================================================

  const getReasonEntries = (value) => {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return [];
    }

    return Object.entries(value);
  };

  const helpfulReasons =
    getReasonEntries(
      insights?.most_selected_helpful_reasons
    );

  const negativeReasons =
    getReasonEntries(
      insights?.most_selected_negative_reasons
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="space-y-6 pb-12">


      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div>

        <h1 className="font-serif text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

          BloomBot Feedback & Insights

        </h1>


        <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] mt-1">

          User feedback, response ratings, and areas for
          improving BloomBot's responses.

        </p>

      </div>


      {/* ===================================================
          FEEDBACK KPI ROW
      =================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* HELPFUL */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#889868] bg-[#FFFBF7] dark:bg-[#251E19]">
          <div className="flex items-center justify-between text-xs text-[#8C7667]">
            <span>Helpful Responses</span>
            <ThumbsUp className="w-4 h-4 text-[#889868]" />
          </div>

          <div className="font-serif text-2xl font-bold text-[#2D5A27] dark:text-[#A4C497]">
            {loading ? "..." : helpfulCount}
          </div>

          <div className="text-[10px] text-[#889868] font-semibold">
            Positive ratings
          </div>
        </div>

        {/* NOT HELPFUL */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#E07A5F] bg-[#FFFBF7] dark:bg-[#251E19]">
          <div className="flex items-center justify-between text-xs text-[#8C7667]">
            <span>Not Helpful Responses</span>
            <ThumbsDown className="w-4 h-4 text-[#E07A5F]" />
          </div>

          <div className="font-serif text-2xl font-bold text-[#C46E52]">
            {loading ? "..." : notHelpfulCount}
          </div>

          <div className="text-[10px] text-[#E07A5F] font-semibold">
            Needs refinement
          </div>
        </div>

        {/* SATISFACTION */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#4F5D3D] bg-[#FFFBF7] dark:bg-[#251E19]">
          <div className="flex items-center justify-between text-xs text-[#8C7667]">
            <span>Response Satisfaction %</span>
            <Sparkles className="w-4 h-4 text-[#4F5D3D]" />
          </div>

          <div className="font-serif text-2xl font-bold text-[#2D5A27] dark:text-[#A4C497]">
            {loading ? "..." : `${helpfulPct}%`}
          </div>

          <div className="text-[10px] text-[#889868] font-semibold">
            Overall satisfaction
          </div>
        </div>

      </div>


      {/* ===================================================
          APPRECIATED QUALITIES + COMPLAINTS
      =================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {/* HELPFUL REASONS */}

        <div className="cozy-card p-5 space-y-3 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <h3 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">

            <ThumbsUp className="w-4 h-4 text-[#889868]" />

            <span>
              Most Appreciated Response Qualities
            </span>

          </h3>


          {helpfulReasons.length === 0 ? (

            <p className="text-xs text-[#8C7667] italic">

              No helpful quality tags submitted yet.

            </p>

          ) : (

            <div className="space-y-2">

              {helpfulReasons.map(
                ([reason, count]) => (

                  <div
                    key={reason}
                    className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128]"
                  >

                    <span className="font-medium text-[#3B281C] dark:text-[#FFFBF7]">

                      {reason}

                    </span>


                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0E6] text-[#2D5A27]">

                      {count} votes

                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* NEGATIVE REASONS */}

        <div className="cozy-card p-5 space-y-3 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <h3 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">

            <ThumbsDown className="w-4 h-4 text-[#E07A5F]" />

            <span>
              Most Common Complaints / Issues
            </span>

          </h3>


          {negativeReasons.length === 0 ? (

            <p className="text-xs text-[#8C7667] italic">

              No common complaint tags recorded.

            </p>

          ) : (

            <div className="space-y-2">

              {negativeReasons.map(
                ([reason, count]) => (

                  <div
                    key={reason}
                    className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128]"
                  >

                    <span className="font-medium text-[#3B281C] dark:text-[#FFFBF7]">

                      {reason}

                    </span>


                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF2F0] text-[#C46E52]">

                      {count} votes

                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>


      {/* ===================================================
          RECENT USER FEEDBACK
      =================================================== */}

      <div className="cozy-card p-6 space-y-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

        <h3 className="font-serif font-bold text-lg text-[#3B281C] dark:text-[#FFFBF7]">

          Recent User Feedback & Ratings

        </h3>


        {recentFeedbacks.length === 0 ? (

          <div className="py-8 text-center text-xs text-[#8C7667] italic bg-[#FAF6F0] dark:bg-[#2F2620] rounded-xl border border-[#E6DCCD] dark:border-[#3D3128]">

            No feedback recorded yet. Users can submit
            feedback directly in BloomBot chat.

          </div>

        ) : (

          <div className="space-y-3 text-xs">

            {recentFeedbacks.map(
              (fb, index) => {

                const feedbackType =
                  String(
                    fb?.feedback_type ||
                    ""
                  ).toLowerCase();


                const isHelpful =
                  feedbackType ===
                  "helpful";


                const selectedReasons =
                  Array.isArray(
                    fb?.selected_reasons
                  )
                    ? fb.selected_reasons
                    : [];


                return (

                  <div
                    key={
                      fb?.id ??
                      index
                    }
                    className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] space-y-2"
                  >


                    {/* USER + DATE */}

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <span className="font-bold text-[#3B281C] dark:text-[#FFFBF7]">

                          {fb?.user_email ||
                            "User"}

                        </span>


                        <span className="text-[10px] text-[#8C7667]">

                          {fb?.created_at
                            ? new Date(
                                fb.created_at
                              ).toLocaleString()
                            : "—"}

                        </span>

                      </div>


                      <CozyBadge
                        variant={
                          isHelpful
                            ? "sage"
                            : "terracotta"
                        }
                      >

                        {isHelpful
                          ? "👍 Helpful"
                          : "👎 Not Helpful"}

                      </CozyBadge>

                    </div>


                    {/* USER PROMPT */}

                    <div className="bg-[#FFFBF7] dark:bg-[#251E19] p-3 rounded-xl border border-[#E6DCCD] dark:border-[#3D3128] space-y-1">

                      <p className="text-[11px] font-semibold text-[#8C7667]">

                        User Prompt:

                      </p>


                      <p className="text-xs text-[#3B281C] dark:text-[#FFFBF7] italic">

                        "{fb?.user_prompt || "—"}"

                      </p>

                    </div>


                    {/* AI RESPONSE */}

                    <div className="bg-[#FFFBF7] dark:bg-[#251E19] p-3 rounded-xl border border-[#E6DCCD] dark:border-[#3D3128] space-y-1">

                      <p className="text-[11px] font-semibold text-[#8C7667]">

                        AI Response:

                      </p>


                      <p className="text-xs text-[#3B281C] dark:text-[#FFFBF7]">

                        "{fb?.ai_response || "—"}"

                      </p>

                    </div>


                    {/* REASONS */}

                    {selectedReasons.length > 0 && (

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">

                        <span className="text-[10px] font-semibold text-[#8C7667]">

                          Reasons:

                        </span>


                        {selectedReasons.map(
                          (reason, reasonIndex) => (

                            <span
                              key={
                                `${reason}-${reasonIndex}`
                              }
                              className="px-2 py-0.5 rounded-md text-[10px] bg-[#F5EFE6] dark:bg-[#3D3128] text-[#5D4037] dark:text-[#D4C3B3] border border-[#E6DCCD] dark:border-[#5C3D2E]"
                            >

                              {reason}

                            </span>

                          )
                        )}

                      </div>

                    )}


                    {/* OPTIONAL COMMENT */}

                    {fb?.optional_comment && (

                      <div className="text-[11px] text-[#5D4037] dark:text-[#D4C3B3] flex items-start gap-1 pt-1">

                        <MessageSquare className="w-3.5 h-3.5 text-[#E07A5F] shrink-0 mt-0.5" />


                        <span>

                          <strong>
                            User Comment:
                          </strong>{" "}

                          {fb.optional_comment}

                        </span>

                      </div>

                    )}

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>


      {/* ===================================================
          DEBUG-FRIENDLY EMPTY STATE
      =================================================== */}

      {!loading &&
        !insights && (

          <div className="cozy-card p-5 text-center">

            <p className="text-xs text-[#8C7667]">

              Feedback insight data is currently unavailable.
              The dashboard is still operational.

            </p>

          </div>

        )}

    </div>

  );

};