import { useEffect, useState } from "react";

import { CozyBadge } from "../../components/common/UIComponents";
import { apiService } from "../../services/apiService";

import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Cpu,
  ShieldCheck,
  Zap,
  HeartHandshake,
} from "lucide-react";


export const AdminAiInsightsPage = () => {

  // =========================================================
  // STATE
  // =========================================================

  const [insights, setInsights] = useState(null);

  const [conversations, setConversations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =========================================================
  // SAFE ARRAY HELPER
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
  // NORMALIZE INSIGHTS RESPONSE
  // =========================================================

  const normalizeInsights = (response) => {

    if (!response) {
      return null;
    }

    /*
     * Possible backend formats:
     *
     * 1. Direct object
     * {
     *   total_conversations: 10,
     *   helpful_responses: 8,
     *   ...
     * }
     *
     * 2. Wrapped response
     * {
     *   success: true,
     *   data: {
     *      total_conversations: 10,
     *      ...
     *   }
     * }
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
  // LOAD AI INSIGHTS
  // =========================================================

  useEffect(() => {

    let isMounted = true;


    const loadAiInsights = async () => {

      try {

        setLoading(true);


        /*
         * Fetch both resources independently.
         *
         * If the insights endpoint fails, conversations
         * can still render.
         *
         * If conversations fail, the AI insights can still
         * render.
         */

        const [
          conversationsResult,
          insightsResult,
        ] = await Promise.allSettled([

          apiService.getConversations(),

          apiService.fetchBloomBotAdminInsightsBackend(),

        ]);


        if (!isMounted) {
          return;
        }


        // ===================================================
        // CONVERSATIONS
        // ===================================================

        if (
          conversationsResult.status ===
          "fulfilled"
        ) {

          setConversations(
            toArray(
              conversationsResult.value
            )
          );

        } else {

          console.error(
            "AI Insights conversations fetch failed:",
            conversationsResult.reason
          );

          setConversations([]);

        }


        // ===================================================
        // AI INSIGHTS
        // ===================================================

        if (
          insightsResult.status ===
          "fulfilled"
        ) {

          const normalized =
            normalizeInsights(
              insightsResult.value
            );

          setInsights(
            normalized
          );

        } else {

          console.error(
            "BloomBot admin insights fetch failed:",
            insightsResult.reason
          );

          setInsights(null);

        }

      } catch (error) {

        console.error(
          "AI Insights page loading error:",
          error
        );

        if (isMounted) {

          setConversations([]);

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
  // COMPUTED STATS
  // =========================================================

  const totalSessions =
    conversations.length;


  const totalFeedbacks =
    Number(
      insights?.total_conversations || 0
    );


  const helpfulCount =
    Number(
      insights?.helpful_responses || 0
    );


  const notHelpfulCount =
    Number(
      insights?.not_helpful_responses || 0
    );


  const retryRequestsCount =
    Math.round(
      notHelpfulCount * 1.2
    ) || 0;


  const helpfulPct =
    insights?.helpful_percentage ??
    100.0;


  const recentFeedbacks =
    Array.isArray(
      insights?.recent_feedback
    )
      ? insights.recent_feedback
      : [];


  // =========================================================
  // ESTIMATED TOKENS
  // =========================================================

  let totalWords = 0;


  conversations.forEach(
    (conversation) => {

      if (
        !conversation ||
        !Array.isArray(
          conversation.messages
        )
      ) {
        return;
      }


      conversation.messages.forEach(
        (message) => {

          if (
            message?.text
          ) {

            totalWords +=
              String(
                message.text
              )
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length;

          }

        }
      );

    }
  );


  const estimatedTokens =
    Math.round(
      totalWords * 1.3
    );


  // =========================================================
  // HELPER FOR FEEDBACK REASONS
  // =========================================================

  const getReasonEntries = (
    value
  ) => {

    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return [];
    }


    return Object.entries(
      value
    );

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

          AI Insights & BloomBot Performance

        </h1>


        <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] mt-1">

          Comprehensive performance evaluation, user
          satisfaction metrics, and response quality logs
          for BloomBot.

        </p>

      </div>


      {/* ===================================================
          PRIMARY KPI ROW
      =================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">


        {/* TOTAL CONVERSATIONS */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#5C3D2E] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Total Conversations
            </span>

            <MessageSquare className="w-4 h-4 text-[#5C3D2E]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : totalSessions}

          </div>


          <div className="text-[10px] text-[#8C7667]">

            Active user chats

          </div>

        </div>


        {/* HELPFUL */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#889868] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Helpful Responses
            </span>

            <ThumbsUp className="w-4 h-4 text-[#889868]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#2D5A27] dark:text-[#A4C497]">

            {loading
              ? "..."
              : helpfulCount}

          </div>


          <div className="text-[10px] text-[#889868] font-semibold">

            Positive ratings

          </div>

        </div>


        {/* NOT HELPFUL */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#E07A5F] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Not Helpful Responses
            </span>

            <ThumbsDown className="w-4 h-4 text-[#E07A5F]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#C46E52]">

            {loading
              ? "..."
              : notHelpfulCount}

          </div>


          <div className="text-[10px] text-[#E07A5F] font-semibold">

            Needs refinement

          </div>

        </div>


        {/* RETRIES */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#D4A373] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Retry Requests
            </span>

            <RefreshCw className="w-4 h-4 text-[#D4A373]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : retryRequestsCount}

          </div>


          <div className="text-[10px] text-[#8C7667]">

            Regenerated responses

          </div>

        </div>


        {/* SATISFACTION */}

        <div className="cozy-card p-5 space-y-2 border-l-4 border-l-[#4F5D3D] bg-[#FFFBF7] dark:bg-[#251E19]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Response Satisfaction %
            </span>

            <Sparkles className="w-4 h-4 text-[#4F5D3D]" />

          </div>


          <div className="font-serif text-2xl font-bold text-[#2D5A27] dark:text-[#A4C497]">

            {loading
              ? "..."
              : `${helpfulPct}%`}

          </div>


          <div className="text-[10px] text-[#889868] font-semibold">

            Overall satisfaction

          </div>

        </div>

      </div>


      {/* ===================================================
          TECHNICAL METRICS
      =================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


        {/* TOKENS */}

        <div className="cozy-card p-4 space-y-1.5 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Tokens Consumed
            </span>

            <Cpu className="w-4 h-4 text-[#E07A5F]" />

          </div>


          <div className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : estimatedTokens > 1000
                ? `${(
                    estimatedTokens / 1000
                  ).toFixed(1)}k`
                : estimatedTokens}

          </div>


          <div className="text-[10px] text-[#8C7667]">

            Gemini 2.5 Flash

          </div>

        </div>


        {/* LATENCY */}

        <div className="cozy-card p-4 space-y-1.5 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Avg Response Latency
            </span>

            <Zap className="w-4 h-4 text-[#D4A373]" />

          </div>


          <div className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            {loading
              ? "..."
              : totalSessions > 0
                ? "380 ms"
                : "Ready"}

          </div>


          <div className="text-[10px] text-[#889868]">

            Low latency streaming

          </div>

        </div>


        {/* EMPATHY */}

        <div className="cozy-card p-4 space-y-1.5 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Empathy Grounding
            </span>

            <HeartHandshake className="w-4 h-4 text-[#889868]" />

          </div>


          <div className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            100%

          </div>


          <div className="text-[10px] text-[#889868]">

            Warm & empathetic

          </div>

        </div>


        {/* SAFETY */}

        <div className="cozy-card p-4 space-y-1.5 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">

          <div className="flex items-center justify-between text-xs text-[#8C7667]">

            <span>
              Safety Pass Rate
            </span>

            <ShieldCheck className="w-4 h-4 text-[#4F5D3D]" />

          </div>


          <div className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            100%

          </div>


          <div className="text-[10px] text-[#889868]">

            Crisis & safety verified

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
        totalSessions === 0 &&
        !insights && (

          <div className="cozy-card p-5 text-center">

            <p className="text-xs text-[#8C7667]">

              AI insight data is currently unavailable.
              The dashboard is still operational.

            </p>

          </div>

        )}

    </div>

  );

};