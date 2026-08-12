export const INITIAL_USER = {
  name: "",
  email: "",
  role: "user",
  avatarUrl: "",
  bio: "",
  streakDays: 0,
  wellnessScore: 0,
  totalJournals: 0,
  totalMoodLogs: 0,
  joinedDate: "Just joined",
  chat_count: 0,
  subscription_type: "free",
  subscription_status: "inactive",
  subscription_expiry: null
};
export const INITIAL_JOURNALS = [];
export const INITIAL_MOODS = [];
export const INITIAL_CONVERSATIONS = [];
export const INITIAL_REFLECTIONS = [];
export const INITIAL_ARTICLES = [
  {
    id: "a-1",
    title: "The Art of Slowing Down in a Fast-Paced World",
    category: "Mindfulness",
    readTime: "5 min read",
    description: "Discover how intentional micro-pauses and mindful tea rituals can reset your nervous system.",
    content: "In our relentless pursuit of productivity, we often treat rest as a reward rather than a necessity. Slowing down isn\u2019t about stopping; it\u2019s about aligning your speed with your capacity...",
    author: "Elena Rostova, Wellness Coach",
    publishedDate: "July 2026"
  },
  {
    id: "a-2",
    title: "Unpacking Academic & Career Anxiety",
    category: "Anxiety",
    readTime: "7 min read",
    description: "Actionable cognitive techniques to reframe perfectionism and imposter syndrome.",
    content: "When we tie our entire worth to output, every minor setback feels like a catastrophe. Reframing starts with recognizing that thoughts are proposals, not facts...",
    author: "Dr. Marcus Vance, Psych",
    publishedDate: "June 2026"
  },
  {
    id: "a-3",
    title: "Building a Gentle Night Ritual for Restful Sleep",
    category: "Sleep",
    readTime: "4 min read",
    description: "Transform your bedroom into a cozy sanctuary free from blue light and mental clutter.",
    content: "Sleep hygiene begins hours before your head hits the pillow. Warm lighting, calming scents like lavender, and brain-dump journaling clear cognitive space for deep sleep...",
    author: "Sarah Lin, Sleep Specialist",
    publishedDate: "July 2026"
  }
];
export const INITIAL_DISCOVER = [
  {
    id: "d-1",
    title: "4-7-8 Deep Box Breathing Exercise",
    type: "breathing",
    duration: "3 mins",
    category: "Anxiety Relief",
    description: "Interactive visual breath timer to immediately ground your nervous system.",
    instructor: "BloomBot AI Audio Guide"
  },
  {
    id: "d-2",
    title: "Cozy Rain & Cafe Ambient Meditation",
    type: "meditation",
    duration: "10 mins",
    category: "Mindfulness",
    description: "Soothing rain drops accompanied by gentle acoustic guitar and fireplace crackle.",
    instructor: "MindBloom Audio Sanctuary"
  },
  {
    id: "d-3",
    title: "Podcast: Embracing Imperfectionism",
    type: "podcast",
    duration: "18 mins",
    category: "Self Growth",
    description: "An intimate conversation on letting go of strict expectations and blooming at your own pace.",
    instructor: "Host: Maya Vance"
  }
];
export const INITIAL_QUOTES = [
  {
    id: "q-1",
    quote: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    author: "Christian D. Larson",
    category: "Courage",
    isSaved: true
  },
  {
    id: "q-2",
    quote: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
    category: "Rest",
    isSaved: true
  },
  {
    id: "q-3",
    quote: "You do not have to be good. You do not have to walk on your knees for a hundred miles through the desert repenting. You only have to let the soft animal of your body love what it loves.",
    author: "Mary Oliver",
    category: "Self-Acceptance",
    isSaved: false
  }
];
export const INITIAL_TESTIMONIALS = [];
export const INITIAL_FAQS = [
  {
    id: "f-1",
    question: "How does BloomBot support my mental wellness?",
    answer: "BloomBot uses empathetic, evidence-based conversational frameworks to help you process emotions, practice cognitive reframing, and discover grounding exercises in real time.",
    category: "BloomBot"
  },
  {
    id: "f-2",
    question: "Is my journal data kept private and secure?",
    answer: "Yes! Your personal journal entries and mood logs are encrypted locally in your browser. We never sell or share your intimate personal reflections.",
    category: "Privacy"
  },
  {
    id: "f-3",
    question: "Can I track my emotional trends over time?",
    answer: "Absolutely. MindBloom provides weekly and monthly mood heatmaps, emotion distribution charts, and wellness score trajectory graphs.",
    category: "Features"
  },
  {
    id: "f-4",
    question: "Is MindBloom free to use?",
    answer: "Yes, MindBloom offers a generous free tier with unlimited journal entries, daily mood tracking, and basic BloomBot conversations.",
    category: "Billing"
  }
];
export const INITIAL_ADMIN_USERS = [];
