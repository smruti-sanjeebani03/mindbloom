const MOOD_EMOJI_MAP = {
  happy: "😊",
  calm: "😌",
  excited: "🤩",
  grateful: "🌸",
  neutral: "😐",
  tired: "😴",
  stressed: "😖",
  anxious: "😰",
  sad: "🌧️",
  angry: "😠"
};

const getMoodEmoji = (moodStr) => {
  if (!moodStr) return "🍁";
  const lower = String(moodStr).toLowerCase();
  for (const [key, emoji] of Object.entries(MOOD_EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "🍁";
};

export const MoodTrendChart = ({ moods = [] }) => {
  if (!moods || moods.length === 0) {
    return (
      <div className="w-full h-44 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-[#FAF6F0]/60 border border-dashed border-[#E6DCCD]">
        <span className="text-2xl mb-1 opacity-80">🍁</span>
        <p className="text-xs font-semibold text-[#5C3D2E]">No mood logs recorded yet</p>
        <p className="text-[10px] text-[#8C7667] mt-0.5 max-w-xs">
          Log your daily mood in the Mood Tracker to start mapping your emotional journey!
        </p>
      </div>
    );
  }

  // Take up to 7 most recent logs, reversed so oldest is left, newest is right
  const displayLogs = [...moods].slice(0, 7).reverse();

  return (
    <div className="w-full space-y-2 pt-1">
      {/* Chart container with Y-axis grid */}
      <div className="relative h-52 w-full flex items-end pt-6 pb-2 px-2 bg-[#FFFBF7] rounded-2xl border border-[#E6DCCD] shadow-2xs">
        {/* Y-axis grid background lines & labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-3 pb-12">
          {[10, 8, 6, 4, 2].map((num) => (
            <div key={num} className="flex items-center w-full gap-2 opacity-40">
              <span className="text-[9px] font-bold text-[#8C7667] w-4 text-right">{num}</span>
              <div className="h-[1px] w-full bg-[#E6DCCD] border-b border-dashed border-[#E6DCCD]" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex items-end justify-around w-full h-full pl-6 pr-2 pb-1">
          {displayLogs.map((m, idx) => {
            const rawScore = m.score !== undefined && m.score !== null ? Number(m.score) : null;
            const hasScore = rawScore !== null && !isNaN(rawScore);
            const scoreVal = hasScore ? Math.min(10, Math.max(1, rawScore)) : 5;
            const heightPercent = Math.max(8, (scoreVal / 10) * 100);
            const emoji = getMoodEmoji(m.mood);
            const moodName = m.mood ? (String(m.mood).charAt(0).toUpperCase() + String(m.mood).slice(1).toLowerCase()) : "Mood";

            // Format date label
            let dateLabel = "";
            const rawDate = m.created_at || m.date;
            if (rawDate) {
              try {
                const d = new Date(rawDate);
                dateLabel = !isNaN(d.getTime())
                  ? d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
                  : String(rawDate);
              } catch (e) {
                dateLabel = String(rawDate);
              }
            }

            return (
              <div key={m.id || idx} className="flex flex-col items-center h-full justify-end group flex-1 max-w-[48px] px-0.5">
                {/* Score badge top of bar */}
                <div className="mb-1 text-[10px] font-extrabold text-[#5C3D2E] bg-[#FAF6F0] border border-[#E6DCCD] px-1.5 py-0.2 rounded-md shadow-2xs group-hover:scale-110 transition-transform">
                  {hasScore ? `${scoreVal}/10` : "N/A"}
                </div>

                {/* The Bar */}
                <div className="w-full max-w-[18px] sm:max-w-[24px] bg-[#FAF6F0] rounded-t-lg relative flex items-end overflow-hidden border border-b-0 border-[#E6DCCD] h-full">
                  <div
                    className="w-full rounded-t-md transition-all duration-500 bg-gradient-to-t from-[#D4A373] to-[#E07A5F]"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Mood Emoji & Name */}
                <div className="mt-1 flex flex-col items-center text-center">
                  <span className="text-sm leading-none" title={`${moodName} (${hasScore ? scoreVal : "No Score"}/10)`}>
                    {emoji}
                  </span>
                  <span className="text-[9px] font-semibold text-[#5C3D2E] truncate max-w-[44px] mt-0.5">
                    {moodName}
                  </span>
                  {dateLabel && (
                    <span className="text-[8px] font-medium text-[#8C7667]">
                      {dateLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const WeeklyReflectionDonut = ({ journals = [], moods = [], reflections = [] }) => {
  const gratitudeCount = reflections.filter((r) => r.gratitude && r.gratitude.length > 0).length;
  const moodCount = moods.length;
  const journalCount = journals.length;
  const goalsCount = reflections.filter((r) => r.goals && r.goals.length > 0).length;

  const totalPossible = 28; // 7 days x 4 habits
  const totalCompleted = Math.min(totalPossible, gratitudeCount + moodCount + journalCount + goalsCount);
  const percentage = Math.min(100, Math.round((totalCompleted / totalPossible) * 100));

  // Stroke Dash Array = circumference = 2 * PI * 38 = ~238.76
  const strokeDashoffset = 238.76 - (238.76 * percentage) / 100;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      {/* Donut graphic */}
      <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#F5EFE6" strokeWidth="12" />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#8B5E3C"
            strokeWidth="12"
            strokeDasharray="238.76"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-serif text-2xl font-bold text-[#3B281C]">{percentage}%</span>
          <span className="text-[10px] text-[#8C7667] font-medium">Completed</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5C3D2E]" />
            <span className="text-[#4A3B32] font-medium">Gratitude</span>
          </div>
          <span className="text-[#705D52] font-semibold">{gratitudeCount}/7</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A373]" />
            <span className="text-[#4A3B32] font-medium">Mindfulness</span>
          </div>
          <span className="text-[#705D52] font-semibold">{moodCount}/7</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F]" />
            <span className="text-[#4A3B32] font-medium">Journal</span>
          </div>
          <span className="text-[#705D52] font-semibold">{journalCount}/7</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#889868]" />
            <span className="text-[#4A3B32] font-medium">Goals</span>
          </div>
          <span className="text-[#705D52] font-semibold">{goalsCount}/7</span>
        </div>
      </div>
    </div>
  );
};