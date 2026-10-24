# Civic Pulse AI 🏛️⚡

> **Photo to Resolution in Under 30 Seconds** — An AI-powered civic intelligence Progressive Web App (PWA) transforming blurry citizen complaints into prioritized, auto-routed municipal work orders with verified before/after resolution proof.

---

## 🌟 The Problem & The Solution

- **The Problem**: 
  1. **Citizens don't report**: Traditional civic portals require 15-field forms, confusing ward dropdowns, and take 10+ minutes.
  2. **Authorities are overwhelmed**: Municipal queues are flooded with duplicate reports, missing coordinates, vague descriptions, and no severity triage.
- **The Solution**: 
  - Snap 1 photo in **< 30 seconds**.
  - **Gemini 3.8 Flash Vision AI** handles category classification, hazard rating (1-10), physical dimension estimation, safety risks (open sewers, live wires, near schools), and fake/meme rejection.
  - Smart radius matcher prevents duplicates and converts them to **1-tap upvotes**.
  - Authorities receive a real-time **AI Priority Queue** ranked by hazard urgency, proximity to critical infrastructure, and SLA deadlines.
  - Closed-loop accountability: Field crews upload fix photos, AI verifies the repair, and citizens sign off with gamified rewards.

---

## 🏗️ System Architecture

```text
  ┌──────────────────────────────────────────────────────────────┐
  │                   CITIZEN MOBILE PWA                         │
  │  • One-Tap Camera Capture • Voice Reporting (Multi-language) │
  │  • Instant Duplicate Matcher • Live WhatsApp-style Tracker   │
  │  • Gamification (Points, Badges, Streaks, Impact Card)       │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                 EXPRESS & GEMINI AI BACKEND                  │
  │  POST /api/analyze-issue       POST /api/verify-fix          │
  │  POST /api/voice-transcribe    POST /api/ai-chat             │
  │                                                              │
  │         🤖 Google GenAI SDK (gemini-3.8-flash)               │
  │   - Hazard severity rating (1-10)                            │
  │   - Size & volume estimation                                 │
  │   - Safety hazard detection (open manhole, live wire)        │
  │   - Before/After repair confidence scoring                   │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────┐
  │           MUNICIPAL AUTHORITY INTELLIGENCE SUITE             │
  │  • AI Priority Queue = (Sev*10 + Upvotes*3 + LocationBonus)  │
  │  • Auto-Routing: Roads, Lighting, Sanitation, Water, Drains  │
  │  • Kanban Board & SLA Countdown Escalation Timers            │
  │  • Predictive Hotspot Analytics & Pre-Monsoon Alerts         │
  │  • Ward Health Index (0-100) & PDF / CSV Export Engine       │
  └──────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Folder Structure

```text
├── index.html                  # PWA Entry point, mobile meta tags, Leaflet CSS
├── metadata.json               # AI Studio app capabilities & permissions
├── package.json                # Dependencies (@google/genai, express, leaflet, motion)
├── server.ts                   # Express server with Gemini API routes & Vite middleware
├── supabase/
│   ├── schema.sql              # Supabase PostgreSQL schema with PostGIS & RLS
│   └── seed.sql                # 65 realistic pre-seeded reports
├── scripts/
│   ├── generate-icons.cjs      # Programmatic PWA icon generator
│   └── seed-database.ts        # Database seed generator
├── src/
│   ├── main.tsx                # React DOM entry
│   ├── App.tsx                 # Core app shell, navigation & state management
│   ├── types/
│   │   └── index.ts            # CivicIssue, Timeline, Profile TypeScript models
│   ├── data/
│   │   └── seedReports.ts      # 65 realistic city reports across 8 wards
│   ├── i18n/
│   │   └── translations.ts     # English, Hindi, Kannada, Tamil, Spanish
│   ├── hooks/
│   │   ├── usePWAInstall.ts    # PWA install prompt hook (iOS & Android)
│   │   └── useOnlineStatus.ts  # Offline queue & connection status
│   └── components/
│       ├── CitizenReportFlow.tsx     # 30s photo/voice intake & duplicate checker
│       ├── CityMapView.tsx           # Interactive Leaflet map with custom pins
│       ├── IssueDetailModal.tsx      # Lifecycle tracker & Before/After audit
│       ├── AuthorityDashboard.tsx    # Priority queue, Kanban, SLAs, Analytics
│       ├── TransparencyPortal.tsx    # Ward health score & municipal rankings
│       ├── LeaderboardAndImpact.tsx  # Badges, points, citizen impact card
│       ├── AIChatDrawer.tsx          # "Pulse" natural language civic assistant
│       ├── QRCodeModal.tsx           # On-site QR code ticket generator
│       ├── GuidedDemoRunner.tsx      # 90-second guided hackathon scenario
│       └── PWAInstallButton.tsx      # In-app install button with iOS guide
```

---

## ⚡ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion)
- **Map & Geo**: Leaflet 1.9, OpenStreetMap & CartoDB Voyager tiles, PostGIS queries
- **AI Vision & Voice**: `@google/genai` (Gemini 3.8 Flash), Web Speech API
- **Backend / API**: Express 4, tsx
- **PWA**: `vite-plugin-pwa`, Service Worker asset caching, Offline queueing
- **Database**: PostgreSQL (Supabase ready with schema, spatial indexing, RLS)

---

## 🚀 Quickstart & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Create `.env` using `.env.example`:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Seed Script (Optional)**:
   ```bash
   npx tsx scripts/seed-database.ts
   ```
