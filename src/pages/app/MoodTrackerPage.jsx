import { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CozyBadge, CozyModal } from "../../components/common/UIComponents";
import { MoodTrendChart } from "../../components/common/CozyCharts";
import { MapleLeafIcon } from "../../components/illustrations/CozyIllustrations";

const MOOD_TYPES = [
  { type: "happy", emoji: "😊", label: "Happy" },
  { type: "calm", emoji: "😌", label: "Calm" },
  { type: "excited", emoji: "🤩", label: "Excited" },
  { type: "grateful", emoji: "🌸", label: "Grateful" },
  { type: "neutral", emoji: "😐", label: "Neutral" },
  { type: "tired", emoji: "😴", label: "Tired" },
  { type: "stressed", emoji: "😖", label: "Stressed" },
  { type: "anxious", emoji: "😰", label: "Anxious" },
  { type: "sad", emoji: "🌧️", label: "Sad" },
  { type: "angry", emoji: "😠", label: "Angry" }
];

const getMoodEmoji = (moodStr) => {
  if (!moodStr) return "🍁";
  const lower = String(moodStr).toLowerCase();
  const matched = MOOD_TYPES.find((m) => lower.includes(m.type));
  return matched ? matched.emoji : "🍁";
};


const getMoodVibeMessage = (mood, score) => {
  const moodKey = String(mood || "").toLowerCase();
  const numericScore = Number(score);

  const messages = {
    happy: {
      high: "Aww, that's lovely! 🌸 Keep that little spark glowing.",
      mid: "There's a little brightness in today. 🌸 Hold onto it.",
      low: "Even a little happiness counts. 🌱 Be gentle with yourself today.",
    },
    calm: {
      high: "A peaceful little moment. 🌿 Hold onto that calm.",
      mid: "A little calm is still a lovely thing. 🌿 Take it easy.",
      low: "Even a small moment of calm matters. 🌿 Be gentle with yourself.",
    },
    excited: {
      high: "Ooo, I can feel the excitement! ✨ Enjoy this moment.",
      mid: "There's some sparkle in today! ✨ Enjoy the little things.",
      low: "A little excitement is still worth noticing. ✨ Let it grow naturally.",
    },
    grateful: {
      high: "What a beautiful feeling to carry. 🌸 Keep that warmth with you.",
      mid: "A little gratitude can make an ordinary moment feel special. 🌸",
      low: "Even noticing one thing you're grateful for can be meaningful. 🌱",
    },
    neutral: {
      high: "Sounds like a pretty okay-ish day. ☕ And honestly, okay is okay too.",
      mid: "Sounds like an okay-ish day. ☕ No pressure to make it more than that.",
      low: "Looks like today feels a little flat. ☕ That's okay—you don't have to force a mood.",
    },
    tired: {
      high: "A little tired, perhaps. 🌙 Take things gently and give yourself some breathing room.",
      mid: "Looks like you've had a tiring one. 🌙 Be gentle with yourself today.",
      low: "You've really had a long one, huh? 🌙 Go easy on yourself.",
    },
    stressed: {
      high: "It sounds like today has been a little heavy. 🍂 Take things one moment at a time.",
      mid: "Looks like there's a lot on your plate today. 🍂 One thing at a time.",
      low: "Today seems especially heavy. 🍂 Give yourself permission to slow down.",
    },
    anxious: {
      high: "Seems like your mind has had a lot going on. 🌿 Take it gently.",
      mid: "Your mind sounds a little busy today. 🌿 Take things one moment at a time.",
      low: "It sounds like today feels really overwhelming. 🌿 Be extra gentle with yourself.",
    },
    sad: {
      high: "Today feels a little heavy, huh? 🌧️ You don't have to force yourself to be okay.",
      mid: "Today feels a little heavy, huh? 🌧️ Take it one moment at a time.",
      low: "That's a really heavy day. 🌧️ You don't have to pretend you're okay.",
    },
    angry: {
      high: "Looks like something really got under your skin today. 🍂 Give yourself some space to feel it.",
      mid: "Seems like something has been bothering you today. 🍂 Take a little space for yourself.",
      low: "That sounds like a really frustrating day. 🍂 Give yourself some room before tackling anything else.",
    },
  };

  const selected = messages[moodKey];

  if (!selected) {
    return "Thanks for checking in with yourself today. 🌸 Every check-in counts.";
  }

  if (!Number.isFinite(numericScore)) {
    return selected.mid;
  }

  if (numericScore >= 8) return selected.high;
  if (numericScore >= 4) return selected.mid;
  return selected.low;
};

