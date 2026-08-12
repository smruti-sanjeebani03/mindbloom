import { useEffect, useMemo, useState } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import {
  Search,
  Plus,
  Star,
  Trash2,
  Calendar,
  Tag,
  Pencil,
  Check,
  X,
} from "lucide-react";
import {
  CozyBadge,
  CozyModal,
} from "../../components/common/UIComponents";
import { MapleLeafIcon } from "../../components/illustrations/CozyIllustrations";

export const JournalPage = () => {
  const { addToast } = useAuth();

  // ---------------------------------------------------------
  // Journal state
  // ---------------------------------------------------------

  const [journals, setJournals] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  const [isWriting, setIsWriting] = useState(false);
  const [activeJournal, setActiveJournal] = useState(null);

  // ---------------------------------------------------------
  // New journal state
  // ---------------------------------------------------------

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState("calm");
  const [newEmotion, setNewEmotion] = useState("Grounded");
  const [newTagsStr, setNewTagsStr] = useState(
    "Reflection, Gratitude"
  );

  // ---------------------------------------------------------
  // Edit state
  // ---------------------------------------------------------

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ---------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ---------------------------------------------------------
  // Normalize backend journal data
  // ---------------------------------------------------------

  const normalizeJournal = (journal) => {
    if (!journal) return null;

    const createdDate = journal.created_at
      ? new Date(journal.created_at)
      : new Date();

    return {
      ...journal,

      date: Number.isNaN(createdDate.getTime())
        ? "Recently"
        : createdDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),

      // These are UI fields from the original design.
      // Django currently stores title/content/timestamps.
      emotionTag: journal.emotionTag || "Grounded",

      tags: Array.isArray(journal.tags)
        ? journal.tags
        : [],

      isFavorite: Boolean(journal.isFavorite),
    };
  };

  // ---------------------------------------------------------
  // Load journals
  // ---------------------------------------------------------

  const loadJournals = async (preferredJournalId = null) => {
    try {
      setIsLoading(true);

      const response = await apiService.getJournals();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const normalized = data.map(normalizeJournal);

      setJournals(normalized);

      if (normalized.length === 0) {
        setActiveJournal(null);
        return;
      }

      setActiveJournal((current) => {
        // After creating/updating, keep that journal selected.
        if (preferredJournalId) {
          const preferred = normalized.find(
            (journal) => journal.id === preferredJournalId
          );

          if (preferred) {
            return preferred;
          }
        }

        // Keep currently selected journal if it still exists.
        if (current) {
          const existing = normalized.find(
            (journal) => journal.id === current.id
          );

          if (existing) {
            return existing;
          }
        }

        // Otherwise select newest entry.
        return normalized[0];
      });
    } catch (error) {
      console.error("Failed to load journals:", error);

      setJournals([]);
      setActiveJournal(null);

      addToast(
        "Couldn't load journal",
        "Unable to retrieve your journal entries right now.",
        "warning"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------

  useEffect(() => {
    loadJournals();
  }, []);

  // ---------------------------------------------------------
  // Search / filter
  // ---------------------------------------------------------

  const filteredJournals = useMemo(() => {
    return journals.filter((j) => {
      const title = j.title || "";
      const content = j.content || "";
      const tags = Array.isArray(j.tags) ? j.tags : [];

      const searchText = search.toLowerCase();

      const matchesSearch =
        title.toLowerCase().includes(searchText) ||
        content.toLowerCase().includes(searchText) ||
        tags.some((tag) =>
          tag.toLowerCase().includes(searchText)
        );

      const matchesTag = selectedTag
        ? tags.includes(selectedTag)
        : true;

      return matchesSearch && matchesTag;
    });
  }, [journals, search, selectedTag]);

  // ---------------------------------------------------------
  // CREATE JOURNAL
  // ---------------------------------------------------------

  const handleSaveJournal = async (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !newContent.trim()) {
      addToast(
        "Missing content",
        "Please provide a title and journal entry text",
        "warning"
      );
      return;
    }

    try {
      setIsSaving(true);

      const result = await apiService.addJournal(
        newTitle.trim(),
        newContent.trim()
      );

      if (!result?.success) {
        addToast(
          "Couldn't save journal",
          result?.message ||
            "The journal entry could not be saved.",
          "warning"
        );
        return;
      }

      const createdJournal = result.entry
        ? normalizeJournal(result.entry)
        : null;

      await loadJournals(createdJournal?.id || null);

      if (createdJournal) {
        setActiveJournal(createdJournal);
      }

      // Reset form
      setNewTitle("");
      setNewContent("");
      setNewMood("calm");
      setNewEmotion("Grounded");
      setNewTagsStr("Reflection, Gratitude");

      setIsWriting(false);

      addToast(
        "Journal Saved 📖",
        "Your thoughts have been safely archived",
        "success"
      );
    } catch (error) {
      console.error("Error saving journal:", error);

      addToast(
        "Couldn't save journal",
        "Something went wrong while saving your entry.",
        "warning"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------
  // START EDITING
  // ---------------------------------------------------------

  const handleStartEditing = () => {
    if (!activeJournal) return;

    setEditTitle(activeJournal.title || "");
    setEditContent(activeJournal.content || "");
    setIsEditing(true);
  };

  // ---------------------------------------------------------
  // CANCEL EDITING
  // ---------------------------------------------------------

  const handleCancelEditing = () => {
    setEditTitle("");
    setEditContent("");
    setIsEditing(false);
  };

  // ---------------------------------------------------------
  // UPDATE JOURNAL
  // ---------------------------------------------------------

  const handleUpdateJournal = async (e) => {
    e.preventDefault();

    if (!activeJournal) return;

    if (!editTitle.trim() || !editContent.trim()) {
      addToast(
        "Missing content",
        "Title and journal content cannot be empty.",
        "warning"
      );
      return;
    }

    try {
      setIsUpdating(true);

      const result =
        await apiService.updateJournalEntryBackend(
          activeJournal.id,
          editTitle.trim(),
          editContent.trim()
        );

      if (!result?.success) {
        addToast(
          "Couldn't update journal",
          result?.message ||
            "The journal entry could not be updated.",
          "warning"
        );
        return;
      }

      /*
       * Backend returns the updated journal in:
       *
       * result.entry
       */
      const updatedJournal = result.entry
        ? normalizeJournal({
            ...result.entry,

            // Preserve existing UI-only fields.
            emotionTag: activeJournal.emotionTag,
            tags: activeJournal.tags,
            isFavorite: activeJournal.isFavorite,
          })
        : null;

      /*
       * Reload from Django so the UI reflects the database.
       */
      await loadJournals(activeJournal.id);

      /*
       * Keep the edited entry selected.
       */
      if (updatedJournal) {
        setActiveJournal(updatedJournal);
      }

      setIsEditing(false);
      setEditTitle("");
      setEditContent("");

      addToast(
        "Journal Updated ✨",
        "Your changes have been saved.",
        "success"
      );
    } catch (error) {
      console.error("Error updating journal:", error);

      addToast(
        "Couldn't update journal",
        "Something went wrong while saving your changes.",
        "warning"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ---------------------------------------------------------
  // DELETE JOURNAL
  // ---------------------------------------------------------

  const handleDelete = async (id) => {
    try {
      const result =
        await apiService.deleteJournalEntryBackend(id);

      if (!result?.success) {
        addToast(
          "Couldn't delete",
          result?.message ||
            "Journal entry could not be deleted.",
          "warning"
        );
        return;
      }

      setIsEditing(false);

      await loadJournals();

      addToast(
        "Deleted",
        "Journal entry removed",
        "info"
      );
    } catch (error) {
      console.error("Error deleting journal:", error);

      addToast(
        "Couldn't delete",
        "Something went wrong while deleting the journal entry.",
        "warning"
      );
    }
  };

  // ---------------------------------------------------------
  // FAVORITE
  // ---------------------------------------------------------

  const handleFavoriteToggle = (id) => {
    setJournals((currentJournals) =>
      currentJournals.map((journal) =>
        journal.id === id
          ? {
              ...journal,
              isFavorite: !journal.isFavorite,
            }
          : journal
      )
    );

    setActiveJournal((current) => {
      if (!current || current.id !== id) {
        return current;
      }

      return {
        ...current,
        isFavorite: !current.isFavorite,
      };
    });
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="space-y-6 pb-12">

      {/* ------------------------------------------------ */}
      {/* Top Controls */}
      {/* ------------------------------------------------ */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3B281C] flex items-center gap-2">
            <span>My Journal</span>

            <MapleLeafIcon className="w-6 h-6 text-[#E07A5F]" />
          </h1>

          <p className="text-xs text-[#705D52] flex items-center gap-1.5 mt-0.5">
            <span>
              A quiet sanctuary for your thoughts and reflections.
            </span>

            <MapleLeafIcon className="w-3.5 h-3.5 text-[#D4A373]" />
          </p>
        </div>

        <button
          onClick={() => setIsWriting(true)}
          className="cozy-btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />

          <span>New Journal Entry</span>
        </button>

      </div>

      {/* ------------------------------------------------ */}
      {/* Main Grid */}
      {/* ------------------------------------------------ */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ------------------------------------------------ */}
        {/* Left Sidebar */}
        {/* ------------------------------------------------ */}

        <div className="lg:col-span-5 cozy-card p-4 space-y-3">

          {/* Search */}

          <div className="relative">

            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />

            <input
              type="text"
              placeholder="Search entries or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cozy-input w-full !pl-10 py-2 text-xs"
            />

          </div>

          {/* Journal List */}

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">

            {isLoading ? (
              <div className="text-center py-10 text-xs text-[#8C7667]">
                Opening your journal...
              </div>
            ) : filteredJournals.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#8C7667]">
                {journals.length === 0
                  ? "No journal entries yet. Start writing ✨"
                  : "No journal entries match your search."}
              </div>
            ) : (
              filteredJournals.map((j) => (

                <div
                  key={j.id}
                  onClick={() => {
                    setActiveJournal(j);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    activeJournal?.id === j.id
                      ? "bg-[#5C3D2E] text-[#FFFBF7] border-[#5C3D2E] shadow-sm"
                      : "bg-[#FFFBF7] border-[#E6DCCD] hover:bg-[#F5EFE6] text-[#3B281C]"
                  }`}
                >

                  <div className="flex items-center justify-between mb-1">

                    <span
                      className={`font-serif font-bold text-sm truncate ${
                        activeJournal?.id === j.id
                          ? "text-[#FFFBF7]"
                          : "text-[#3B281C]"
                      }`}
                    >
                      {j.title}
                    </span>

                    {j.isFavorite && (
                      <Star className="w-3.5 h-3.5 fill-current text-[#E6C594]" />
                    )}

                  </div>

                  <p
                    className={`line-clamp-2 text-[11px] mb-2 ${
                      activeJournal?.id === j.id
                        ? "text-[#D4C3B3]"
                        : "text-[#705D52]"
                    }`}
                  >
                    {j.content}
                  </p>

                  <div className="flex items-center justify-between text-[10px]">

                    <span>{j.date}</span>

                    <CozyBadge
                      variant={
                        activeJournal?.id === j.id
                          ? "brown"
                          : "latte"
                      }
                    >
                      {j.emotionTag}
                    </CozyBadge>

                  </div>

                </div>

              ))
            )}

          </div>

        </div>

        {/* ------------------------------------------------ */}
        {/* Right Active Entry */}
        {/* ------------------------------------------------ */}

        <div className="lg:col-span-7">

          {activeJournal ? (

            <div className="cozy-card p-6 space-y-4">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-[#EFE6DC] pb-3">

                <div className="min-w-0 flex-1">

                  {isEditing ? (

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                      className="cozy-input w-full text-xl font-serif font-bold text-[#3B281C]"
                      placeholder="Journal title"
                      disabled={isUpdating}
                    />

                  ) : (

                    <h2 className="font-serif text-2xl font-bold text-[#3B281C] truncate">
                      {activeJournal.title}
                    </h2>

                  )}

                  <div className="flex items-center gap-3 text-xs text-[#8C7667] mt-1">

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />

                      {activeJournal.date}
                    </span>

                    <span>•</span>

                    <CozyBadge variant="sage">
                      {activeJournal.emotionTag}
                    </CozyBadge>

                  </div>

                </div>

                {/* Action buttons */}

                <div className="flex items-center gap-2 ml-4 flex-shrink-0">

                  {isEditing ? (

                    <>
                      {/* Cancel Edit */}

                      <button
                        type="button"
                        onClick={handleCancelEditing}
                        disabled={isUpdating}
                        className="p-2 rounded-xl border border-[#E6DCCD] text-[#8C7667] hover:bg-[#F5EFE6] transition"
                        title="Cancel editing"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Save Edit */}

                      <button
                        type="button"
                        onClick={handleUpdateJournal}
                        disabled={isUpdating}
                        className="p-2 rounded-xl border border-[#D8BFA9] text-[#6B7F54] hover:bg-[#EEF4E8] transition"
                        title="Save changes"
                      >
                        {isUpdating ? (
                          <span className="text-xs">
                            ...
                          </span>
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    </>

                  ) : (

                    <>
                      {/* Edit */}

                      <button
                        type="button"
                        onClick={handleStartEditing}
                        className="p-2 rounded-xl border border-[#E6DCCD] text-[#8C7667] hover:text-[#E07A5F] hover:bg-[#FFF7F1] transition"
                        title="Edit journal"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Favorite */}

                      <button
                        type="button"
                        onClick={() =>
                          handleFavoriteToggle(
                            activeJournal.id
                          )
                        }
                        className="p-2 rounded-xl border border-[#E6DCCD] text-[#8C7667] hover:text-[#E07A5F] transition"
                        title="Favorite"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            activeJournal.isFavorite
                              ? "fill-current text-[#D4A373]"
                              : ""
                          }`}
                        />
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(activeJournal.id)
                        }
                        className="p-2 rounded-xl border border-[#E6DCCD] text-[#B8543B] hover:bg-[#FBEBE6] transition"
                        title="Delete journal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>

                  )}

                </div>

              </div>

              {/* ------------------------------------------------ */}
              {/* Journal Body */}
              {/* ------------------------------------------------ */}

              {isEditing ? (

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                  rows={12}
                  className="cozy-input w-full text-xs sm:text-sm leading-relaxed resize-none min-h-[250px]"
                  placeholder="Write your thoughts..."
                  disabled={isUpdating}
                />

              ) : (

                <div className="prose prose-stone max-w-none text-xs sm:text-sm text-[#4A3B32] leading-relaxed whitespace-pre-wrap font-sans min-h-[250px]">
                  {activeJournal.content}
                </div>

              )}

              {/* ------------------------------------------------ */}
              {/* Tags */}
              {/* ------------------------------------------------ */}

              <div className="pt-3 border-t border-[#EFE6DC] flex items-center gap-2 flex-wrap">

                <Tag className="w-3.5 h-3.5 text-[#8C7667]" />

                {(activeJournal.tags || []).length > 0 ? (

                  activeJournal.tags.map((t, i) => (

                    <CozyBadge
                      key={i}
                      variant="latte"
                    >
                      {t}
                    </CozyBadge>

                  ))

                ) : (

                  <span className="text-[10px] text-[#9A887A]">
                    No tags
                  </span>

                )}

              </div>

            </div>

          ) : (

            <div className="cozy-card p-12 text-center text-[#8C7667] text-xs">
              No journal entry selected.
            </div>

          )}

        </div>

      </div>

      {/* ------------------------------------------------ */}
      {/* New Journal Entry Modal */}
      {/* ------------------------------------------------ */}

      <CozyModal
        isOpen={isWriting}
        onClose={() => {
          if (!isSaving) {
            setIsWriting(false);
          }
        }}
        title="Write New Journal Entry 📖"
        subtitle="Capture your thoughts, feelings, and quiet observations."
      >

        <form
          onSubmit={handleSaveJournal}
          className="space-y-4 pt-2"
        >

          {/* Title */}

          <div>

            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Title
            </label>

            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) =>
                setNewTitle(e.target.value)
              }
              placeholder="e.g., Morning Coffee Reflections"
              className="cozy-input w-full text-xs"
              disabled={isSaving}
            />

          </div>

          {/* Emotion */}

          <div>

            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Emotion Tag
            </label>

            <select
              value={newEmotion}
              onChange={(e) =>
                setNewEmotion(e.target.value)
              }
              className="cozy-input w-full text-xs bg-white"
              disabled={isSaving}
            >

              <option value="Peaceful">
                Peaceful 🌿
              </option>

              <option value="Grounded">
                Grounded ☕
              </option>

              <option value="Grateful">
                Grateful 🙏
              </option>

              <option value="Anxious">
                Anxious 🍂
              </option>

              <option value="Inspired">
                Inspired ✨
              </option>

            </select>

          </div>

          {/* Content */}

          <div>

            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Content
            </label>

            <textarea
              rows={6}
              required
              value={newContent}
              onChange={(e) =>
                setNewContent(e.target.value)
              }
              placeholder="Write freely without judgment..."
              className="cozy-input w-full text-xs leading-relaxed"
              disabled={isSaving}
            />

          </div>

          {/* Tags */}

          <div>

            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">
              Tags (Comma separated)
            </label>

            <input
              type="text"
              value={newTagsStr}
              onChange={(e) =>
                setNewTagsStr(e.target.value)
              }
              className="cozy-input w-full text-xs"
              disabled={isSaving}
            />

          </div>

          {/* Buttons */}

          <div className="pt-2 flex justify-end gap-2">

            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="cozy-btn-secondary text-xs px-4 py-2"
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="cozy-btn-primary text-xs px-5 py-2"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save Entry"}
            </button>

          </div>

        </form>

      </CozyModal>

    </div>
  );
};

export default JournalPage;