import { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import {
  Sparkles,
  Bookmark,
  Share2,
  RefreshCw,
  Mail,
  Heart,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Feather,
  Flower2
} from "lucide-react";
import { CozyBadge, CozyModal } from "../../components/common/UIComponents";
import { useAuth } from "../../contexts/AuthContext";
import { MapleLeafIcon, CozyCatLogo } from "../../components/illustrations/CozyIllustrations";

const ENVELOPE_MESSAGES = [
  "Someone left a little something for you.",
  "A gentle reminder is waiting for you.",
  "Take a quiet moment."
];

export const InspirePage = () => {
  const { addToast } = useAuth();

  // State for backend data collections
  const [quotes, setQuotes] = useState([]);
  const [affirmations, setAffirmations] = useState([]);
  const [todayQuote, setTodayQuote] = useState(null);
  const [todayAffirmation, setTodayAffirmation] = useState(null);
  const [articles, setArticles] = useState([]);
  const [newsletters, setNewsletters] = useState([]);

  // Active filters and modals
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  // Envelope interactive state
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [envelopeMessageIndex, setEnvelopeMessageIndex] = useState(0);

  // Daily index calculation based on calendar date string
  const getTodayIndex = () => {
    const todayStr = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const todayHash = getTodayIndex();
  const [customAffirmationIndex, setCustomAffirmationIndex] = useState(null);

  // Load backend items from PostgreSQL database
  useEffect(() => {
    const loadAllContent = async () => {
      // 0. Today's Quote and Affirmation
      try {
        const todayRes = await fetch("/api/inspire/today/");
        if (todayRes.ok) {
          const todayData = await todayRes.json();
          if (todayData.success && todayData.data) {
            if (todayData.data.quote) {
              setTodayQuote({
                quote: todayData.data.quote.content || todayData.data.quote.text,
                author: todayData.data.quote.author || "Anonymous",
                category: todayData.data.quote.category || "Wisdom"
              });
            }
            if (todayData.data.affirmation) {
              setTodayAffirmation(todayData.data.affirmation.content || todayData.data.affirmation.text);
            }
          }
        }
      } catch (err) {
        console.error("Error loading today's content:", err);
      }

      // 1. All Quotes
      try {
        const qRes = await fetch("/api/inspire/quotes/");
        if (qRes.ok) {
          const qData = await qRes.json();
          if (qData.success && Array.isArray(qData.data)) {
            setQuotes(qData.data.map(q => ({
              id: q.id,
              quote: q.content || q.text,
              author: q.author || "Anonymous",
              category: q.category || "Wisdom",
              isSaved: false
            })));
          }
        }
      } catch (err) {
        console.error("Error loading quotes:", err);
      }

      // 2. All Affirmations
      try {
        const aRes = await fetch("/api/inspire/affirmations/");
        if (aRes.ok) {
          const aData = await aRes.json();
          if (aData.success && Array.isArray(aData.data)) {
            setAffirmations(aData.data.map(a => a.content || a.text));
          }
        }
      } catch (err) {
        console.error("Error loading affirmations:", err);
      }

      // 3. Articles
      try {
        const artRes = await fetch("/api/inspire/articles/");
        if (artRes.ok) {
          const artData = await artRes.json();

          // Django REST Framework may return a plain array, {data: [...]},
          // or a paginated {results: [...]} response.
          const articleList = Array.isArray(artData)
            ? artData
            : Array.isArray(artData?.data)
              ? artData.data
              : Array.isArray(artData?.results)
                ? artData.results
                : [];

          setArticles(articleList.map(a => ({
            id: a.id,
            title: a.title,
            category: a.category || "Wellness",
            readTime: a.read_time || a.readTime || "5 min read",
            description:
              a.summary ||
              a.description ||
              (a.content ? a.content.substring(0, 160) + "..." : ""),
            content: a.content || "",
            author: a.author || "MindBloom Editorial",
            publishedDate: a.published_date
              ? new Date(a.published_date).toLocaleDateString()
              : "Today",
            image: a.image || "",
            sourceUrl: a.source_url || a.url || a.link || ""
          })));
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error("Error loading articles:", err);
        setArticles([]);
      }

      // 4. Newsletters
      try {
        const newsRes = await fetch("/api/inspire/newsletters/");
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (newsData.success && Array.isArray(newsData.data)) {
            setNewsletters(newsData.data.map(n => ({
              id: n.id,
              title: n.title,
              content: n.content,
              published_date: n.published_date ? new Date(n.published_date).toLocaleDateString() : "Recent"
            })));
          } else {
            setNewsletters([]);
          }
        } else {
          setNewsletters([]);
        }
      } catch (err) {
        console.error("Error loading newsletters:", err);
        setNewsletters([]);
      }
    };

    loadAllContent();

    // Set envelope message index based on today
    setEnvelopeMessageIndex(todayHash % ENVELOPE_MESSAGES.length);
  }, []);

  // Compute today's featured items from DB
  const currentQuote = todayQuote || (quotes.length > 0 ? quotes[todayHash % quotes.length] : null);

  const affList = affirmations.length > 0 ? affirmations : (todayAffirmation ? [todayAffirmation] : []);
  const affIndex = customAffirmationIndex !== null ? (customAffirmationIndex % affList.length) : 0;
  const currentAffirmation = affList.length > 0
    ? affList[affIndex]
    : (todayAffirmation || null);

  const handleNextAffirmation = () => {
    if (affList.length > 0) {
      setCustomAffirmationIndex((prev) => ((prev !== null ? prev : 0) + 1) % affList.length);
      addToast("Gentle Affirmation Refresh ✨", "New affirmation ready for you.", "info");
    }
  };

  const handleToggleSave = (id) => {
    apiService.toggleSaveQuote(id);
    setQuotes((prev) => prev.map(q => q.id === id ? { ...q, isSaved: !q.isSaved } : q));
    addToast("Updated", "Saved to your inspiration collection", "info");
  };

  const categories = ["All", "Mindfulness", "Anxiety", "Sleep", "Stress Management", "Self Care"];
  const activeArticles = articles;
  const filteredArticles = activeCategory === "All"
    ? activeArticles
    : activeArticles.filter((a) => {
        const articleCategory = String(a.category || "").trim().toLowerCase();
        const selectedCategory = activeCategory.trim().toLowerCase();

        return (
          articleCategory === selectedCategory ||
          (selectedCategory === "self care" && articleCategory === "self-care")
        );
      });

  return (
    <div className="space-y-10 pb-16">
      {/* Page Title & Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E6DCCD] dark:border-[#3D3128] pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2.5">
            <span>Inspire & Read Hub</span>
            <MapleLeafIcon className="w-7 h-7 text-[#E07A5F]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] mt-1">
            Your daily sanctuary for quiet wisdom, gentle affirmations, and educational wellness articles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CozyBadge variant="autumn">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Daily Reflection Hub
          </CozyBadge>
        </div>
      </div>

      {/* 💌 SECTION 1: A LETTER FOR YOU (Interactive Animated Envelope) */}
      <div id="letter-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#E07A5F]" />
            <span>A Letter for You</span>
          </h2>
          <span className="text-xs text-[#8C7667] dark:text-[#A8988B] font-medium">
            Refreshed Daily • {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Envelope Container */}
        <div className="cozy-card-warm p-6 sm:p-10 border-2 border-[#EAD8C7] dark:border-[#3D3128] bg-[#FFFBF7] dark:bg-[#251E19] relative rounded-3xl shadow-sm overflow-hidden transition-all duration-500">
          {!isLetterOpen ? (
            /* CLOSED ENVELOPE VIEW */
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 sm:py-8 max-w-xl mx-auto">
              {/* Envelope SVG Visual */}
              <div
                onClick={() => setIsLetterOpen(true)}
                className="group relative cursor-pointer transform hover:scale-105 transition duration-300"
                title="Click to open your daily letter"
              >
                {/* Outer Envelope Body */}
                <div className="w-64 h-44 sm:w-72 sm:h-48 bg-[#F5EBE1] dark:bg-[#342B24] border-2 border-[#D8C2B0] dark:border-[#4A3B31] rounded-2xl shadow-md relative flex items-center justify-center overflow-hidden">
                  {/* Flap Triangles */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-[#EAD8C7] dark:bg-[#3D3128] border-b border-[#D8C2B0] dark:border-[#4A3B31] [clip-path:polygon(0_0,50%_100%,100%_0)] group-hover:brightness-105 transition duration-300" />
                  
                  {/* Heart / Wax Seal */}
                  <div className="z-10 w-12 h-12 rounded-full bg-[#E07A5F] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300 border-2 border-[#FFFBF7]">
                    <Heart className="w-6 h-6 fill-current text-[#FFFBF7]" />
                  </div>

                  {/* Envelope Stitch Line */}
                  <div className="absolute bottom-2 left-4 right-4 h-0.5 border-b border-dashed border-[#C8B2A0] dark:border-[#5C4A3E]" />
                </div>

                {/* Floating Maple Leaf */}
                <MapleLeafIcon className="w-6 h-6 text-[#E07A5F] absolute -top-2 -right-2 animate-bounce" />
              </div>

              {/* Envelope Message */}
              <div className="space-y-2">
                <p className="font-serif text-lg sm:text-xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
                  "{ENVELOPE_MESSAGES[envelopeMessageIndex]}"
                </p>
                <p className="text-xs text-[#705D52] dark:text-[#C4B2A3]">
                  A cozy envelope crafted especially for you today.
                </p>
              </div>

              {/* Open Button */}
              <button
                onClick={() => setIsLetterOpen(true)}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#5C3D2E] dark:bg-[#D87D56] text-[#FFFBF7] dark:text-[#171310] hover:bg-[#3B281C] dark:hover:bg-[#E88E68] transition flex items-center gap-2 shadow-sm transform active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Open Your Letter</span>
              </button>
            </div>
          ) : (
            /* OPENED LETTER VIEW */
            <div className="space-y-8 animate-fadeIn">
              {/* Letter Header */}
              <div className="flex items-center justify-between border-b border-[#EFE6DC] dark:border-[#3D3128] pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8EDE3] dark:bg-[#342B24] border border-[#E6DCCD] dark:border-[#3D3128] flex items-center justify-center text-[#E07A5F]">
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[#3B281C] dark:text-[#FFFBF7]">
                      Today's Gentle Letter
                    </h3>
                    <span className="text-xs text-[#8C7667] dark:text-[#A8988B]">
                      Written for your quiet moment today
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsLetterOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F5EFE6] dark:bg-[#342B24] hover:bg-[#EAE0D3] dark:hover:bg-[#42372E] text-[#5C3D2E] dark:text-[#E8DCCF] transition border border-[#E6DCCD] dark:border-[#3D3128]"
                >
                  Close Letter
                </button>
              </div>

              {/* Letter Paper Body */}
              <div className="bg-[#FAF6F0] dark:bg-[#1E1814] p-6 sm:p-8 rounded-2xl border border-[#E8DDD0] dark:border-[#382D25] space-y-8 shadow-2xs relative">
                {/* 🌸 TODAY'S QUOTE */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
                    <Flower2 className="w-4 h-4" />
                    <span>Today's Quote</span>
                  </div>
                  {currentQuote ? (
                    <>
                      <blockquote className="font-serif text-base sm:text-lg italic font-medium text-[#3B281C] dark:text-[#F7EBE1] leading-relaxed border-l-4 border-[#E07A5F] pl-4 py-1">
                        "{currentQuote.quote}"
                      </blockquote>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#8C7667] dark:text-[#B8A79B]">
                          — {currentQuote.author}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author}`);
                            addToast("Copied", "Quote copied to clipboard", "success");
                          }}
                          className="text-xs text-[#8B5E3C] dark:text-[#D87D56] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-[#8C7667] dark:text-[#A8988B] italic py-2">
                      No quote available today.
                    </p>
                  )}
                </div>

                <div className="border-t border-[#EFE6DC] dark:border-[#2F2620]" />

                {/* 💛 GENTLE AFFIRMATION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D88A5C]">
                      <Sparkles className="w-4 h-4" />
                      <span>Gentle Affirmation</span>
                    </div>
                    {affList.length > 0 && (
                      <button
                        onClick={handleNextAffirmation}
                        className="text-xs text-[#8B5E3C] dark:text-[#D87D56] hover:text-[#5C3D2E] dark:hover:text-[#FFFBF7] font-semibold flex items-center gap-1 bg-white dark:bg-[#2A231D] px-2.5 py-1 rounded-lg border border-[#EAD8C7] dark:border-[#3D3128] transition shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refresh Affirmation</span>
                      </button>
                    )}
                  </div>
                  {currentAffirmation ? (
                    <p className="font-serif text-lg sm:text-xl font-semibold text-[#3B281C] dark:text-[#FFFBF7] bg-white/80 dark:bg-[#28211B] p-4 rounded-xl border border-[#EAD8C7] dark:border-[#3D3128] text-center italic">
                      "{currentAffirmation}"
                    </p>
                  ) : (
                    <p className="text-xs text-[#8C7667] dark:text-[#A8988B] italic py-2 text-center">
                      No affirmation available.
                    </p>
                  )}
                </div>

                <div className="border-t border-[#EFE6DC] dark:border-[#2F2620]" />

                {/* Letter Footer Navigation Prompts */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-2 text-xs">
                  <span className="text-[#8C7667] dark:text-[#A8988B] flex items-center gap-1.5">
                    <CozyCatLogo className="w-5 h-5" />
                    <span>MindBloom automatically prepares a new letter for you each morning.</span>
                  </span>
                  <a
                    href="#read-reflect-section"
                    className="font-bold text-[#5C3D2E] dark:text-[#D87D56] hover:underline flex items-center gap-1"
                  >
                    <span>Explore Guides & Articles Below</span>
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🌱 SECTION 2: READ & REFLECT (Wellness Articles & Guides from Learn page) */}
      <div id="read-reflect-section" className="space-y-6 pt-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#8B5E3C] dark:text-[#D87D56]" />
            <span>Read & Reflect</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] mt-1">
            Evidence-based psychological insights, self-care guides, and educational wellness content.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#5C3D2E] dark:bg-[#D87D56] text-[#FFFBF7] dark:text-[#171310] shadow-xs"
                  : "bg-[#FFFBF7] dark:bg-[#2A231D] border border-[#E6DCCD] dark:border-[#3D3128] text-[#705D52] dark:text-[#D4C3B3] hover:bg-[#F5EFE6] dark:hover:bg-[#342B24]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="cozy-card p-6 space-y-4 flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-[#E6DCCD] dark:border-[#3D3128] bg-[#FFFBF7] dark:bg-[#251E19] group"
              >
                <div className="space-y-3">
                  {/* Image Cover Preview or Aesthetic Header */}
                  {article.image ? (
                    <div className="h-40 rounded-2xl overflow-hidden border border-[#E6DCCD] dark:border-[#3D3128] relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <CozyBadge variant="autumn">{article.category}</CozyBadge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <CozyBadge variant="autumn">{article.category}</CozyBadge>
                      <span className="text-[10px] text-[#8C7667] dark:text-[#A8988B] flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-[#E07A5F]" /> {article.readTime}
                      </span>
                    </div>
                  )}

                  {article.image && (
                    <div className="flex items-center justify-end">
                      <span className="text-[10px] text-[#8C7667] dark:text-[#A8988B] flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-[#E07A5F]" /> {article.readTime}
                      </span>
                    </div>
                  )}

                  <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7] group-hover:text-[#E07A5F] transition leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#705D52] dark:text-[#C4B2A3] line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFE6DC] dark:border-[#382D25] flex items-center justify-between gap-3 text-xs font-bold text-[#5C3D2E] dark:text-[#D87D56]">
                  <span>{article.sourceUrl ? "Read Original Article" : "Read Guide"}</span>
                  {article.sourceUrl ? (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      Open
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </a>
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cozy-card p-8 text-center text-xs text-[#8C7667] dark:text-[#A8988B] border border-[#E6DCCD] dark:border-[#3D3128]">
            No articles available.
          </div>
        )}
      </div>

      {/* 📰 SECTION 3: BLOOM LETTER (Newsletters) */}
      <div className="space-y-6 pt-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7] flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#D88A5C]" />
            <span>Bloom Letter</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#705D52] dark:text-[#D4C3B3] mt-1">
            Curated wellness newsletters, community digests, and seasonal self-care guidance.
          </p>
        </div>

        {newsletters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                onClick={() => setSelectedNewsletter(newsletter)}
                className="cozy-card-warm p-6 space-y-4 flex flex-col justify-between border border-[#E6DCCD] dark:border-[#3D3128] bg-[#FFFBF7] dark:bg-[#251E19] hover:-translate-y-1 transition duration-300 cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CozyBadge variant="autumn">Newsletter</CozyBadge>
                    <span className="text-xs text-[#8C7667] dark:text-[#A8988B] flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{newsletter.published_date}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#3B281C] dark:text-[#FFFBF7] group-hover:text-[#E07A5F] transition leading-snug">
                    {newsletter.title}
                  </h3>
                  <p className="text-xs text-[#705D52] dark:text-[#C4B2A3] line-clamp-3 leading-relaxed">
                    {newsletter.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFE6DC] dark:border-[#382D25] flex items-center justify-between text-xs font-bold text-[#8B5E3C] dark:text-[#D87D56]">
                  <span>Read Newsletter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cozy-card-warm p-8 text-center text-xs text-[#8C7667] dark:text-[#A8988B] border border-[#E6DCCD] dark:border-[#3D3128]">
            No newsletters available.
          </div>
        )}
      </div>

      {/* ARTICLE READER MODAL */}
      <CozyModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title || ""}
        subtitle={`${selectedArticle?.category || 'Wellness'} • ${selectedArticle?.readTime || '5 min'}`}
      >
        {selectedArticle && (
          <div className="space-y-4 pt-2">
            {selectedArticle.image && (
              <div className="w-full h-52 rounded-2xl overflow-hidden border border-[#E6DCCD] dark:border-[#3D3128]">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-[#8C7667] dark:text-[#A8988B] font-semibold">
              <span>By {selectedArticle.author || "MindBloom Coach"}</span>
              <span>Published {selectedArticle.publishedDate || "Recently"}</span>
            </div>
            <div className="text-xs sm:text-sm text-[#4A3B32] dark:text-[#E8DCCF] leading-relaxed whitespace-pre-wrap space-y-3 pt-2">
              <p>{selectedArticle.content}</p>

              {selectedArticle.sourceUrl && (
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] text-[#FFFBF7] font-semibold hover:bg-[#D66F54] transition"
                >
                  Read Original Article
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              <p className="p-4 bg-[#FAF6F0] dark:bg-[#221A15] border-l-4 border-[#E07A5F] rounded-r-xl font-medium text-xs text-[#5C3D2E] dark:text-[#E8DCCF] italic">
                Remember: Taking small, intentional steps toward self-regulation strengthens your mind against future overwhelm. Progress is built quietly day by day.
              </p>
            </div>
          </div>
        )}
      </CozyModal>

      {/* NEWSLETTER READER MODAL */}
      <CozyModal
        isOpen={!!selectedNewsletter}
        onClose={() => setSelectedNewsletter(null)}
        title={selectedNewsletter?.title || ""}
        subtitle={`MindBloom Newsletter • ${selectedNewsletter?.published_date || 'Recent'}`}
      >
        {selectedNewsletter && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E07A5F]">
              <Mail className="w-4 h-4" />
              <span>Full Newsletter Edition</span>
            </div>
            <div className="text-xs sm:text-sm text-[#4A3B32] dark:text-[#E8DCCF] leading-relaxed whitespace-pre-wrap space-y-3 bg-[#FAF6F0] dark:bg-[#221A15] p-5 rounded-2xl border border-[#E6DCCD] dark:border-[#3D3128]">
              <p>{selectedNewsletter.content}</p>
            </div>
          </div>
        )}
      </CozyModal>
    </div>
  );
};