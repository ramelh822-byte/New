# Planet Leads Academy

An AI-powered online learning platform with 25+ courses across Faith & Spirituality, Languages, Music, Programming, and Business categories.

## Architecture

- **Framework**: Next.js 14.2.3 (Pages Router)
- **Language**: TypeScript
- **Package Manager**: npm

## Directory Structure

```
pages/           # Next.js pages (routes)
  _app.tsx       # App wrapper, imports globals.css
  _document.tsx  # Custom document (fonts, favicon)
  index.tsx      # Homepage
  courses.tsx    # Course catalog
  ai-tutor.tsx   # AI Tutor chat interface
  404.tsx        # Custom 404 page
  privacy.tsx    # Privacy policy
  terms.tsx      # Terms of service
  api/
    chat.ts      # Anthropic API proxy (server-side only)
components/      # Shared React components
  Navbar.tsx
  Footer.tsx
  CourseCard.tsx
data/
  courses.ts     # Course data, categories, featured courses
styles/
  globals.css    # Global CSS
public/
  favicon.svg
```

## Environment Variables

- `ANTHROPIC_API_KEY` — Required for the AI Tutor feature (calls Claude claude-opus-4-5)

## Running the App

The dev server runs on port 5000 (required for Replit):

```
npm run dev   # Development with hot reload
npm start     # Production
```

## Key Features

- Course catalog with 25+ AI-powered courses
- AI Tutor chat powered by Anthropic Claude (server-side API route keeps key secure)
- Responsive design with CSS Modules
- External course purchasing via Gumroad links

## Security

- The Anthropic API key is only used server-side in `pages/api/chat.ts`
- Client never receives or sees the API key
