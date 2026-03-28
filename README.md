# 🌍 Planet Leads Academy

**Master Any Skill With AI Guidance**

A full-stack Next.js 14 e-learning platform with 25 AI-powered courses, live Claude AI Tutor, Gumroad payment integration, and full GitHub/Netlify/Vercel deployment support.

---

## 🚀 Features

- **25 AI-powered courses** across 5 categories (Faith, Languages, Music, Programming, Business)
- **Live AI Tutor** — fully wired to Claude AI (Anthropic) with course-specific context
- **Gumroad integration** — all 25 buy links connected
- **Search & filter** courses by category or keyword
- **Mobile responsive** — works on all devices
- **Static export ready** — deploy to GitHub Pages, Netlify, or Vercel

---

## 📁 Project Structure

```
planet-leads-academy/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx / .module.css
│   │   ├── Footer.tsx / .module.css
│   │   └── CourseCard.tsx / .module.css
│   ├── data/
│   │   └── courses.ts          ← All 25 courses + Gumroad links
│   ├── pages/
│   │   ├── index.tsx            ← Homepage
│   │   ├── courses.tsx          ← All courses page
│   │   ├── ai-tutor.tsx         ← Live AI Tutor
│   │   ├── privacy.tsx
│   │   ├── terms.tsx
│   │   ├── 404.tsx
│   │   └── api/
│   │       └── chat.ts          ← Claude AI API route
│   └── styles/
│       └── globals.css
├── .env.example
├── .gitignore
├── LICENSE
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your Anthropic API key at: https://console.anthropic.com/

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `out`
5. Add `ANTHROPIC_API_KEY` in Netlify → Site Settings → Environment Variables

**Note:** The AI Tutor (`/api/chat`) requires server-side execution. For full AI functionality on Netlify, use **Netlify Functions** or deploy to **Vercel** (recommended for API routes).

### Vercel (Best for AI features)
```bash
npm install -g vercel
vercel
```
Add `ANTHROPIC_API_KEY` in Vercel dashboard → Settings → Environment Variables.

### GitHub Pages (Static only — AI Tutor disabled)
```bash
npm run build
```
Upload the `out/` folder.

---

## 🔗 All Links

| Course | Gumroad Link |
|--------|-------------|
| Islamic Scholar AI | https://rayhymn.gumroad.com/l/gfzkwx |
| Bible Scholar AI | https://rayhymn.gumroad.com/l/sydvnr |
| Torah Scholar AI | https://rayhymn.gumroad.com/l/xlcipm |
| Spanish | https://rayhymn.gumroad.com/l/fzycak |
| French | https://rayhymn.gumroad.com/l/cidcgg |
| Mandarin | https://rayhymn.gumroad.com/l/seebgl |
| Japanese | https://rayhymn.gumroad.com/l/akfpsk |
| Korean | https://rayhymn.gumroad.com/l/imtdka |
| Portuguese | https://rayhymn.gumroad.com/l/lmsgrg |
| German | https://rayhymn.gumroad.com/l/dzuurr |
| Italian | https://rayhymn.gumroad.com/l/cxvuc |
| Arabic | https://rayhymn.gumroad.com/l/lrwwvs |
| Russian | https://rayhymn.gumroad.com/l/pbsszz |
| Piano | https://rayhymn.gumroad.com/l/lqgfhzl |
| Guitar | https://rayhymn.gumroad.com/l/mexiun |
| Music Theory | https://rayhymn.gumroad.com/l/bhraet |
| Python | https://rayhymn.gumroad.com/l/jeqfxe |
| JavaScript | https://rayhymn.gumroad.com/l/trxoo |
| Web Development | https://rayhymn.gumroad.com/l/gxiyf |
| Mobile Development | https://rayhymn.gumroad.com/l/fidin |
| Entrepreneurship | https://rayhymn.gumroad.com/l/pihcm |
| Leadership Mastery | https://rayhymn.gumroad.com/l/extkgs |
| Data Analytics | https://rayhymn.gumroad.com/l/dqevad |
| Project Management | https://rayhymn.gumroad.com/l/hemree |
| Digital Marketing | https://rayhymn.gumroad.com/l/zvhzb |

---

## 🏢 Planet Leads Academy

Brooklyn, NY  
planetleads1@gmail.com  
https://planet-leads-academy.netlify.app

© 2025 Planet Leads Academy. All rights reserved.
