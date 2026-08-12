import { Link } from "react-router-dom";
import { CozyBadge } from "../../components/common/UIComponents";
import { Bot, BookOpen, Smile, Leaf, GraduationCap, Compass, Sparkles, BarChart2, Sprout } from "lucide-react";
export const FeaturesPage = () => {
  const featureList = [
    {
      title: "🌱 Stories of Hope",
      icon: Sprout,
      color: "bg-[#EAEFE6] text-[#4F5D3D]",
      desc: "Read inspiring stories shared by members of the MindBloom community or share your own journey to encourage someone else.",
      tag: "Community"
    },
    {
      title: "BloomBot AI Companion",
      icon: Bot,
      color: "bg-[#FAF2E6] text-[#D4A373]",
      desc: "Talk to BloomBot anytime for empathetic, cognitive-behavioral guidance, prompt suggestions, and real-time stress reframing.",
      tag: "AI Powered"
    },
    {
      title: "Guided Journaling",
      icon: BookOpen,
      color: "bg-[#F5EFE6] text-[#8B5E3C]",
      desc: "Express your deepest thoughts inside a rich, distraction-free writing environment with emotion tags and custom search.",
      tag: "Journal"
    },
    {
      title: "Mood & Emotion Tracker",
      icon: Smile,
      color: "bg-[#FBEBE6] text-[#E07A5F]",
      desc: "Select daily mood states, log activity triggers, and inspect weekly and monthly emotional trend heatmaps.",
      tag: "Analytics"
    },
    {
      title: "Daily Reflection & Gratitude",
      icon: Leaf,
      color: "bg-[#EAEFE6] text-[#4F5D3D]",
      desc: "Reflect daily on 3 things you are thankful for, set gentle micro-goals, and reinforce daily positive affirmations.",
      tag: "Daily Habit"
    },
    {
      title: "Mindful Learning Hub",
      icon: GraduationCap,
      color: "bg-[#FAF2E6] text-[#9E6D38]",
      desc: "Curated articles on stress management, sleep hygiene, anxiety reframing, and intentional slow productivity.",
      tag: "Educational"
    },
    {
      title: "Discover & Audio Sanctuary",
      icon: Compass,
      color: "bg-[#F5EFE6] text-[#5C3D2E]",
      desc: "Interactive 4-7-8 breathing timer, rain & cafe ambient audio, and short podcasts for instant anxiety relief.",
      tag: "Interactive"
    },
    {
      title: "Inspire & Affirmation Cards",
      icon: Sparkles,
      color: "bg-[#FBEBE6] text-[#B8543B]",
      desc: "Save favorite quotes, flip inspirational cards, and receive daily motivational prompts.",
      tag: "Inspiration"
    },
    {
      title: "Progress & Wellness Score",
      icon: BarChart2,
      color: "bg-[#EAEFE6] text-[#4F5D3D]",
      desc: "Holistic wellness score tracking your reflection streak, mood stability, and journaling consistency.",
      tag: "Insights"
    }
  ];
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <CozyBadge variant="autumn">MindBloom Suite</CozyBadge>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3B281C]">Features</h1>
        <p className="text-sm text-[#705D52]">
          Powerful tools to help you reflect, heal, and grow every day in one cohesive place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureList.map((f, i) => {
    const Icon = f.icon;
    return <div key={i} className="cozy-card p-6 space-y-3 flex flex-col justify-between hover:-translate-y-1 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CozyBadge variant="latte">{f.tag}</CozyBadge>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3B281C]">{f.title}</h3>
                <p className="text-xs text-[#705D52] leading-relaxed">{f.desc}</p>
              </div>
            </div>;
  })}
      </div>

      <div className="bg-[#5C3D2E] text-[#FFFBF7] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h2 className="font-serif text-3xl font-bold text-[#FFFBF7]">Ready to begin your journey?</h2>
        <p className="text-xs sm:text-sm text-[#D4C3B3] max-w-lg mx-auto">
          Join thousands of mindful individuals who are growing and creating a calmer, more intentional life with MindBloom.
        </p>
        <div className="pt-2">
          <Link to="/login" className="cozy-btn-secondary inline-block px-8 py-3 text-sm font-semibold">
            Sign In to Access Features
          </Link>
        </div>
      </div>
    </div>;
};
