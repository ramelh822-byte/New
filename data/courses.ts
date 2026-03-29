export interface Course {
  id: string;
  emoji: string;
  title: string;
  category: string;
  price: number;
  description: string;
  gumroadLink: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  emoji: string;
  label: string;
  courses: Course[];
}

export const courses: Course[] = [
  // Faith & Spirituality
  {
    id: "islamic-scholar",
    emoji: "☪️",
    title: "Islamic Scholar AI",
    category: "Faith & Spirituality",
    price: 49.99,
    description: "Deep dive into Islamic theology, jurisprudence, and Quranic studies with an AI-powered scholar companion.",
    gumroadLink: "https://rayhymn.gumroad.com/l/gfzkwx",
    featured: true,
  },
  {
    id: "bible-scholar",
    emoji: "📖",
    title: "Bible Scholar AI",
    category: "Faith & Spirituality",
    price: 49.99,
    description: "Explore biblical texts, theology, and Christian history with an intelligent AI scholar as your guide.",
    gumroadLink: "https://rayhymn.gumroad.com/l/sydvnr",
    featured: true,
  },
  {
    id: "torah-scholar",
    emoji: "📜",
    title: "Torah Scholar AI",
    category: "Faith & Spirituality",
    price: 49.99,
    description: "Study Torah, Talmud, and Jewish tradition with a knowledgeable AI tutor guiding your spiritual journey.",
    gumroadLink: "https://rayhymn.gumroad.com/l/xlcipm",
  },
  // Languages
  {
    id: "spanish",
    emoji: "🇪🇸",
    title: "Spanish",
    category: "Languages",
    price: 49.99,
    description: "Master conversational Spanish with AI-driven immersion techniques and real-time pronunciation feedback.",
    gumroadLink: "https://rayhymn.gumroad.com/l/fzycak",
    featured: true,
  },
  {
    id: "french",
    emoji: "🇫🇷",
    title: "French",
    category: "Languages",
    price: 49.99,
    description: "Learn French from bonjour to fluency with adaptive AI lessons, cultural context, and live conversation practice.",
    gumroadLink: "https://rayhymn.gumroad.com/l/cidcgg",
  },
  {
    id: "mandarin",
    emoji: "🇨🇳",
    title: "Mandarin",
    category: "Languages",
    price: 49.99,
    description: "Conquer Mandarin tones, characters, and grammar with AI-guided spaced repetition and speaking practice.",
    gumroadLink: "https://rayhymn.gumroad.com/l/seebgl",
  },
  {
    id: "german",
    emoji: "🇩🇪",
    title: "German",
    category: "Languages",
    price: 49.99,
    description: "Tackle German grammar and build fluency for travel, business, or culture with intelligent AI guidance.",
    gumroadLink: "https://rayhymn.gumroad.com/l/dzuurr",
  },
  {
    id: "italian",
    emoji: "🇮🇹",
    title: "Italian",
    category: "Languages",
    price: 49.99,
    description: "Fall in love with the Italian language — vocabulary, pronunciation, and culture through AI-powered dialogue.",
    gumroadLink: "https://rayhymn.gumroad.com/l/cxvuc",
  },
  {
    id: "portuguese",
    emoji: "🇵🇹",
    title: "Portuguese",
    category: "Languages",
    price: 49.99,
    description: "Speak Brazilian or European Portuguese confidently with an AI tutor that adapts to your target dialect.",
    gumroadLink: "https://rayhymn.gumroad.com/l/lmsgrg",
  },
  {
    id: "japanese",
    emoji: "🇯🇵",
    title: "Japanese",
    category: "Languages",
    price: 49.99,
    description: "Learn hiragana, katakana, kanji, and natural Japanese conversation with personalized AI coaching.",
    gumroadLink: "https://rayhymn.gumroad.com/l/akfpsk",
  },
  {
    id: "korean",
    emoji: "🇰🇷",
    title: "Korean",
    category: "Languages",
    price: 49.99,
    description: "Master Hangul and Korean conversation through AI-powered lessons inspired by K-culture and everyday speech.",
    gumroadLink: "https://rayhymn.gumroad.com/l/imtdka",
  },
  {
    id: "arabic",
    emoji: "🇸🇦",
    title: "Arabic",
    category: "Languages",
    price: 49.99,
    description: "Learn Modern Standard Arabic and conversational dialects with script training and AI speaking practice.",
    gumroadLink: "https://rayhymn.gumroad.com/l/lrwwvs",
  },
  {
    id: "russian",
    emoji: "🇷🇺",
    title: "Russian",
    category: "Languages",
    price: 49.99,
    description: "Master Cyrillic, Russian grammar, and natural conversation with an AI tutor committed to your fluency.",
    gumroadLink: "https://rayhymn.gumroad.com/l/pbsszz",
  },
  // Music
  {
    id: "piano",
    emoji: "🎹",
    title: "Piano",
    category: "Music",
    price: 59.99,
    description: "From beginner to performer — learn piano with adaptive AI lessons, sheet music guidance, and instant feedback.",
    gumroadLink: "https://rayhymn.gumroad.com/l/lqgfhzl",
    featured: true,
  },
  {
    id: "guitar",
    emoji: "🎸",
    title: "Guitar",
    category: "Music",
    price: 59.99,
    description: "Strum your way to mastery — chords, scales, and songs taught by an AI tutor that adapts to your skill level.",
    gumroadLink: "https://rayhymn.gumroad.com/l/mexiun",
    featured: true,
  },
  {
    id: "music-theory",
    emoji: "🎼",
    title: "Music Theory",
    category: "Music",
    price: 59.99,
    description: "Understand the language of music — scales, harmony, rhythm, and composition with AI-powered interactive exercises.",
    gumroadLink: "https://rayhymn.gumroad.com/l/bhraet",
  },
  // Programming
  {
    id: "python",
    emoji: "🐍",
    title: "Python",
    category: "Programming",
    price: 59.99,
    description: "Learn Python from scratch to professional — data science, automation, and web dev with an AI coding mentor.",
    gumroadLink: "https://rayhymn.gumroad.com/l/jeqfxe",
    featured: true,
  },
  {
    id: "javascript",
    emoji: "📜",
    title: "JavaScript",
    category: "Programming",
    price: 59.99,
    description: "Build dynamic web applications with JavaScript — from DOM manipulation to modern ES2024 with AI assistance.",
    gumroadLink: "https://rayhymn.gumroad.com/l/trxoo",
    featured: true,
  },
  {
    id: "web-development",
    emoji: "🌐",
    title: "Web Development",
    category: "Programming",
    price: 59.99,
    description: "Build full-stack websites with HTML, CSS, and modern frameworks guided by an AI development coach.",
    gumroadLink: "https://rayhymn.gumroad.com/l/gxiyf",
  },
  {
    id: "mobile-development",
    emoji: "📱",
    title: "Mobile Development",
    category: "Programming",
    price: 59.99,
    description: "Create iOS and Android apps with React Native and AI-powered code review and architectural guidance.",
    gumroadLink: "https://rayhymn.gumroad.com/l/fidin",
  },
  // Business
  {
    id: "entrepreneurship",
    emoji: "🚀",
    title: "Entrepreneurship",
    category: "Business",
    price: 59.99,
    description: "Launch and grow your business with AI-guided strategies, market analysis frameworks, and startup playbooks.",
    gumroadLink: "https://rayhymn.gumroad.com/l/pihcm",
    featured: true,
  },
  {
    id: "leadership",
    emoji: "👥",
    title: "Leadership Mastery",
    category: "Business",
    price: 59.99,
    description: "Develop executive leadership skills with AI-powered coaching, team dynamics strategies, and decision frameworks.",
    gumroadLink: "https://rayhymn.gumroad.com/l/extkgs",
    featured: true,
  },
  {
    id: "data-analytics",
    emoji: "📈",
    title: "Data Analytics",
    category: "Business",
    price: 59.99,
    description: "Turn raw data into business insights using Excel, SQL, and visualization tools with AI-guided walkthroughs.",
    gumroadLink: "https://rayhymn.gumroad.com/l/dqevad",
  },
  {
    id: "project-management",
    emoji: "📋",
    title: "Project Management",
    category: "Business",
    price: 59.99,
    description: "Master Agile, Scrum, and PMP frameworks with AI-assisted scenario planning and real-world project simulations.",
    gumroadLink: "https://rayhymn.gumroad.com/l/hemree",
  },
  {
    id: "digital-marketing",
    emoji: "📊",
    title: "Digital Marketing",
    category: "Business",
    price: 59.99,
    description: "Drive growth with SEO, social media, email, and paid ads — all guided by an AI marketing strategist.",
    gumroadLink: "https://rayhymn.gumroad.com/l/zvhzb",
  },
];

export const categories: Category[] = [
  {
    id: "faith",
    emoji: "🙏",
    label: "Faith & Spirituality",
    courses: courses.filter((c) => c.category === "Faith & Spirituality"),
  },
  {
    id: "languages",
    emoji: "🗣️",
    label: "Languages",
    courses: courses.filter((c) => c.category === "Languages"),
  },
  {
    id: "music",
    emoji: "🎵",
    label: "Music",
    courses: courses.filter((c) => c.category === "Music"),
  },
  {
    id: "programming",
    emoji: "💻",
    label: "Programming",
    courses: courses.filter((c) => c.category === "Programming"),
  },
  {
    id: "business",
    emoji: "💼",
    label: "Business",
    courses: courses.filter((c) => c.category === "Business"),
  },
];

export const featuredCourses = courses.filter((c) => c.featured);
