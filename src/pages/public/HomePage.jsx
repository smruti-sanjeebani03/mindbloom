import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Heart,
  Bot,
  BookOpen,
  Smile,
  ShieldCheck,
  Sprout
} from "lucide-react";
import {
  CozyHeroIllustration,
  MapleLeafIcon,
  MapleLeafCluster,
  MapleTreeBranchCornerRight
} from "../../components/illustrations/CozyIllustrations";
import { CozyBadge } from "../../components/common/UIComponents";
import { useAuth } from "../../contexts/AuthContext";
const FALLING_LEAVES_DATA = [
  { id: 1, left: "2%", size: 32, fill: "#E07A5F", animClass: "animate-maple-fall-1", delay: "0s", duration: "10s" },
  { id: 2, left: "7%", size: 26, fill: "#E29578", animClass: "animate-maple-fall-2", delay: "2.5s", duration: "13s" },
  { id: 3, left: "13%", size: 38, fill: "#D4A373", animClass: "animate-maple-fall-3", delay: "1s", duration: "11s" },
  { id: 4, left: "19%", size: 28, fill: "#C46E52", animClass: "animate-maple-fall-4", delay: "4s", duration: "15s" },
  { id: 5, left: "25%", size: 40, fill: "#E07A5F", animClass: "animate-maple-fall-1", delay: "1.5s", duration: "9s" },
  { id: 6, left: "31%", size: 30, fill: "#8B5E3C", animClass: "animate-maple-fall-2", delay: "5.5s", duration: "14s" },
  { id: 7, left: "38%", size: 36, fill: "#E29578", animClass: "animate-maple-fall-3", delay: "3s", duration: "12s" },
  { id: 8, left: "44%", size: 26, fill: "#D4A373", animClass: "animate-maple-fall-4", delay: "7s", duration: "16s" },
  { id: 9, left: "50%", size: 38, fill: "#E07A5F", animClass: "animate-maple-fall-1", delay: "0.5s", duration: "10s" },
  { id: 10, left: "56%", size: 30, fill: "#C46E52", animClass: "animate-maple-fall-2", delay: "4.5s", duration: "13s" },
  { id: 11, left: "62%", size: 42, fill: "#E29578", animClass: "animate-maple-fall-3", delay: "2s", duration: "11s" },
  { id: 12, left: "68%", size: 28, fill: "#E07A5F", animClass: "animate-maple-fall-4", delay: "6s", duration: "14s" },
  { id: 13, left: "74%", size: 36, fill: "#8B5E3C", animClass: "animate-maple-fall-1", delay: "1s", duration: "12s" },
  { id: 14, left: "80%", size: 26, fill: "#D4A373", animClass: "animate-maple-fall-2", delay: "3.5s", duration: "15s" },
  { id: 15, left: "86%", size: 38, fill: "#E29578", animClass: "animate-maple-fall-3", delay: "7.5s", duration: "10s" },
  { id: 16, left: "91%", size: 30, fill: "#E07A5F", animClass: "animate-maple-fall-4", delay: "2.5s", duration: "13s" },
  { id: 17, left: "96%", size: 34, fill: "#C46E52", animClass: "animate-maple-fall-1", delay: "5s", duration: "11s" }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = Boolean(user && user.isLoggedIn !== false && (user.email || user.name));

  const { scrollY } = useScroll();
  const leavesOpacity = useTransform(scrollY, [0, 1500], [1, 0.6]);

  return (
    <div className="space-y-24 pb-16 overflow-hidden relative maple-leaf-pattern">
      {/* ELEGANT CORNER MAPLE BRANCH */}
      <div className="absolute top-0 right-0 pointer-events-none z-10 opacity-100">
        <MapleTreeBranchCornerRight className="w-56 sm:w-72 md:w-96 lg:w-[440px]" />
      </div>

      {/* SOFT GOLDEN SUNLIGHT RAYS */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none -z-10 overflow-hidden">
        <svg viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-65">
          <defs>
            <linearGradient id="sunRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE8D6" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#FDE8D7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFF8F1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="0,0 360,600 220,600" fill="url(#sunRayGrad)" />
          <polygon points="0,0 600,600 440,600" fill="url(#sunRayGrad)" opacity="0.8" />
          <polygon points="0,0 820,550 680,600" fill="url(#sunRayGrad)" opacity="0.5" />
          <polygon points="0,0 220,600 120,600" fill="url(#sunRayGrad)" opacity="0.85" />
        </svg>
      </div>

      {/* SCATTERED VIBRANT STATIC LEAVES IN BACKGROUND */}
      <div className="absolute top-36 left-[6%] opacity-85 dark:opacity-95 pointer-events-none -rotate-12 filter drop-shadow-sm">
        <MapleLeafIcon className="w-14 h-14 text-[#E07A5F]" />
      </div>
      <div className="absolute top-28 left-[45%] opacity-80 dark:opacity-90 pointer-events-none rotate-45 filter drop-shadow-sm">
        <MapleLeafIcon className="w-12 h-12 text-[#D88A5C]" />
      </div>
      <div className="absolute top-[520px] right-[10%] opacity-85 dark:opacity-95 pointer-events-none rotate-12 filter drop-shadow-sm">
        <MapleLeafIcon className="w-16 h-16 text-[#E29578]" />
      </div>
      <div className="absolute top-[850px] left-[3%] opacity-85 dark:opacity-95 pointer-events-none -rotate-45 filter drop-shadow-sm">
        <MapleLeafCluster className="w-24 h-24" />
      </div>
      <div className="absolute top-[1300px] right-[5%] opacity-85 dark:opacity-95 pointer-events-none rotate-30 filter drop-shadow-sm">
        <MapleLeafIcon className="w-14 h-14 text-[#E07A5F]" />
      </div>

      {
    /* HERO SECTION matching reference image */
  }
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {
    /* Warm Sunlight Glow Effect behind content */
  }
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FDE8D7] via-[#F7D8C4]/40 to-transparent dark:from-[#3B291D]/30 dark:via-[#2D1F16]/20 -z-10 blur-3xl pointer-events-none" />

        {
    /* FLOATING FALLING MAPLE LEAVES ANIMATION LAYER (Fades out smoothly when scrolling below hero) */
  }
        <motion.div
    style={{ opacity: leavesOpacity }}
    className="absolute inset-0 overflow-hidden pointer-events-none z-10"
  >
          {FALLING_LEAVES_DATA.map((leaf) => <div
    key={leaf.id}
    className={`absolute top-0 ${leaf.animClass}`}
    style={{
      left: leaf.left,
      animationDelay: leaf.delay,
      animationDuration: leaf.duration
    }}
  >
              <svg
    width={leaf.size}
    height={leaf.size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
                <path
    d="M50 6 L55 22 L67 14 L63 28 L78 26 L71 40 L86 46 L74 56 L80 68 L64 62 L60 76 L50 68 L40 76 L36 62 L20 68 L26 56 L14 46 L29 40 L22 26 L37 28 L33 14 L45 22 Z"
    fill={leaf.fill}
    opacity="0.85"
  />
                <path d="M50 68 L50 90" stroke="#5C3A2E" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>)}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {
    /* Hero Left Content (Clean, elegant center-left layout) */
  }
          <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="lg:col-span-7 space-y-6"
  >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#3B281C] leading-[1.15]">
              Your <span className="text-[#8B5E3C] italic font-serif">Mind</span> Matters.<br />
              Your <span className="text-[#D88A5C] inline-flex items-center gap-2">Growth <MapleLeafIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#D88A5C]" /></span> Matters.<br />
              You Matter.
            </h1>

            <p className="text-base sm:text-lg text-[#5C3A2E]/85 max-w-xl leading-relaxed">
              <strong className="text-[#8B5E3C] font-semibold">Reflect. Heal. Bloom.</strong> — MindBloom is your emotional wellness companion that helps you reflect, heal, and grow every day with AI support and self-care tools. Open your digital journal inside a cozy sanctuary.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
    to="/login"
    className="cozy-btn-primary text-base px-6 py-3.5 flex items-center gap-2 shadow-md hover:shadow-lg transition"
  >
                <span>Get Started Free</span>
                <MapleLeafIcon className="w-4 h-4 text-[#E29578]" />
              </Link>
              <Link
    to="/features"
    className="cozy-btn-secondary text-base px-6 py-3.5 flex items-center gap-2 border border-[#EAD8C7]"
  >
                <span>Explore Features</span>
                <MapleLeafIcon className="w-4 h-4 text-[#D88A5C]" />
              </Link>
            </div>
          </motion.div>

          {
    /* Hero Right Cozy Illustration matching reference image */
  }
          <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7 }}
    className="lg:col-span-5 flex justify-center relative"
  >
            <CozyHeroIllustration className="w-full max-w-md md:max-w-lg" />
          </motion.div>
        </div>
      </section>

      {
    /* WHY CHOOSE MINDBLOOM SECTION */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 justify-center">
            <MapleLeafIcon className="w-4 h-4 text-[#D88A5C]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D88A5C]">Mindful Sanctuary</span>
            <MapleLeafIcon className="w-4 h-4 text-[#D88A5C]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B281C]">Why Choose MindBloom?</h2>
          <p className="text-sm text-[#5C3A2E]/80 max-w-xl mx-auto">
            A gentle sanctuary built for your peace of mind and emotional well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cozy-card p-6 text-center space-y-3 hover:-translate-y-1 transition">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF5EC] text-[#5C3A2E] flex items-center justify-center border border-[#EAD8C7]">
              <ShieldCheck className="w-6 h-6 text-[#5C3A2E]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B281C]">Private & Secure</h3>
            <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
              Your data is encrypted and always kept private. Your thoughts belong only to you.
            </p>
          </div>

          <div className="cozy-card p-6 text-center space-y-3 hover:-translate-y-1 transition">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF5EC] text-[#D4A373] flex items-center justify-center border border-[#EAD8C7]">
              <Bot className="w-6 h-6 text-[#D88A5C]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B281C]">AI-Powered Support</h3>
            <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
              Get personalized, empathetic guidance anytime, anywhere with BloomBot.
            </p>
          </div>

          <div className="cozy-card p-6 text-center space-y-3 hover:-translate-y-1 transition">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF5EC] text-[#4F5D3D] flex items-center justify-center border border-[#EAD8C7]">
              <BookOpen className="w-6 h-6 text-[#8B5E3C]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B281C]">Evidence Based</h3>
            <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
              Our content is backed by psychology and research to cultivate long-term resilience.
            </p>
          </div>

          <div className="cozy-card p-6 text-center space-y-3 hover:-translate-y-1 transition">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF5EC] text-[#E07A5F] flex items-center justify-center border border-[#EAD8C7]">
              <Heart className="w-6 h-6 text-[#D88A5C]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B281C]">Beautiful & Easy</h3>
            <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
              A calming, warm cafe experience you will love opening every single day.
            </p>
          </div>
        </div>
      </section>

      {
    /* MEET BLOOMBOT & FEATURES GRID */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-3 mb-12">
          <CozyBadge variant="gold" className="bg-[#FFF8F1] border border-[#EAD8C7]">Powerful Tools</CozyBadge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B281C]">Features</h2>
          <p className="text-sm text-[#5C3A2E]/80 max-w-md mx-auto">
            Everything you need to reflect, heal, and grow every day in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cozy-card-warm p-6 space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-25 dark:opacity-35 pointer-events-none">
              <MapleLeafIcon className="w-12 h-12 text-[#D88A5C]" />
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8F1] text-[#D88A5C] flex items-center justify-center border border-[#EAD8C7]">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B281C]">AI Companion</h3>
              <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
                Talk to BloomBot anytime and get personalized, compassionate mental health guidance.
              </p>
            </div>
            <Link to="/login" className="text-xs font-bold text-[#5C3A2E] hover:text-[#D88A5C] transition flex items-center gap-1.5 pt-2">
              <span>Chat with BloomBot</span>
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#D88A5C]" />
            </Link>
          </div>

          <div className="cozy-card-warm p-6 space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-25 dark:opacity-35 pointer-events-none">
              <MapleLeafIcon className="w-12 h-12 text-[#D4A373]" />
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8F1] text-[#8B5E3C] flex items-center justify-center border border-[#EAD8C7]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B281C]">Journaling</h3>
              <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
                Express your thoughts gently and track your personal emotional growth over time.
              </p>
            </div>
            <Link to="/login" className="text-xs font-bold text-[#5C3A2E] hover:text-[#D88A5C] transition flex items-center gap-1.5 pt-2">
              <span>Start Writing</span>
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#D4A373]" />
            </Link>
          </div>

          <div className="cozy-card-warm p-6 space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-25 dark:opacity-35 pointer-events-none">
              <MapleLeafIcon className="w-12 h-12 text-[#E29578]" />
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8F1] text-[#E29578] flex items-center justify-center border border-[#EAD8C7]">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B281C]">Mood Tracking</h3>
              <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
                Track your moods and understand your unique emotional patterns with visual charts.
              </p>
            </div>
            <Link to="/login" className="text-xs font-bold text-[#5C3A2E] hover:text-[#D88A5C] transition flex items-center gap-1.5 pt-2">
              <span>Log Today's Mood</span>
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#E29578]" />
            </Link>
          </div>

          <div className="cozy-card-warm p-6 space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-25 dark:opacity-35 pointer-events-none">
              <MapleLeafIcon className="w-12 h-12 text-[#889868]" />
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8F1] text-[#889868] flex items-center justify-center border border-[#EAD8C7]">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B281C]">🌱 Stories of Hope</h3>
              <p className="text-xs text-[#5C3A2E]/80 leading-relaxed">
                Read inspiring stories shared by members of the MindBloom community or share your own journey to encourage someone else. Every story is a reminder that healing is possible and nobody walks alone.
              </p>
            </div>
            <Link to="/stories" className="text-xs font-bold text-[#5C3A2E] hover:text-[#D88A5C] transition flex items-center gap-1.5 pt-2">
              <span>Read Stories</span>
              <MapleLeafIcon className="w-3.5 h-3.5 text-[#889868]" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
