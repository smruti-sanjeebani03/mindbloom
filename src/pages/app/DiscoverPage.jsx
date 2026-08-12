import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  Radio,
  Film,
  ExternalLink,
} from "lucide-react";
import { CozyBadge } from "../../components/common/UIComponents";

/*
 * Discover resources
 * ------------------
 * Breathing, rain ambience, podcast content, and evening unwind
 * resources are hosted on YouTube.
 *
 * IMPORTANT:
 * There are NO local audio files, NO <audio> elements, and NO
 * YouTube iframes in this page. Each resource opens directly on
 * YouTube in a new tab.
 *
 * These YouTube resources were verified before being added:
 *
 * 4-7-8 Breathing:
 * https://www.youtube.com/watch?v=OBe5ImYDSJA
 *
 * Rainy Night Coffee Shop:
 * https://www.youtube.com/watch?v=c0_ejQQcrwI
 *
 * Evening Yoga:
 * https://www.youtube.com/watch?v=oKIIXQRK2cU
 *
 * Mindful Living / perfectionism & self-compassion:
 * https://music.youtube.com/playlist?list=PLwlk5d210GWvjtGmHoe5y-nsYjRm0Z-6F
 */

const DISCOVER_RESOURCES = {
  breathing:
    "https://www.youtube.com/watch?v=OBe5ImYDSJA",

  rain:
    "https://www.youtube.com/watch?v=c0_ejQQcrwI",

  slowProgress:
    "https://music.youtube.com/playlist?list=PLwlk5d210GWvjtGmHoe5y-nsYjRm0Z-6F",

  eveningUnwind:
    "https://www.youtube.com/watch?v=oKIIXQRK2cU",
};

export const DiscoverPage = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [timerCount, setTimerCount] = useState(4);

  /*
   * 4-7-8 breathing cycle:
   * Inhale 4s -> Hold 7s -> Exhale 8s -> repeat.
   */
  useEffect(() => {
    if (!isBreathing) return undefined;

    const interval = window.setInterval(() => {
      setTimerCount((previous) => {
        if (previous > 1) return previous - 1;

        if (breathPhase === "Inhale") {
          setBreathPhase("Hold");
          return 7;
        }

        if (breathPhase === "Hold") {
          setBreathPhase("Exhale");
          return 8;
        }

        setBreathPhase("Inhale");
        return 4;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isBreathing, breathPhase]);

  const toggleBreathing = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setBreathPhase("Inhale");
      setTimerCount(4);
      return;
    }

    setBreathPhase("Inhale");
    setTimerCount(4);
    setIsBreathing(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#3B281C]">
          Discover & Reset
        </h1>

        <p className="text-xs text-[#705D52]">
          Interactive exercises, calming sounds, and mindful guides.
        </p>
      </div>
      {/* -------------------------------------------------- */}
      {/* BREATHING TECHNIQUE RESOURCE */}
      {/* -------------------------------------------------- */}
      <section className="cozy-card p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#8B5E3C] flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>

            <div>
              <CozyBadge variant="autumn">
                Breathing Technique
              </CozyBadge>

              <h3 className="font-serif font-bold text-base text-[#3B281C] mt-1">
                4-7-8 Breathing Grounding
              </h3>

              <p className="text-xs text-[#705D52]">
                A gentle guided breathing practice to help you slow down and reset.
              </p>
            </div>
          </div>

          <a
            href={DISCOVER_RESOURCES.breathing}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 bg-[#EFE6DC] text-[#5C3D2E] hover:bg-[#E2D4C3]"
          >
            <Play className="w-4 h-4" />
            <span>Try Breathing</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* RAIN AMBIENCE */}

      {/* -------------------------------------------------- */}
      <section className="cozy-card p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#8B5E3C] flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#3B281C]">
                Cozy Rain & Cafe Atmosphere
              </h3>

              <p className="text-xs text-[#705D52]">
                Rain sounds, café ambience, and relaxing background music.
              </p>
            </div>
          </div>

          <a
            href={DISCOVER_RESOURCES.rain}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 bg-[#EFE6DC] text-[#5C3D2E] hover:bg-[#E2D4C3]"
          >
            <Play className="w-4 h-4" />
            <span>Play Rain Sounds</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* DISCOVER CARDS */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Podcast */}
        <a
          href={DISCOVER_RESOURCES.slowProgress}
          target="_blank"
          rel="noopener noreferrer"
          className="cozy-card p-6 space-y-3 block hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center justify-between">
            <CozyBadge variant="gold">
              YouTube Podcast
            </CozyBadge>

            <Radio className="w-4 h-4 text-[#D4A373]" />
          </div>

          <h3 className="font-serif font-bold text-lg text-[#3B281C]">
            Embracing Slow Progress
          </h3>

          <p className="text-xs text-[#705D52]">
            Mindful conversations around perfectionism,
            self-compassion, progress, and trusting your own timeline.
          </p>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#8B5E3C]">
            Explore on YouTube
            <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        {/* Evening unwind */}
        <a
          href={DISCOVER_RESOURCES.eveningUnwind}
          target="_blank"
          rel="noopener noreferrer"
          className="cozy-card p-6 space-y-3 block hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center justify-between">
            <CozyBadge variant="sage">
              YouTube Video Guide
            </CozyBadge>

            <Film className="w-4 h-4 text-[#889868]" />
          </div>

          <h3 className="font-serif font-bold text-lg text-[#3B281C]">
            10-Minute Evening Unwind
          </h3>

          <p className="text-xs text-[#705D52]">
            A gentle 10-minute evening yoga routine for stretching,
            breathing, and winding down after a long day.
          </p>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#8B5E3C]">
            Watch on YouTube
            <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      </div>
    </div>
  );
};