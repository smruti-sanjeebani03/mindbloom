import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Flower2,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  X,
  MessageSquare,
  AlertCircle,
  Pencil,
  ArrowRight,
  Lock,
  Crown
} from "lucide-react";
import { BloomBotAvatar, BloomBotCatMascot, AutumnLeafIllustration, MapleLeafIcon, MapleLeafCluster } from "../../components/illustrations/CozyIllustrations";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/apiService";

const WELCOME_SUGGESTION_CARDS = [
  { text: "I'm feeling overwhelmed", icon: "🍂" },
  { text: "Help me manage stress", icon: "🍁" },
  { text: "I want to reflect on my day", icon: "📖" },
  { text: "I can't sleep", icon: "🌙" },
  { text: "I just need someone to talk to", icon: "💬" },
  { text: "Can you give me a solution or advice?", icon: "💡" }
];

const HELPFUL_REASONS = [
  "Felt understood",
  "Helpful advice",
  "Warm response",
  "Natural conversation",
  "Encouraging",
  "Easy to understand",
  "Made me feel calmer",
  "Other"
];

const NOT_HELPFUL_REASONS = [
  "Didn't understand me",
  "Too generic",
  "Too long",
  "Too short",
  "Didn't answer my question",
  "Didn't feel supportive",
  "Repetitive",
  "Sounded robotic",
  "Other"
];