export const MoodTrackerPage = () => {
  const { addToast } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form state
  const [isLogging, setIsLogging] = useState(false);
  const [editingMood, setEditingMood] = useState(null);
  const [selectedMood, setSelectedMood] = useState("happy");
  const [score, setScore] = useState(8);
  const [note, setNote] = useState("");

  const loadMoods = async () => {
    setLoading(true);
    const data = await apiService.getMoods();
    setMoods(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    loadMoods();
  }, []);

  const handleOpenCreate = (initialType = "happy") => {
    setEditingMood(null);
    setSelectedMood(initialType);
    setScore(8);
    setNote("");
    setIsLogging(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMood(m);
    const moodClean = m.mood ? String(m.mood).toLowerCase() : "happy";
    const foundType = MOOD_TYPES.find((t) => moodClean.includes(t.type))?.type || "happy";
    setSelectedMood(foundType);
    setScore(m.score !== undefined && m.score !== null ? Number(m.score) : 8);
    setNote(m.note || "");
    setIsLogging(true);
  };

  const handleCloseModal = () => {
    setIsLogging(false);
    setEditingMood(null);
    setSelectedMood("happy");
    setScore(8);
    setNote("");
  };

  const handleSaveMood = async (e) => {
    e.preventDefault();
    if (editingMood) {
      const res = await apiService.updateMoodBackend(editingMood.id, selectedMood, score, note);
      if (res.success || res.entry) {
        await loadMoods();
        handleCloseModal();
        addToast(
          `${getMoodEmoji(selectedMood)} Mood Updated`,
          getMoodVibeMessage(selectedMood, score),
          "success"
        );
      } else {
        addToast("Error", res.message || "Failed to update mood entry.", "error");
      }
    } else {
      const res = await apiService.addMood(selectedMood, score, [], note);
      if (res.success || res.entry) {
        await loadMoods();
        handleCloseModal();
        addToast(
          `${getMoodEmoji(selectedMood)} Mood Logged`,
          getMoodVibeMessage(selectedMood, score),
          "success"
        );
      } else {
        addToast("Error", res.message || "Failed to save mood entry.", "error");
      }
    }
  };

  const handleDeleteMood = async (id) => {
    const res = await apiService.deleteMoodBackend(id);
    if (res.success) {
      await loadMoods();
      addToast("Deleted", "Mood entry deleted.", "info");
    }
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return String(dateStr);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3B281C] flex items-center gap-2">
            <span>Mood Sanctuary</span>
            <CozyBadge variant="sand">Daily Check-In</CozyBadge>
          </h1>
          <p className="text-xs text-[#8C7667] mt-1">
            Track emotional patterns, reflect on your day, and view gentle trend charts over time.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate("happy")}
          className="cozy-btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Today's Mood</span>
        </button>
      </div>

      {/* Mood Selector Quick Strip */}
      <div className="cozy-card p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-[#3B281C] flex items-center gap-2">
          <MapleLeafIcon className="w-4.5 h-4.5 text-[#E07A5F]" />
          <span>How are you feeling right now?</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {MOOD_TYPES.map((m) => (
            <button
              key={m.type}
              onClick={() => handleOpenCreate(m.type)}
              className="p-3 rounded-2xl bg-[#FFFBF7] border border-[#E6DCCD] hover:bg-[#5C3D2E] hover:text-[#FFFBF7] hover:border-[#5C3D2E] text-center space-y-1 transition group cursor-pointer"
            >
              <div className="text-xl group-hover:scale-110 transition-transform">{m.emoji}</div>
              <div className="text-[11px] font-semibold truncate">{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chart + Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-7 cozy-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#3B281C]">Weekly Emotion Trajectory</h3>
          </div>
          <MoodTrendChart moods={moods} />
        </div>

        {/* Mood History Recent Logs */}
        <div className="lg:col-span-5 cozy-card p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#3B281C]">Recent Logs</h3>
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-10 text-xs text-[#8C7667]">Loading mood history...</div>
            ) : moods.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#8C7667] italic bg-[#FAF6F0]/50 rounded-xl border border-dashed border-[#E6DCCD] p-4">
                No mood check-ins recorded yet. Select how you're feeling above to add your first log!
              </div>
            ) : (
              moods.slice(0, 8).map((m) => {
                const emoji = getMoodEmoji(m.mood);
                const rawScore = m.score !== undefined && m.score !== null ? m.score : null;
                const scoreDisplay = rawScore !== null ? `(${rawScore}/10)` : "Score unavailable";
                const dateDisplay = formatDateLabel(m.created_at || m.date);

                return (
                  <div key={m.id} className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E6DCCD] flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{emoji}</span>
                      <div className="min-w-0">
                        <div className="font-bold capitalize text-[#3B281C] flex items-center gap-1.5">
                          <span>{m.mood}</span>
                          <span className="text-[#8B5E3C] font-normal text-[11px]">{scoreDisplay}</span>
                        </div>
                        {m.note && <p className="text-[10px] text-[#705D52] italic truncate max-w-[180px]">{m.note}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#8C7667] hidden sm:inline">{dateDisplay}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded-lg hover:bg-[#EFE6DC] text-[#8B5E3C] transition cursor-pointer"
                        title="Edit Mood"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMood(m.id)}
                        className="p-1.5 rounded-lg hover:bg-[#FDF2F0] text-[#E07A5F] transition cursor-pointer"
                        title="Delete Mood"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Single CozyModal for Create & Edit */}
      <CozyModal
        isOpen={isLogging}
        onClose={handleCloseModal}
        title={editingMood ? "Edit Mood" : "Log Your Mood 😊"}
        subtitle={editingMood ? "Update your logged emotional state and reflection." : "Take a micro-pause to check in with yourself."}
      >
        <form onSubmit={handleSaveMood} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-2">Select State</label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_TYPES.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setSelectedMood(m.type)}
                  className={`p-2 rounded-xl text-xs border text-center transition cursor-pointer ${
                    selectedMood === m.type
                      ? "bg-[#5C3D2E] text-[#FFFBF7] font-bold border-[#5C3D2E]"
                      : "bg-[#FFFBF7] border-[#E6DCCD] text-[#3B281C]"
                  }`}
                >
                  <span className="block text-base">{m.emoji}</span>
                  <span className="text-[10px] truncate block">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#5C3D2E] mb-1">
              <span>Overall Score</span>
              <span className="font-bold text-[#8B5E3C]">{score} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full accent-[#8B5E3C] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5C3D2E] mb-1">Personal Note</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What contributed to this mood today?"
              className="cozy-input w-full text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="cozy-btn-secondary text-xs px-4 py-2 cursor-pointer"
            >
              Cancel
            </button>
            <button type="submit" className="cozy-btn-primary text-xs px-5 py-2 cursor-pointer">
              {editingMood ? "Update Mood" : "Save Mood Entry"}
            </button>
          </div>
        </form>
      </CozyModal>
    </div>
  );
};