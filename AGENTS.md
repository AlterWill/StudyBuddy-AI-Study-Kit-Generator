## 1. Project Context
- **Project Name:** StudyBuddy (ForgeHacks 2026 Online - AI + Education Track)
- **Goal:** Turn raw text notes into a clean, interactive study kit (Summary, Key Concepts, Flashcards, Quiz, Explain Simply).
- **Core Priority:** Speed, simplicity, and working MVP polish before submission deadline (October 10, 2026 @ 9:30 PM IST).
- **Primary Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, `@google/genai` (Gemini API via Google AI Studio).

---

## 2. Agent Guidelines & Coding Standards

### Code Architecture & Practices
- **App Router Rules:** Put API routes inside `app/api/.../route.ts` and UI pages/components inside `app/`.
- **Client vs Server:** Mark interactive components (forms, interactive quiz/flashcard states) explicitly with `'use client';` at the top.
- **Type Safety:** Define clear TypeScript interfaces for API requests, responses, and state objects (e.g., `Flashcard`, `QuizQuestion`, `StudyKitResponse`).
- **Dependencies:** Keep external packages minimal. Rely on standard React hooks (`useState`, `useEffect`), Tailwind CSS, and lightweight libraries like `lucide-react` (if installed). Do not add heavy state management libraries (e.g., Redux, Zustand).

### UI & Styling Standards
- Clean, modern, high-contrast, student-friendly interface.
- Responsive layout using mobile-first Tailwind utilities.
- Always include visual state indicators: loading spinners, disabled button states, error banners, and empty states.
- Display "ForgeHacks 2026 | AI + Education Track" in the global header/banner.

---

## 3. Core File Structure


```

├── app/
│   ├── api/
│   │   └── generate-kit/
│   │       └── route.ts       # Gemini API endpoint (@google/genai)
│   ├── globals.css            # Tailwind directives & global styles
│   ├── layout.tsx             # Main layout shell
│   └── page.tsx               # Main MVP dashboard (Input + Study Kit UI)
├── public/                    # Static assets / screenshots
├── .env.local                 # GEMINI_API_KEY (DO NOT COMMIT)
└── AGENT.md                   # Agent guidelines & rules

```

---

## 4. Workflows & Rules of Engagement

1. **Keep Changes Minimal & Incremental:** Modify only the necessary files for a given task. Do not rewrite existing working logic unless instructed.
2. **Handle Errors Gracefully:** Always wrap network/API calls in `try/catch` blocks and expose friendly client-side UI error messages.
3. **No Unnecessary Abstractions:** Keep code self-contained in clean, readable components rather than creating excessive folder nestings.

```
