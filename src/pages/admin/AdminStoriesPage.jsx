import { useState, useEffect, useMemo } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import {
  BookOpen,
  Search,
  Flag,
  UserX,
  UserCheck,
  Trash2,
  CheckCircle,
  Eye,
  AlertTriangle,
  X,
  Calendar,
  Tag,
  ShieldAlert
} from "lucide-react";
import { CozyBadge } from "../../components/common/UIComponents";

export const AdminStoriesPage = () => {
  const { addToast } = useAuth();
  const [stories, setStories] = useState([]);
  const [summary, setSummary] = useState({
    total_stories: 0,
    anonymous_stories: 0,
    reported_stories: 0,
    published_today: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'reported', 'anonymous', 'today'

  // Modals state
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [userStatusMap, setUserStatusMap] = useState({}); // track local user status toggles

  const loadAdminStories = async () => {
    setLoading(true);
    const res = await apiService.fetchAdminStoriesBackend();
    if (res.success) {
      setStories(res.data || []);
      setSummary(res.summary || {
        total_stories: res.data?.length || 0,
        anonymous_stories: res.data?.filter(s => s.is_anonymous).length || 0,
        reported_stories: res.data?.filter(s => s.is_reported).length || 0,
        published_today: 0
      });
    } else {
      addToast("Error Loading Stories", res.message || "Failed to load admin stories", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdminStories();
  }, []);

  const handleDismissReport = async (storyId, e) => {
    if (e) e.stopPropagation();
    const res = await apiService.dismissStoryReportBackend(storyId);
    if (res.success) {
      addToast("Report Dismissed 🌿", "The report has been cleared and the story remains published.", "success");
      if (selectedStory && selectedStory.id === storyId) {
        setSelectedStory(prev => ({ ...prev, is_reported: false, report_reason: null }));
      }
      loadAdminStories();
    } else {
      addToast("Action Failed", res.message || "Unable to dismiss report.", "error");
    }
  };

  const handleConfirmDeleteStory = async () => {
    if (!storyToDelete) return;
    const res = await apiService.deleteAdminStoryBackend(storyToDelete.id);
    if (res.success) {
      addToast("Story Removed 🗑️", `"${storyToDelete.title}" has been removed from public visibility.`, "info");
      if (selectedStory && selectedStory.id === storyToDelete.id) {
        setSelectedStory(null);
      }
      setStoryToDelete(null);
      loadAdminStories();
    } else {
      addToast("Deletion Failed", res.message || "Unable to delete story.", "error");
    }
  };

  const handleToggleUserSuspend = async (story, e) => {
    if (e) e.stopPropagation();
    const userId = story.user || story.user_email || story.author_name;
    const isCurrentlySuspended = userStatusMap[userId] === "suspended";

    if (isCurrentlySuspended) {
      const res = await apiService.reactivateUserBackend(userId);
      if (res.success) {
        setUserStatusMap(prev => ({ ...prev, [userId]: "active" }));
        addToast("User Reactivated 🔓", `Account for ${story.author_name} has been reactivated.`, "success");
      } else {
        addToast("Action Failed", res.message, "error");
      }
    } else {
      const res = await apiService.suspendUserBackend(userId);
      if (res.success) {
        setUserStatusMap(prev => ({ ...prev, [userId]: "suspended" }));
        addToast("User Suspended 🚫", `Account for ${story.author_name} has been suspended due to policy violations.`, "info");
      } else {
        addToast("Action Failed", res.message, "error");
      }
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredStories = useMemo(() => {
    return stories.filter(s => {
      // Filter tab check
      if (activeFilter === "reported" && !s.is_reported) return false;
      if (activeFilter === "anonymous" && !s.is_anonymous && s.author_name !== "Anonymous") return false;
      if (activeFilter === "today") {
        const dateStr = s.created_at ? new Date(s.created_at).toISOString().split("T")[0] : "";
        if (dateStr !== todayStr) return false;
      }

      // Search query check
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      const titleMatch = (s.title || "").toLowerCase().includes(q);
      const authorMatch = (s.author_name || "").toLowerCase().includes(q);
      const categoryMatch = (s.category || "").toLowerCase().includes(q);

      return titleMatch || authorMatch || categoryMatch;
    });
  }, [stories, activeFilter, search, todayStr]);

  const formatDate = (isoString) => {
    if (!isoString) return "Recently";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3B281C] flex items-center gap-2.5">
            <span>🌱 Story Management</span>
          </h1>
          <p className="text-xs text-[#705D52]">
            Monitor community stories, review reported content, manage anonymous submissions, and uphold safety guidelines.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, author, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cozy-input w-full !pl-10 py-2 text-xs"
          />
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cozy-card p-4 space-y-1 bg-[#FFFBF7]">
          <div className="text-[11px] font-semibold text-[#8C7667] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#E07A5F]" />
            Total Stories
          </div>
          <div className="font-serif text-2xl font-bold text-[#3B281C]">{summary.total_stories || stories.length}</div>
          <p className="text-[10px] text-[#A08C7D]">All published community entries</p>
        </div>

        <div className="cozy-card p-4 space-y-1 bg-[#FFFBF7]">
          <div className="text-[11px] font-semibold text-[#8C7667] uppercase tracking-wider flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5 text-[#8C7667]" />
            Anonymous Stories
          </div>
          <div className="font-serif text-2xl font-bold text-[#3B281C]">
            {summary.anonymous_stories || stories.filter(s => s.is_anonymous).length}
          </div>
          <p className="text-[10px] text-[#A08C7D]">Submitted with private identity</p>
        </div>

        <div className="cozy-card p-4 space-y-1 bg-[#FFFBF7]">
          <div className="text-[11px] font-semibold text-[#8C7667] uppercase tracking-wider flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-[#C85A32]" />
            Reported Stories
          </div>
          <div className="font-serif text-2xl font-bold text-[#C85A32]">
            {summary.reported_stories || stories.filter(s => s.is_reported).length}
          </div>
          <p className="text-[10px] text-[#A08C7D]">Flagged for admin moderation</p>
        </div>

        <div className="cozy-card p-4 space-y-1 bg-[#FFFBF7]">
          <div className="text-[11px] font-semibold text-[#8C7667] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#5C7052]" />
            Published Today
          </div>
          <div className="font-serif text-2xl font-bold text-[#3B281C]">
            {summary.published_today || 0}
          </div>
          <p className="text-[10px] text-[#A08C7D]">Submitted in last 24 hours</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EFE6DC] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === "all"
              ? "bg-[#3B281C] text-[#FFFBF7]"
              : "bg-[#F5EFE6] text-[#705D52] hover:bg-[#EFE6DC]"
          }`}
        >
          All Stories ({stories.length})
        </button>
        <button
          onClick={() => setActiveFilter("reported")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
            activeFilter === "reported"
              ? "bg-[#C85A32] text-white"
              : "bg-[#FBEBE6] text-[#C85A32] hover:bg-[#F4CFC5]"
          }`}
        >
          <Flag className="w-3 h-3" />
          Reported Stories ({stories.filter(s => s.is_reported).length})
        </button>
        <button
          onClick={() => setActiveFilter("anonymous")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === "anonymous"
              ? "bg-[#3B281C] text-[#FFFBF7]"
              : "bg-[#F5EFE6] text-[#705D52] hover:bg-[#EFE6DC]"
          }`}
        >
          Anonymous Stories ({stories.filter(s => s.is_anonymous || s.author_name === "Anonymous").length})
        </button>
        <button
          onClick={() => setActiveFilter("today")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === "today"
              ? "bg-[#3B281C] text-[#FFFBF7]"
              : "bg-[#F5EFE6] text-[#705D52] hover:bg-[#EFE6DC]"
          }`}
        >
          Published Today ({stories.filter(s => s.created_at && s.created_at.startsWith(todayStr)).length})
        </button>
      </div>

      {/* Story Table */}
      <div className="cozy-card p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EFE6DC] text-[#8C7667] font-semibold">
                <th className="py-2.5 px-3">Story Title</th>
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Published Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Reports</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE6DC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#8C7667] italic">
                    Loading community stories...
                  </td>
                </tr>
              ) : filteredStories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#8C7667] italic">
                    No stories match the selected filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredStories.map((story) => {
                  const isAnon = story.is_anonymous || story.author_name === "Anonymous";
                  const userId = story.user || story.user_email || story.author_name;
                  const isSuspended = userStatusMap[userId] === "suspended";

                  return (
                    <tr key={story.id} className="hover:bg-[#FAF6F0] transition group">
                      {/* Title */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-semibold text-[#3B281C] truncate group-hover:text-[#E07A5F] transition">
                          {story.title}
                        </div>
                        <div className="text-[10px] text-[#A08C7D] line-clamp-1">{story.content}</div>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#3B281C] flex items-center gap-1.5">
                          {isAnon ? (
                            <span className="text-[#8C7667] italic bg-[#F5EFE6] px-2 py-0.5 rounded-md text-[11px]">
                              Anonymous
                            </span>
                          ) : (
                            <>
                              <span>{story.author_name || "Community Member"}</span>
                              {isSuspended && (
                                <span className="text-[10px] font-bold text-[#C85A32] bg-[#FBEBE6] px-1.5 py-0.2 rounded">
                                  Suspended
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#5C7052] bg-[#EAEFE6] px-2.5 py-0.5 rounded-full font-medium">
                          <Tag className="w-2.5 h-2.5" />
                          {story.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-[#705D52]">{formatDate(story.created_at)}</td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {story.is_reported ? (
                          <CozyBadge variant="autumn">
                            <Flag className="w-3 h-3 text-[#C85A32]" />
                            🚩 Reported
                          </CozyBadge>
                        ) : (
                          <CozyBadge variant="sage">
                            <CheckCircle className="w-3 h-3 text-[#5C7052]" />
                            Published
                          </CozyBadge>
                        )}
                      </td>

                      {/* Reports */}
                      <td className="py-3 px-3">
                        {story.is_reported ? (
                          <div className="text-xs font-semibold text-[#C85A32] bg-[#FBEBE6] px-2 py-1 rounded-md max-w-[140px] truncate">
                            {story.report_reason || "Flagged Content"}
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#A08C7D] italic">Clean</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Story Modal trigger */}
                          <button
                            onClick={() => setSelectedStory(story)}
                            title="View Full Story"
                            className="p-1.5 rounded-lg text-[#705D52] hover:bg-[#EFE6DC] transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Dismiss Report */}
                          {story.is_reported && (
                            <button
                              onClick={(e) => handleDismissReport(story.id, e)}
                              title="Dismiss Report"
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-[#EAEFE6] text-[#4F5D3D] hover:bg-[#D2DEC8] transition flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" /> Dismiss
                            </button>
                          )}

                          {/* Suspend / Reactivate User (if not anonymous) */}
                          {!isAnon && story.user && (
                            <button
                              onClick={(e) => handleToggleUserSuspend(story, e)}
                              title={isSuspended ? "Reactivate Author" : "Suspend Author"}
                              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                                isSuspended
                                  ? "bg-[#EAEFE6] text-[#4F5D3D] hover:bg-[#D2DEC8]"
                                  : "bg-[#FBEBE6] text-[#C85A32] hover:bg-[#F4CFC5]"
                              }`}
                            >
                              {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {/* Remove Story */}
                          <button
                            onClick={() => setStoryToDelete(story)}
                            title="Remove Story"
                            className="p-1.5 rounded-lg text-[#C85A32] hover:bg-[#FBEBE6] transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW STORY MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="cozy-card max-w-xl w-full max-h-[85vh] flex flex-col p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#EFE6DC] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#5C7052] bg-[#EAEFE6] px-2.5 py-0.5 rounded-full font-medium">
                    <Tag className="w-3 h-3" />
                    {selectedStory.category}
                  </span>
                  {selectedStory.is_reported && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#C85A32] bg-[#FBEBE6] px-2.5 py-0.5 rounded-full font-bold">
                      🚩 Reported ({selectedStory.report_reason || "Flagged"})
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-xl font-bold text-[#3B281C] mt-2">{selectedStory.title}</h2>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-1.5 rounded-lg text-[#8C7667] hover:bg-[#EFE6DC] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Author Meta */}
            <div className="flex items-center justify-between text-xs text-[#705D52] bg-[#FAF6F0] p-3 rounded-xl border border-[#EFE6DC]">
              <div>
                <span className="font-semibold text-[#3B281C]">Author: </span>
                {selectedStory.is_anonymous || selectedStory.author_name === "Anonymous" ? (
                  <span className="italic text-[#8C7667]">Anonymous</span>
                ) : (
                  <span>{selectedStory.author_name}</span>
                )}
              </div>
              <div>
                <span className="font-semibold text-[#3B281C]">Published: </span>
                {formatDate(selectedStory.created_at)}
              </div>
            </div>

            {/* Report Reason banner if reported */}
            {selectedStory.is_reported && (
              <div className="bg-[#FBEBE6] border border-[#F4CFC5] rounded-xl p-3 text-xs space-y-1">
                <div className="font-bold text-[#C85A32] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Community Moderation Flag
                </div>
                <p className="text-[#3B281C]">
                  <strong>Reason:</strong> {selectedStory.report_reason || "Content flagged by user."}
                </p>
              </div>
            )}

            {/* Full Story Content */}
            <div className="flex-1 overflow-y-auto py-2 pr-1 text-sm text-[#3B281C] leading-relaxed whitespace-pre-line font-sans border-t border-b border-[#EFE6DC]">
              {selectedStory.content}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {selectedStory.is_reported && (
                  <button
                    onClick={() => handleDismissReport(selectedStory.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EAEFE6] text-[#4F5D3D] hover:bg-[#D2DEC8] transition flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Dismiss Report
                  </button>
                )}
                <button
                  onClick={() => {
                    setStoryToDelete(selectedStory);
                    setSelectedStory(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FBEBE6] text-[#C85A32] hover:bg-[#F4CFC5] transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Remove Story
                </button>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#EFE6DC] text-[#3B281C] hover:bg-[#E2D6C7] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR REMOVING STORY */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="cozy-card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#FBEBE6] text-[#C85A32] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#3B281C]">Remove Story from Public Visibility?</h3>
              <p className="text-xs text-[#705D52] mt-1">
                Are you sure you want to remove <strong>"{storyToDelete.title}"</strong>? This will permanently take down the story from Bloom Stories.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE6DC]">
              <button
                onClick={() => setStoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#EFE6DC] text-[#3B281C] hover:bg-[#E2D6C7] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteStory}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C85A32] text-white hover:bg-[#B8543B] transition flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" /> Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