export const BloomBotPage = () => {
  const { user, setUser, addToast } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);

  // User Subscription & Payment States
  const [userSub, setUserSub] = useState({
    chat_count: user?.chat_count || 0,
    subscription_type: user?.subscription_type || "free",
    subscription_status: user?.subscription_status || "inactive"
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const isPremium = userSub.subscription_status === "active" || userSub.subscription_type === "premium";
  const chatsRemaining = isPremium ? "Unlimited" : Math.max(0, 100 - (userSub.chat_count || 0));
  const isLimitReached = !isPremium && (userSub.chat_count || 0) >= 100;

  // Sync with backend subscription state on load
  useEffect(() => {
    apiService.fetchSubscriptionStatusBackend().then((res) => {
      if (res?.data) {
        const data = res.data;
        setUserSub({
          chat_count: data.chat_count ?? 0,
          subscription_type: data.subscription_type || "free",
          subscription_status: data.subscription_status || "inactive"
        });
        if (data.subscription_status !== "active" && data.subscription_type !== "premium" && (data.chat_count >= 100)) {
          setShowUpgradeModal(true);
        }
      }
    });
  }, []);

  // Razorpay / Payment Upgrade Flow
  const handleUpgradeNow = async () => {
    setIsProcessingPayment(true);
    try {
      const orderRes = await apiService.createPaymentOrderBackend("monthly");

      if (!orderRes || !orderRes.success || !orderRes.order_id) {
        addToast("Payment Error", orderRes?.message || "Could not create payment order.", "warning");
        setIsProcessingPayment(false);
        return;
      }

      if (window.Razorpay) {
        const options = {
          key: orderRes.key_id,
          amount: orderRes.amount,
          currency: orderRes.currency || "INR",
          name: "MindBloom Premium",
          description: "Unlimited BloomBot conversations & emotional support",
          image: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=MindBloom&backgroundColor=efe6dc",
          order_id: orderRes.order_id,
          handler: async function (response) {
            if (!response.razorpay_payment_id || !response.razorpay_signature) {
              addToast("Payment Error", "Incomplete payment verification details received.", "warning");
              setIsProcessingPayment(false);
              return;
            }
            const verifyRes = await apiService.verifyPaymentAndSubscribeBackend({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id || orderRes.order_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verifyRes.success) {
              const updated = {
                ...userSub,
                subscription_type: "premium",
                subscription_status: "active"
              };
              setUserSub(updated);
              setUser((prev) => ({ ...prev, subscription_type: "premium", subscription_status: "active" }));
              setShowUpgradeModal(false);
              addToast("Upgrade Successful 🌸", "Welcome to MindBloom Premium! Enjoy unlimited BloomBot conversations.", "success");
            } else {
              addToast("Payment Error", verifyRes.message || "Failed to verify payment.", "warning");
            }
            setIsProcessingPayment(false);
          },
          prefill: {
            name: user?.name || "MindBloom Member",
            email: user?.email || "user@example.com"
          },
          theme: {
            color: "#8B5E3C"
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          addToast("Payment Failed", response.error?.description || "Payment was not completed.", "warning");
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        addToast("Payment Error", "Razorpay payment SDK is not loaded. Please refresh the page.", "warning");
        setIsProcessingPayment(false);
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setIsProcessingPayment(false);
      addToast("Payment Error", "Something went wrong initiating payment. Please try again.", "warning");
    }
  };

  // Response Feedback & Retry States
  const [activeFeedbackModal, setActiveFeedbackModal] = useState(null); // { msgId, feedbackType, userPrompt, aiResponse }
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [optionalComment, setOptionalComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({}); // msgId -> 'Helpful' | 'Not Helpful'
  const [retryingMsgId, setRetryingMsgId] = useState(null);

  // Message Edit States
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");

  const messagesEndRef = useRef(null);
  const userTurnCount = messages.filter((m) => m.sender === "user").length;

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isMaximized) {
        setIsMaximized(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isMaximized]);

  const toggleMaximize = () => {
    const nextState = !isMaximized;
    setIsMaximized(nextState);
    if (nextState) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showWelcomeScreen]);

  const handleSendMessage = async (textToSend) => {
    if (isLimitReached) {
      setShowUpgradeModal(true);
      return;
    }
    const text = textToSend || inputText;
    if (!text.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: timeStr
    };
    setShowWelcomeScreen(false);
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const historyContext = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

      const data = await apiService.sendMessage(null, text, historyContext);

      if (data.limit_reached) {
        setShowUpgradeModal(true);
        setUserSub((prev) => ({
          ...prev,
          chat_count: data.chat_count || 100
        }));
        setUser((prev) => ({ ...prev, chat_count: data.chat_count || 100 }));
        setIsTyping(false);
        return;
      }

      if (!data.success && data.error) {
        throw new Error(data.error);
      }

      // Update chat count upon successful conversation
      const updatedCount = data.chat_count !== undefined ? data.chat_count : (userSub.chat_count + 1);
      const updatedSub = {
        ...userSub,
        chat_count: updatedCount
      };
      setUserSub(updatedSub);
      setUser((prev) => ({ ...prev, chat_count: updatedCount }));

      const botReplyText = data.reply || data.text || "I am right here with you.";

      const botMsg = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botReplyText,
        userPrompt: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, botMsg]);

      if (!isPremium && updatedCount >= 100) {
        setShowUpgradeModal(true);
      }
    } catch (err) {
      console.error("Error communicating with BloomBot backend:", err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: "bot",
        isError: true,
        errorTitle: "Unable to Connect to BloomBot",
        errorDetail: err?.message || "An unexpected error occurred while reaching the API service.",
        userPrompt: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
      addToast("Connection Issue", "Could not reach BloomBot. Click 'Retry Request' in the chat to reconnect.", "warning");
    } finally {
      setIsTyping(false);
    }
  };

  // Resubmit prompt after network or API request failure
  const handleResubmitPrompt = async (promptText, errorMsgId) => {
    if (!promptText) return;
    setRetryingMsgId(errorMsgId);
    setIsTyping(true);

    try {
      const historyContext = messages
        .filter((m) => m.id !== errorMsgId && !m.isError)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text
        }));

      const data = await apiService.sendMessage(null, promptText, historyContext);

      if (data.limit_reached) {
        setShowUpgradeModal(true);
        setUserSub((prev) => ({
          ...prev,
          chat_count: data.chat_count || 100
        }));
        setUser((prev) => ({ ...prev, chat_count: data.chat_count || 100 }));
        setIsTyping(false);
        setRetryingMsgId(null);
        return;
      }

      if (!data.success) {
        const errMsg = data.message || data.error || "Unable to communicate with BloomBot server.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === errorMsgId
              ? {
                  ...m,
                  errorDetail: `Retry failed (${errMsg}). Please check your connection and try again.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              : m
          )
        );
        addToast("Retry Failed", errMsg, "warning");
        return;
      }

      // Update chat count upon successful conversation
      const updatedCount = data.chat_count !== undefined ? data.chat_count : (userSub.chat_count + 1);
      const updatedSub = {
        ...userSub,
        chat_count: updatedCount
      };
      setUserSub(updatedSub);
      setUser((prev) => ({ ...prev, chat_count: updatedCount }));

      const botReplyText = data.reply || data.text || "I am right here with you.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === errorMsgId
            ? {
                id: `b-${Date.now()}`,
                sender: "bot",
                text: botReplyText,
                userPrompt: promptText,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            : m
        )
      );
      addToast("Connection Restored", "BloomBot response successfully received! 🌸", "info");

      if (!isPremium && updatedCount >= 100) {
        setShowUpgradeModal(true);
      }
    } catch (err) {
      console.error("Retry resubmit failed:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === errorMsgId
            ? {
                ...m,
                errorDetail: `Retry failed (${err.message || "Network error"}). Please check your connection and try again.`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            : m
        )
      );
      addToast("Retry Failed", err.message || "Network request failed again.", "warning");
    } finally {
      setIsTyping(false);
      setRetryingMsgId(null);
    }
  };

  const handleDismissError = (errorMsgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== errorMsgId));
  };

  // Edit Message Handlers
  const handleStartEdit = (msg) => {
    setEditingMsgId(msg.id);
    setEditText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingMsgId(null);
    setEditText("");
  };

  const handleSaveAndRegenerateEdit = async (msgId) => {
    const trimmedText = editText.trim();
    if (!trimmedText) return;

    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex === -1) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Update the targeted user message
    const updatedUserMsg = {
      ...messages[msgIndex],
      text: trimmedText,
      timestamp: timeStr
    };

    // History before this message
    const historyBefore = messages.slice(0, msgIndex);

    // Replace user message and strip previous AI response / subsequent messages
    setMessages([...historyBefore, updatedUserMsg]);
    setEditingMsgId(null);
    setEditText("");
    setIsTyping(true);

    try {
      const historyContext = historyBefore.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

      const res = await apiService.regenerateMessageBackend(trimmedText, historyContext);
      const botReplyText = res.response || res.reply || "I am right here with you. Take a soft, gentle breath.";

      const botMsg = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botReplyText,
        userPrompt: trimmedText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error regenerating reply after message edit:", err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: "bot",
        isError: true,
        errorTitle: "Unable to Connect to BloomBot",
        errorDetail: err?.message?.includes("HTTP error") || err?.message?.includes("Failed to fetch")
          ? "A network or API request error occurred while processing your message. Please check your connection."
          : "An unexpected error occurred while reaching the API service.",
        userPrompt: trimmedText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
      addToast("Connection Issue", "Could not reach BloomBot. Click 'Retry Request' in the chat to reconnect.", "warning");
    } finally {
      setIsTyping(false);
    }
  };

  // Open Feedback Modal
  const handleOpenFeedbackModal = (msg, type) => {
    // Find associated user prompt
    let userPromptText = msg.userPrompt;
    if (!userPromptText) {
      const idx = messages.findIndex((m) => m.id === msg.id);
      if (idx > 0 && messages[idx - 1].sender === "user") {
        userPromptText = messages[idx - 1].text;
      } else {
        userPromptText = "User conversation query";
      }
    }

    setActiveFeedbackModal({
      msgId: msg.id,
      feedbackType: type,
      userPrompt: userPromptText,
      aiResponse: msg.text
    });
    setSelectedReasons([]);
    setOptionalComment("");
  };

  // Toggle reason selection
  const handleToggleReason = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  // Submit Feedback
  const handleSubmitFeedback = async () => {
    if (!activeFeedbackModal) return;
    setSubmittingFeedback(true);
    try {
      const result = await apiService.submitBloomBotFeedbackBackend(
        activeFeedbackModal.userPrompt,
        activeFeedbackModal.aiResponse,
        activeFeedbackModal.feedbackType,
        selectedReasons,
        optionalComment
      );

      setFeedbackStatus((prev) => ({
        ...prev,
        [activeFeedbackModal.msgId]: activeFeedbackModal.feedbackType
      }));

      addToast(
        "Feedback Received",
        result.message || "Thanks for taking a moment to share that. It helps us make BloomBot more thoughtful over time. 🌸",
        "info"
      );
    } catch (err) {
      console.error("Error submitting feedback:", err);
      addToast("Feedback", "Thanks for sharing your feedback with us! 🌸", "info");
    } finally {
      setSubmittingFeedback(false);
      setActiveFeedbackModal(null);
    }
  };

  // Handle Retry (🔄)
  const handleRetryMessage = async (msg) => {
    setRetryingMsgId(msg.id);
    let promptToRetry = msg.userPrompt;
    if (!promptToRetry) {
      const idx = messages.findIndex((m) => m.id === msg.id);
      if (idx > 0 && messages[idx - 1].sender === "user") {
        promptToRetry = messages[idx - 1].text;
      } else {
        promptToRetry = "Tell me how to feel calmer today.";
      }
    }

    const historyContext = messages
      .filter((m) => m.id !== msg.id && !m.isError)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

    try {
      const result = await apiService.retryBloomBotResponseBackend({
        message: promptToRetry,
        history: historyContext,
        previous_response: msg.text
      });

      if (result && result.success && result.reply) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id
              ? {
                  ...m,
                  text: result.reply,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              : m
          )
        );
        addToast("Response Regenerated", "Generated a fresh response with new phrasing. 🌿", "info");
      } else {
        addToast("Retry Failed", result?.message || "Failed to regenerate response. Please try again.", "warning");
      }
    } catch (err) {
      console.error("Retry error:", err);
      addToast("Retry Failed", err?.message || "Failed to regenerate response. Please try again.", "warning");
    } finally {
      setRetryingMsgId(null);
    }
  };

  const handleStartFresh = () => {
    setMessages([]);
    setShowWelcomeScreen(true);
    setInputText("");
    addToast("Fresh Start", "Started a brand new conversation in the present moment.", "info");
  };

  const handleClearConversation = () => {
    setMessages([]);
    setShowWelcomeScreen(false);
    setInputText("");
    addToast("Cleared", "Conversation cleared.", "info");
  };

  const handleCopy = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    addToast("Copied", "Message copied to clipboard", "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className={`transition-all duration-300 flex flex-col ${
        isMaximized
          ? "fixed inset-0 z-50 p-2 sm:p-4 bg-[#FFFBF7] dark:bg-[#1A1412] w-screen h-screen"
          : "w-full mx-auto max-w-4xl lg:max-w-5xl h-[calc(100vh-6rem)] pb-2"
      }`}
    >
      {/* BloomBot Main Container */}
      <div className="cozy-card flex-1 flex flex-col justify-between h-full overflow-hidden bloombot-chat-pattern border border-[#E6DED5] dark:border-[#3D3128] shadow-sm rounded-3xl relative">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-[#EFE6DC] dark:border-[#3D3128] bg-[#FAF6F0] dark:bg-[#241E1A] flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BloomBotAvatar className="w-11 h-11 shrink-0 shadow-2xs" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#889868] border-2 border-[#FAF6F0] dark:border-[#241E1A] rounded-full" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="font-serif font-bold text-lg text-[#3E2723] dark:text-[#FFFBF7] flex items-center gap-1.5">
                  <span>BloomBot</span>
                  <MapleLeafIcon className="w-4.5 h-4.5 text-[#E07A5F]" />
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F0E6] dark:bg-[#1E301B] text-[#2D5A27] dark:text-[#A8E29E] border border-[#C8E0C4] dark:border-[#2E5227]">
                  Online
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF0E6] dark:bg-[#32231A] text-[#C46E52] dark:text-[#E29578] border border-[#F0D5C7] dark:border-[#423026]"
                  title="BloomBot listens attentively and chats naturally. Ask anytime for a solution!"
                >
                  🐾 Caring Companion
                </span>
              </div>
              <p className="text-xs text-[#795548] dark:text-[#C5B5A7]">Your AI Wellness Companion</p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            {/* Free Chats Remaining Counter Badge */}
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition cursor-pointer shadow-2xs ${
                isPremium
                  ? "bg-[#E8F0E6] dark:bg-[#1E301B] border-[#C8E0C4] dark:border-[#2E5227] text-[#2D5A27] dark:text-[#A8E29E]"
                  : isLimitReached
                  ? "bg-[#FDF2F0] dark:bg-[#321E1C] border-[#F0D5C7] dark:border-[#423026] text-[#C46E52] dark:text-[#E29578] animate-pulse"
                  : "bg-[#FAF6F0] dark:bg-[#2E2721] border-[#E6DED5] dark:border-[#3D3128] text-[#5D4037] dark:text-[#E8DCCF] hover:border-[#8B5E3C]"
              }`}
              title={isPremium ? "MindBloom Premium — Unlimited Chats" : "Click to view MindBloom Premium options"}
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isPremium ? "text-[#2D5A27] dark:text-[#93D98A]" : "text-[#E07A5F]"}`} />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] uppercase tracking-wider font-bold opacity-75">
                  {isPremium ? "MindBloom Premium" : "Free Chats Remaining:"}
                </span>
                <span className="text-xs font-extrabold tracking-tight">
                  {isPremium ? "Unlimited 🌸" : `${chatsRemaining} / 100`}
                </span>
              </div>
            </button>

            <button
              onClick={toggleMaximize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5D4037] dark:text-[#E8DCCF] bg-[#FAF6F0] dark:bg-[#2E2721] hover:bg-[#F0E6DA] dark:hover:bg-[#3B322B] transition border border-[#E6DED5] dark:border-[#3D3128] shadow-2xs cursor-pointer"
              title={isMaximized ? "Exit full screen view" : "Maximize to full screen"}
            >
              {isMaximized ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span className="hidden sm:inline">Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#8B5E3C] dark:text-[#E07A5F]" />
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>
            <button
              onClick={handleStartFresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#5D4037] dark:text-[#E8DCCF] bg-[#FAF6F0] dark:bg-[#2E2721] hover:bg-[#F0E6DA] dark:hover:bg-[#3B322B] transition border border-[#E6DED5] dark:border-[#3D3128]"
              title="Reset conversation to the welcome screen"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#8B5E3C] dark:text-[#E07A5F]" />
              <span className="hidden md:inline">Start Fresh</span>
            </button>
            <button
              onClick={handleClearConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#8D6E63] dark:text-[#C2B2A3] hover:text-[#5D4037] dark:hover:text-[#FFFBF7] hover:bg-[#F5EFE6] dark:hover:bg-[#2E2721] transition border border-[#E6DED5] dark:border-[#3D3128]"
              title="Clear all messages"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Chat Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative">
          {/* Subtle Watermark */}
          <div
            className="absolute right-2 bottom-2 sm:right-6 sm:bottom-4 pointer-events-none select-none z-0 opacity-10 sm:opacity-12 transition-opacity"
            aria-hidden="true"
          >
            <BloomBotCatMascot showPlant={true} className="w-48 h-48 sm:w-64 sm:h-64" />
          </div>

          {/* Messages Layer */}
          <div className="relative z-10 space-y-4">
            {/* WELCOME SCREEN STATE */}
            {showWelcomeScreen && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center my-auto py-6 space-y-6 max-w-lg mx-auto"
              >
                <div className="relative">
                  <div className="absolute -top-4 -right-4 opacity-70 pointer-events-none">
                    <MapleLeafCluster className="w-20 h-20" />
                  </div>
                  <BloomBotCatMascot showPlant={true} className="w-44 h-44 sm:w-52 sm:h-52" />
                </div>

                <div className="bg-[#FAF6F0] dark:bg-[#2A231D] border border-[#E6DED5] dark:border-[#3D3128] p-5 rounded-3xl space-y-2 text-[#3E2723] dark:text-[#FFFBF7] shadow-2xs relative overflow-hidden">
                  <div className="absolute top-2 right-3 opacity-35 pointer-events-none">
                    <MapleLeafIcon className="w-8 h-8 text-[#E07A5F]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#3E2723] dark:text-[#FFFBF7] flex items-center justify-center gap-2">
                    <span>Meow-meow!! 🐾</span>
                    <MapleLeafIcon className="w-5 h-5 text-[#E07A5F]" />
                  </h3>
                  <div className="flex items-center justify-center pt-0.5 pb-1">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F5EFE6] dark:bg-[#342820] text-[#E07A5F] dark:text-[#E8A87C] border border-[#E6DED5] dark:border-[#42342B]">
                      Hi! I'm BloomBot 🐱
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5D4037] dark:text-[#D8C4B2] leading-relaxed">
                    I'm your cozy cat companion. 🐾 I listen with care, understand your thoughts, and offer gentle guidance whenever you're ready.
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-[#8B5E3C] dark:text-[#E07A5F] flex items-center justify-center gap-1.5">
                    <MapleLeafIcon className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>What's on your mind today?</span>
                  </p>
                </div>

                {/* Suggestion Cards */}
                <div className="w-full space-y-2">
                  <p className="text-xs font-medium text-[#8D6E63] dark:text-[#B5A496] flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#E29578]" />
                    <span>Choose a topic to begin:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {WELCOME_SUGGESTION_CARDS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(item.text)}
                        className={`w-full p-3 text-left rounded-2xl bg-[#FAF6F0] dark:bg-[#2A231D] hover:bg-[#8B5E3C] dark:hover:bg-[#E07A5F] hover:text-[#FAF8F5] dark:hover:text-[#171310] text-[#3E2723] dark:text-[#E8DCCF] border border-[#E6DED5] dark:border-[#3D3128] transition-all text-xs font-medium flex items-center gap-2.5 shadow-2xs hover:shadow-xs group ${
                          idx === WELCOME_SUGGESTION_CARDS.length - 1
                            ? "sm:col-span-2 lg:col-span-1 justify-center"
                            : ""
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="flex-1">{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* EMPTY STATE */}
            {!showWelcomeScreen && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12 space-y-4 max-w-md mx-auto my-auto"
              >
                <BloomBotCatMascot showPlant={false} className="w-36 h-36" />
                <div className="space-y-2 text-[#3E2723] dark:text-[#FFFBF7]">
                  <p className="font-serif font-bold text-base text-[#3E2723] dark:text-[#FFFBF7]">
                    Every conversation is a fresh beginning.
                  </p>
                  <p className="text-xs text-[#795548] dark:text-[#C5B5A7]">
                    I'm here whenever you're ready.
                  </p>
                </div>
                <button
                  onClick={handleStartFresh}
                  className="cozy-btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 rounded-2xl"
                >
                  <Flower2 className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Show Welcome Prompts</span>
                </button>
              </motion.div>
            )}

            {/* MESSAGES LIST */}
            {messages.length > 0 && (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <BloomBotAvatar className="w-9 h-9 shrink-0 mt-0.5 shadow-2xs" />
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Message Content or Error Card */}
                      {msg.isError ? (
                        <div className="bg-[#FFF4F2] dark:bg-[#2F1D1A] border border-[#F5C2BA] dark:border-[#5C2B23] p-4 rounded-3xl text-xs sm:text-sm space-y-3 shadow-2xs rounded-tl-xs max-w-md">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#FDE2DC] dark:bg-[#45221B] text-[#C46E52] dark:text-[#E8957C] flex items-center justify-center shrink-0 mt-0.5">
                              <AlertCircle className="w-4.5 h-4.5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#8C341F] dark:text-[#F2ADA0] flex items-center gap-1.5">
                                <span>{msg.errorTitle || "Unable to Connect to BloomBot"}</span>
                              </h4>
                              <p className="text-xs text-[#704237] dark:text-[#E0BAB2] leading-relaxed">
                                {msg.errorDetail || "A network or API request error occurred while communicating with the server."}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons for Error Card */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#FADCD6] dark:border-[#42221B]">
                            <button
                              type="button"
                              onClick={() => handleResubmitPrompt(msg.userPrompt, msg.id)}
                              disabled={retryingMsgId === msg.id}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C46E52] text-white hover:bg-[#A8583E] transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                              title="Re-send prompt to API"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${retryingMsgId === msg.id ? "animate-spin" : ""}`} />
                              <span>{retryingMsgId === msg.id ? "Retrying Request..." : "Retry Request"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDismissError(msg.id)}
                              className="px-2 py-1.5 rounded-xl text-xs text-[#A8796E] dark:text-[#C49B91] hover:text-[#704237] dark:hover:text-[#FFFBF7] transition"
                              title="Dismiss error message"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : editingMsgId === msg.id ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="bg-[#8B5E3C] dark:bg-[#D87D56] text-[#FAF8F5] dark:text-[#171310] p-3.5 sm:p-4 rounded-3xl rounded-tr-xs shadow-md space-y-3 min-w-[280px] sm:min-w-[340px]"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-white/20 dark:border-black/20 pb-2">
                            <span className="text-xs font-semibold flex items-center gap-1.5 opacity-90">
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit Message</span>
                            </span>
                            <span className="text-[10px] opacity-75">Ctrl+Enter to save</span>
                          </div>
                          <textarea
                            rows={3}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                handleSaveAndRegenerateEdit(msg.id);
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                handleCancelEdit();
                              }
                            }}
                            autoFocus
                            className="w-full bg-[#704627] dark:bg-[#C2653D] text-[#FFFBF7] dark:text-[#171310] placeholder-[#D0B8A8] dark:placeholder-[#38261E] p-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-xs sm:text-sm font-medium resize-none shadow-inner"
                            placeholder="Rewrite your message..."
                          />
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/15 dark:bg-black/25 text-[#FFFBF7] dark:text-[#171310] hover:bg-black/25 dark:hover:bg-black/35 transition flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveAndRegenerateEdit(msg.id)}
                              disabled={!editText.trim() || isTyping}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FFFBF7] text-[#8B5E3C] dark:bg-[#171310] dark:text-[#FAF8F5] hover:opacity-90 transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                              <span>Save & Regenerate</span>
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div
                          className={`p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-[#8B5E3C] dark:bg-[#D87D56] text-[#FAF8F5] dark:text-[#171310] font-medium rounded-tr-xs shadow-2xs"
                              : "bg-[#FAF6F0] dark:bg-[#2A231D] border border-[#E6DED5] dark:border-[#3D3128] text-[#3E2723] dark:text-[#F7EBE1] rounded-tl-xs shadow-2xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      )}

                      {/* Message Footer Actions */}
                      <div
                        className={`flex flex-wrap items-center gap-2 text-[10px] text-[#8D6E63] dark:text-[#A08C7C] ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{msg.timestamp}</span>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-[#3E2723] dark:hover:text-[#FFFBF7] transition p-0.5 cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-[#2D5A27] dark:text-[#889868]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>

                        {/* EDIT BUTTON (For User Messages) */}
                        {msg.sender === "user" && editingMsgId !== msg.id && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(msg)}
                            disabled={isTyping}
                            className="hover:text-[#3E2723] dark:hover:text-[#FFFBF7] transition p-0.5 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Edit message"
                          >
                            <Pencil className="w-3 h-3 text-[#8B5E3C] dark:text-[#E07A5F]" />
                            <span>Edit</span>
                          </button>
                        )}

                        {/* RESPONSE FEEDBACK & RETRY BUTTONS (For Bot Messages) */}
                        {msg.sender === "bot" && (
                          <div className="flex items-center gap-1.5 ml-2 border-l border-[#E6DED5] dark:border-[#3D3128] pl-2">
                            {feedbackStatus[msg.id] ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F0E6] dark:bg-[#1E301B] text-[#2D5A27] dark:text-[#93D98A] flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" />
                                <span>{feedbackStatus[msg.id]} Feedback Shared 🌸</span>
                              </span>
                            ) : (
                              <>
                                {/* 👍 Helpful Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenFeedbackModal(msg, "Helpful")}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFBF7] dark:bg-[#241E1A] hover:bg-[#EBF3E8] dark:hover:bg-[#1E2B1C] border border-[#E6DCCD] dark:border-[#382D25] text-[#3E2723] dark:text-[#E8DCCF] transition hover:text-[#2E602A] dark:hover:text-[#93D98A]"
                                  title="Mark as Helpful"
                                >
                                  <ThumbsUp className="w-3 h-3 text-[#889868]" />
                                  <span>Helpful</span>
                                </button>

                                {/* 👎 Not Helpful Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenFeedbackModal(msg, "Not Helpful")}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFBF7] dark:bg-[#241E1A] hover:bg-[#FDF2F0] dark:hover:bg-[#321E1C] border border-[#E6DCCD] dark:border-[#382D25] text-[#3E2723] dark:text-[#E8DCCF] transition hover:text-[#C46E52] dark:hover:text-[#E29578]"
                                  title="Mark as Not Helpful"
                                >
                                  <ThumbsDown className="w-3 h-3 text-[#E07A5F]" />
                                  <span>Not Helpful</span>
                                </button>
                              </>
                            )}

                            {/* 🔄 Retry Button */}
                            <button
                              type="button"
                              onClick={() => handleRetryMessage(msg)}
                              disabled={retryingMsgId === msg.id}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFBF7] dark:bg-[#241E1A] hover:bg-[#F5EFE6] dark:hover:bg-[#2E251E] border border-[#E6DCCD] dark:border-[#382D25] text-[#3E2723] dark:text-[#E8DCCF] transition hover:text-[#8B5E3C] disabled:opacity-50"
                              title="Regenerate fresh response with different wording"
                            >
                              <RotateCcw
                                className={`w-3 h-3 text-[#8B5E3C] dark:text-[#E07A5F] ${
                                  retryingMsgId === msg.id ? "animate-spin" : ""
                                }`}
                              />
                              <span>Retry</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <BloomBotAvatar className="w-9 h-9 shrink-0" isBlinking={true} />
                <div className="bg-[#FAF6F0] dark:bg-[#2A231D] border border-[#E6DED5] dark:border-[#3D3128] px-4 py-3 rounded-3xl flex items-center gap-2 text-xs text-[#8D6E63] dark:text-[#C5B5A7] shadow-2xs">
                  <span className="text-xs">🐱</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#8B5E3C] dark:bg-[#E07A5F] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#8B5E3C] dark:bg-[#E07A5F] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#8B5E3C] dark:bg-[#E07A5F] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="ml-1 text-[11px] font-medium text-[#5D4037] dark:text-[#E8DCCF]">
                    BloomBot is thinking...
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="p-3 sm:p-4 border-t border-[#EFE6DC] dark:border-[#3D3128] bg-[#FAF8F5] dark:bg-[#241E1A] relative shrink-0 z-10">
          {isLimitReached && (
            <div className="mb-3 p-2.5 rounded-2xl bg-[#FDF2F0] dark:bg-[#321E1C] border border-[#F0D5C7] dark:border-[#423026] text-xs text-[#C46E52] dark:text-[#E29578] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-[#E07A5F]" />
                <span className="font-semibold">Free chat limit reached (100 / 100)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="px-3 py-1 rounded-xl bg-[#E07A5F] text-white font-bold text-[11px] shadow-2xs hover:bg-[#D0694E] transition cursor-pointer"
              >
                Upgrade Now
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLimitReached) {
                setShowUpgradeModal(true);
                return;
              }
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isLimitReached ? "🌸 Free chat limit reached. Upgrade to continue..." : "Share what's on your mind..."}
              onClick={() => {
                if (isLimitReached) setShowUpgradeModal(true);
              }}
              className="cozy-input flex-1 text-xs sm:text-sm py-3 px-4 rounded-full border-[#E6DED5] dark:border-[#3D3128] bg-[#FFFDF7] dark:bg-[#1A1512] text-[#3E2723] dark:text-[#FFFBF7] focus:bg-white dark:focus:bg-[#211B17]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="cozy-btn-primary p-3 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 shadow-xs hover:shadow-md transition cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Leaf Accent */}
          <div className="absolute right-3 -bottom-1 opacity-30 dark:opacity-45 pointer-events-none">
            <AutumnLeafIllustration className="w-9 h-9" />
          </div>
        </div>
      </div>

      {/* PREMIUM UPGRADE MODAL */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#FAF6F0] dark:bg-[#2A231D] border border-[#E6DED5] dark:border-[#3D3128] rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#EFE6DC] dark:hover:bg-[#382D25] text-[#8C7667] dark:text-[#A8988C] transition cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Mascot / Icon */}
              <div className="w-16 h-16 rounded-3xl bg-[#FDF2F0] dark:bg-[#321E1C] border border-[#F0D5C7] dark:border-[#423026] mx-auto flex items-center justify-center text-3xl shadow-xs">
                🌸
              </div>

              {/* Title & Copy */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-[#3E2723] dark:text-[#FFFBF7]">
                  🌸 You've reached your free chat limit.
                </h3>
                <p className="text-sm text-[#5D4037] dark:text-[#E8DCCF] leading-relaxed px-2">
                  You've enjoyed 100 free conversations with BloomBot.
                  <br />
                  Upgrade to MindBloom Premium to continue unlimited AI conversations and receive ongoing emotional support.
                </p>
              </div>

              {/* Premium Perks Card */}
              <div className="bg-[#FFFBF7] dark:bg-[#211B17] border border-[#E6DCCD] dark:border-[#382D25] rounded-2xl p-4 text-left space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#3E2723] dark:text-[#FFFBF7]">
                  <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                  <span>MindBloom Premium — Unlimited Access</span>
                </div>
                <ul className="text-xs text-[#6D4C41] dark:text-[#C5B5A7] space-y-1.5 pl-6 list-disc">
                  <li>Unlimited AI conversations with BloomBot</li>
                  <li>Priority response speeds & personalized emotional support</li>
                  <li>Ongoing reflection and mindfulness guidance</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleUpgradeNow}
                  disabled={isProcessingPayment}
                  className="w-full sm:w-auto flex-1 cozy-btn-primary px-6 py-3 rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Upgrade Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold text-[#8C7667] dark:text-[#A8988C] hover:bg-[#EFE6DC] dark:hover:bg-[#382D25] transition border border-transparent hover:border-[#E6DED5] dark:hover:border-[#3D3128] cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESPONSE FEEDBACK MODAL (Helpful 👍 & Not Helpful 👎) */}
      <AnimatePresence>
        {activeFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#FAF6F0] dark:bg-[#2A231D] border border-[#E6DED5] dark:border-[#3D3128] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveFeedbackModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#EFE6DC] dark:hover:bg-[#382D25] text-[#8C7667] dark:text-[#A8988C] transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeFeedbackModal.feedbackType === "Helpful"
                      ? "bg-[#E8F0E6] text-[#2D5A27] dark:bg-[#1E301B] dark:text-[#93D98A]"
                      : "bg-[#FDF2F0] text-[#C46E52] dark:bg-[#321E1C] dark:text-[#E29578]"
                  }`}
                >
                  {activeFeedbackModal.feedbackType === "Helpful" ? (
                    <ThumbsUp className="w-5 h-5" />
                  ) : (
                    <ThumbsDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3E2723] dark:text-[#FFFBF7]">
                    {activeFeedbackModal.feedbackType === "Helpful"
                      ? "What made this response helpful?"
                      : "How can BloomBot improve this response?"}
                  </h3>
                  <p className="text-xs text-[#8C7667] dark:text-[#A8988C]">
                    Select one or more reasons below to help refine BloomBot.
                  </p>
                </div>
              </div>

              {/* Reason Checkbox Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {(activeFeedbackModal.feedbackType === "Helpful"
                  ? HELPFUL_REASONS
                  : NOT_HELPFUL_REASONS
                ).map((reason) => {
                  const isSelected = selectedReasons.includes(reason);
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => handleToggleReason(reason)}
                      className={`p-2.5 rounded-xl text-left text-xs font-medium border transition flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-[#8B5E3C] dark:bg-[#E07A5F] text-[#FAF8F5] dark:text-[#171310] border-[#8B5E3C] dark:border-[#E07A5F]"
                          : "bg-[#FFFBF7] dark:bg-[#211B17] border-[#E6DCCD] dark:border-[#382D25] text-[#3E2723] dark:text-[#E8DCCF] hover:border-[#8B5E3C]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-white text-[#8B5E3C] border-white"
                            : "border-[#8C7667]"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{reason}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Comment Field */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-[#5D4037] dark:text-[#E8DCCF] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Anything else you'd like us to know? (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={optionalComment}
                  onChange={(e) => setOptionalComment(e.target.value)}
                  placeholder="Add any extra thoughts..."
                  className="cozy-input w-full text-xs p-3 rounded-2xl bg-[#FFFBF7] dark:bg-[#211B17] border-[#E6DCCD] dark:border-[#382D25] text-[#3E2723] dark:text-[#FFFBF7]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFeedbackModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8C7667] dark:text-[#A8988C] hover:bg-[#EFE6DC] dark:hover:bg-[#382D25] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback}
                  className="cozy-btn-primary px-5 py-2 text-xs rounded-xl font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingFeedback ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Feedback</span>
                      <MapleLeafIcon className="w-3.5 h-3.5 text-[#FFFBF7]" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};