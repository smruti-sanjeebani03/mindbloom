import { useState, useEffect, useMemo } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { filterMockStories } from "../public/StoriesPage";
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
    const mockStories = filterMockStories();
    const res = await apiService.fetchAdminStoriesBackend();
    const databaseStories = res && res.success ? (res.data || []) : (Array.isArray(res) ? res : []);
    
    const combinedStories = [
      ...mockStories,
      ...databaseStories,
    ];

    setStories(combinedStories);
    setSummary({
      total_stories: combinedStories.length,
      anonymous_stories: combinedStories.filter(s => s.is_anonymous || s.author_name === "Anonymous Sprout" || s.author_name === "Quiet Observer").length,
      reported_stories: combinedStories.filter(s => s.is_reported).length,
      published_today: res && res.summary ? res.summary.published_today : 0
    });
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

  const handleToggleSuspendUser = async (userId, currentStatus, e) => {
    if (e) e.stopPropagation();
    if (!userId) {
      addToast("Cannot Suspend", "Anonymous users cannot be suspended.", "warning");
      return;
    }

    const isSuspended = userStatusMap[userId] !== undefined ? userStatusMap[userId] : currentStatus;
    if (isSuspended) {
      const res = await apiService.reactivateUserBackend(userId);
      if (res.success) {
        setUserStatusMap(prev => ({ ...prev, [userId]: false }));
        addToast("User Reactivated 🌿", "Account access restored successfully.", "success");
      }
    } else {
      const res = await apiService.suspendUserBackend(userId);
      if (res.success) {
        setUserStatusMap(prev => ({ ...prev, [userId]: true }));
        addToast("User Suspended ⚠️", "Account access restricted for platform violations.", "warning");
      }
    }
  };

  // Filter & Search Logic
  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      const matchesSearch = !search || 
        story.title?.toLowerCase().includes(search.toLowerCase()) ||
        story.content?.toLowerCase().includes(search.toLowerCase()) ||
        story.author_name?.toLowerCase().includes(search.toLowerCase()) ||
        story.category?.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "reported") return story.is_reported;
      if (activeFilter === "anonymous") return story.is_anonymous || story.author_name === "Anonymous Sprout" || story.author_name === "Quiet Observer";
      if (activeFilter === "today") {
        if (!story.created_at) return false;
        const storyDate = new Date(story.created_at).toDateString();
        const todayDate = new Date().toDateString();
        return storyDate === todayDate;
      }
      return true;
    });
  }, [stories, search, activeFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            Bloom Stories Moderation
          </h1>
          <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] mt-1">
            Review community story submissions, resolve flags, and enforce empathetic community guidelines.
          </p>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cozy-card p-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] space-y-1">
          <div className="flex items-center justify-between text-[#8C7667]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Stories</span>
            <BookOpen className="w-4 h-4 text-[#D4A373]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {summary.total_stories}
          </div>
          <span className="text-[10px] text-[#8C7667]">Published community posts</span>
        </div>

        <div className="cozy-card p-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] space-y-1">
          <div className="flex items-center justify-between text-[#8C7667]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Anonymous</span>
            <ShieldAlert className="w-4 h-4 text-[#889868]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {summary.anonymous_stories}
          </div>
          <span className="text-[10px] text-[#889868]">Privacy protected</span>
        </div>

        <div className="cozy-card p-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] space-y-1">
          <div className="flex items-center justify-between text-[#8C7667]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Reported Flags</span>
            <AlertTriangle className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {summary.reported_stories}
          </div>
          <span className="text-[10px] text-[#E07A5F] font-semibold">Requires review</span>
        </div>

        <div className="cozy-card p-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] space-y-1">
          <div className="flex items-center justify-between text-[#8C7667]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Published Today</span>
            <Calendar className="w-4 h-4 text-[#D4A373]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            {summary.published_today}
          </div>
          <span className="text-[10px] text-[#8C7667]">New daily entries</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="cozy-card p-4 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C7667] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, content, author..."
              className="cozy-input pl-9 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeFilter === "all"
                  ? "bg-[#E07A5F] text-[#FFFBF7]"
                  : "bg-[#FAF6F0] text-[#705D52] hover:bg-[#EFE6DC]"
              }`}
            >
              All Stories ({stories.length})
            </button>

            <button
              onClick={() => setActiveFilter("reported")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                activeFilter === "reported"
                  ? "bg-[#E07A5F] text-[#FFFBF7]"
                  : "bg-[#FAF6F0] text-[#705D52] hover:bg-[#EFE6DC]"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reported ({stories.filter(s => s.is_reported).length})</span>
            </button>

            <button
              onClick={() => setActiveFilter("anonymous")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeFilter === "anonymous"
                  ? "bg-[#E07A5F] text-[#FFFBF7]"
                  : "bg-[#FAF6F0] text-[#705D52] hover:bg-[#EFE6DC]"
              }`}
            >
              Anonymous ({stories.filter(s => s.is_anonymous || s.author_name === "Anonymous Sprout" || s.author_name === "Quiet Observer").length})
            </button>
          </div>
        </div>
      </div>

      {/* Stories Table / List View */}
      <div className="cozy-card p-6 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#8C7667]">Loading stories from backend...</div>
        ) : filteredStories.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-[#D4A373] mx-auto opacity-50" />
            <p className="font-serif font-bold text-[#3B281C] dark:text-[#FFFBF7]">No Stories Found</p>
            <p className="text-xs text-[#8C7667]">No community stories match the selected criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStories.map((story) => {
              const isUserSuspended = story.user_id && userStatusMap[story.user_id];
              return (
                <div
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className={`p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2F2620] border transition cursor-pointer space-y-2 ${
                    story.is_reported
                      ? "border-l-4 border-l-[#E07A5F] border-[#F4CFC5]"
                      : "border-[#E6DCCD] dark:border-[#3D3128] hover:border-[#D4A373]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E6DCCD] dark:border-[#3D3128] pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif font-bold text-sm text-[#3B281C] dark:text-[#FFFBF7]">
                        {story.title}
                      </h4>
                      {story.category && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAEFE6] text-[#4F5D3D]">
                          {story.category}
                        </span>
                      )}
                      {story.is_reported && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FBEBE6] text-[#B8543B] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Reported</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#8C7667]">
                      <span>By {story.is_anonymous || !story.author_name ? "Anonymous" : story.author_name}</span>
                      <span>•</span>
                      <span>{story.created_at ? new Date(story.created_at).toLocaleDateString() : "Recent"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C3D2E] dark:text-[#D4C3B3] line-clamp-2 leading-relaxed">
                    {story.content}
                  </p>

                  {story.is_reported && story.report_reason && (
                    <div className="p-2.5 rounded-xl bg-[#FBEBE6] border border-[#F4CFC5] text-xs text-[#B8543B] space-y-0.5">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <Flag className="w-3 h-3" />
                        Report Reason:
                      </span>
                      <p className="text-[11px]">{story.report_reason}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-[#E07A5F] font-semibold hover:underline flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </span>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      {story.is_reported && (
                        <button
                          onClick={(e) => handleDismissReport(story.id, e)}
                          className="cozy-btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                          title="Dismiss report and keep story live"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#889868]" />
                          <span>Dismiss Flag</span>
                        </button>
                      )}

                      {story.user_id && !story.is_anonymous && (
                        <button
                          onClick={(e) => handleToggleSuspendUser(story.user_id, story.is_author_suspended, e)}
                          className={`text-xs py-1 px-2.5 rounded-xl border font-semibold flex items-center gap-1 transition ${
                            isUserSuspended
                              ? "bg-[#EAEFE6] text-[#4F5D3D] border-[#D2DEC8]"
                              : "bg-[#FBEBE6] text-[#B8543B] border-[#F4CFC5]"
                          }`}
                        >
                          {isUserSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          <span>{isUserSuspended ? "Reactivate User" : "Suspend User"}</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStoryToDelete(story);
                        }}
                        className="p-1.5 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition"
                        title="Delete story permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E6DCCD] dark:border-[#3D3128] pb-3">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAEFE6] text-[#4F5D3D]">
                  {selectedStory.category || "General"}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#3B281C] dark:text-[#FFFBF7]">
                  {selectedStory.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-[#8C7667] hover:text-[#3B281C] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#8C7667]">
                <span>Author: {selectedStory.is_anonymous || !selectedStory.author_name ? "Anonymous" : selectedStory.author_name}</span>
                <span>Date: {selectedStory.created_at ? new Date(selectedStory.created_at).toLocaleDateString() : "Recent"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] text-[#3B281C] dark:text-[#FFFBF7] whitespace-pre-wrap leading-relaxed">
                {selectedStory.content}
              </div>

              {selectedStory.is_reported && (
                <div className="p-3 rounded-2xl bg-[#FBEBE6] border border-[#F4CFC5] text-[#B8543B] space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Flagged for Review
                  </span>
                  <p className="text-[11px]">Reason: {selectedStory.report_reason || "Community report"}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E6DCCD] dark:border-[#3D3128]">
              {selectedStory.is_reported ? (
                <button
                  onClick={() => handleDismissReport(selectedStory.id)}
                  className="cozy-btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#889868]" />
                  <span>Dismiss Report</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setStoryToDelete(selectedStory);
                    setSelectedStory(null);
                  }}
                  className="p-2 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition"
                  title="Delete story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="cozy-btn-primary text-xs px-4 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {storyToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#E07A5F]">
              <div className="p-3 rounded-2xl bg-[#FBEBE6]">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3B281C] dark:text-[#FFFBF7]">
                  Remove Story?
                </h3>
                <p className="text-xs text-[#8C7667]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#705D52] dark:text-[#D4C3B3] leading-relaxed">
              Are you sure you want to remove <strong>"{storyToDelete.title}"</strong>? This will permanently take down the story from Bloom Stories.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6DCCD] dark:border-[#3D3128]">
              <button
                onClick={() => setStoryToDelete(null)}
                className="cozy-btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteStory}
                className="bg-[#E07A5F] hover:bg-[#D0694E] text-[#FFFBF7] text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};