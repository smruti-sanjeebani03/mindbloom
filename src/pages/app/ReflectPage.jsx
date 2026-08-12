import { useState, useEffect, useCallback } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { Heart, Check, Calendar, MessageSquareHeart, Sparkles } from "lucide-react";
import { CozyBadge } from "../../components/common/UIComponents";
import { MapleLeafIcon, MapleLeafDivider } from "../../components/illustrations/CozyIllustrations";

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const ReflectPage = () => {
  const { addToast } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [gratitude1, setGratitude1] = useState("");
  const [gratitude2, setGratitude2] = useState("");
  const [gratitude3, setGratitude3] = useState("");
  const [selfTalk, setSelfTalk] = useState("");

  const [existingGratitudes, setExistingGratitudes] = useState([]);
  const [existingSelfTalk, setExistingSelfTalk] = useState(null);
  const [loading, setLoading] = useState(false);

  const formattedDateString = (() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    if (!y || !m || !d) return "";
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  })();

  const loadReflectionsForDate = useCallback(async (dateStr) => {
    if (!dateStr) return;
    setLoading(true);
    try {
      const [gratitudeEntries, selfTalkEntries] = await Promise.all([
        apiService.fetchGratitudeBackend(dateStr),
        apiService.fetchSelfTalkBackend(dateStr)
      ]);

      setExistingGratitudes(gratitudeEntries || []);
      if (gratitudeEntries && gratitudeEntries.length > 0) {
        setGratitude1(gratitudeEntries[0]?.gratitude || "");
        setGratitude2(gratitudeEntries[1]?.gratitude || "");
        setGratitude3(gratitudeEntries[2]?.gratitude || "");
      } else {
        setGratitude1("");
        setGratitude2("");
        setGratitude3("");
      }

      if (selfTalkEntries && selfTalkEntries.length > 0) {
        setExistingSelfTalk(selfTalkEntries[0]);
        setSelfTalk(selfTalkEntries[0]?.self_talk || "");
      } else {
        setExistingSelfTalk(null);
        setSelfTalk("");
      }
    } catch (err) {
      console.error("Failed to load reflections for date", dateStr, err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReflectionsForDate(selectedDate);
  }, [selectedDate, loadReflectionsForDate]);

  const handleSaveReflection = async (e) => {
    e.preventDefault();
    const gInputs = [gratitude1, gratitude2, gratitude3];

    try {
      for (let i = 0; i < 3; i++) {
        const val = (gInputs[i] || "").trim();
        const existingRecord = existingGratitudes[i];

        if (val) {
          if (existingRecord && existingRecord.id) {
            await apiService.updateGratitudeBackend(existingRecord.id, {
              gratitude: val,
              reflection_date: selectedDate
            });
          } else {
            await apiService.saveGratitudeBackend({
              gratitude: val,
              reflection_date: selectedDate
            });
          }
        }
      }

      const stVal = selfTalk.trim();
      if (stVal) {
        if (existingSelfTalk && existingSelfTalk.id) {
          await apiService.updateSelfTalkBackend(existingSelfTalk.id, {
            self_talk: stVal,
            reflection_date: selectedDate
          });
        } else {
          await apiService.saveSelfTalkBackend({
            self_talk: stVal,
            reflection_date: selectedDate
          });
        }
      }

      addToast("Reflection Saved 🌿", "Your daily gratitude and self-talk practice are saved", "success");
      await loadReflectionsForDate(selectedDate);
    } catch (err) {
      console.error("Error saving reflection:", err);
      addToast("Error Saving", "Failed to save reflection", "error");
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <CozyBadge variant="autumn">Daily Ritual</CozyBadge>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B281C] flex items-center justify-center gap-2">
          <span>Reflect & Bloom</span>
          <MapleLeafIcon className="w-7 h-7 text-[#E07A5F]" />
        </h1>
        
        <p className="text-xs sm:text-sm text-[#705D52] flex items-center justify-center gap-1.5 max-w-xl mx-auto">
          <span>Pause, center yourself, cultivate daily gratitude, and speak to yourself with warmth and kindness.</span>
          <MapleLeafIcon className="w-3.5 h-3.5 text-[#D4A373]" />
        </p>

        {/* Date Selector Badge */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5E3C] bg-[#FFF8F1] px-4 py-2 rounded-full border border-[#EAD8C7] shadow-2xs">
            <Calendar className="w-4 h-4 text-[#D88A5C]" />
            <span>{formattedDateString}</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs border border-[#EAD8C7] rounded-lg px-3 py-1.5 bg-[#FFFBF7] text-[#5C3A2E] cursor-pointer"
          />
        </div>
      </div>

      <MapleLeafDivider className="my-2" />

      <form onSubmit={handleSaveReflection} className="space-y-6">
        {/* Gratitude Section */}
        <div className="cozy-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E07A5F]" />
            <h3 className="font-serif font-bold text-lg text-[#3B281C]">3 Things I Am Grateful For Today</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#8B5E3C] text-sm">1.</span>
              <input
                type="text"
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                placeholder="e.g., Warm hazelnut latte on a chilly morning"
                className="cozy-input w-full text-xs"
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#8B5E3C] text-sm">2.</span>
              <input
                type="text"
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                placeholder="e.g., A helpful conversation with BloomBot"
                className="cozy-input w-full text-xs"
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#8B5E3C] text-sm">3.</span>
              <input
                type="text"
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                placeholder="e.g., Completing my tasks with peace of mind"
                className="cozy-input w-full text-xs"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Self-Talk Section */}
        <div className="cozy-card-warm p-6 space-y-4 border border-[#E6DCCD] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#D88A5C]">
              <MessageSquareHeart className="w-5 h-5 text-[#E07A5F]" />
              <h3 className="font-serif font-bold text-lg text-[#3B281C]">Compassionate Self-Talk</h3>
            </div>
            <CozyBadge variant="autumn" className="text-[11px] px-2.5 py-1">Personal Practice</CozyBadge>
          </div>

          <p className="text-xs text-[#705D52] leading-relaxed">
            What gentle, encouraging words do you need to speak to yourself today? Replace inner criticism with patience, understanding, and self-compassion.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#5C3A2E] block">
              My Self-Talk Statement:
            </label>
            <textarea
              rows={3}
              value={selfTalk}
              onChange={(e) => setSelfTalk(e.target.value)}
              placeholder="e.g., 'I am doing the best I can, and that is worthy of respect. I give myself permission to breathe, go slowly, and trust my process.'"
              className="cozy-input w-full font-serif text-sm leading-relaxed p-3.5 bg-white/90 text-[#3B281C] resize-none"
              disabled={loading}
            />
          </div>

          {/* Quick self-talk prompts */}
          <div className="pt-2 border-t border-[#EAD8C7]/60">
            <span className="text-[11px] font-semibold text-[#8B5E3C] block mb-2">Need inspiration for your self-talk? Try a prompt:</span>
            <div className="flex flex-wrap gap-2">
              {[
                "I am worthy of peace even when things aren't perfect.",
                "I release the pressure to do it all right now.",
                "I speak to myself with the same kindness I offer a dear friend.",
                "Mistakes are just gentle lessons along my path."
              ].map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelfTalk(promptText)}
                  className="text-[11px] bg-white text-[#5C3A2E] hover:bg-[#FFF8F1] hover:text-[#D88A5C] border border-[#EAD8C7] px-3 py-1 rounded-full transition text-left"
                >
                  <Sparkles className="w-3 h-3 inline mr-1 text-[#D88A5C]" />
                  {promptText}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="cozy-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
          disabled={loading}
        >
          <Check className="w-4 h-4" />
          <span>Save Reflection for {selectedDate}</span>
        </button>
      </form>
    </div>
  );
};