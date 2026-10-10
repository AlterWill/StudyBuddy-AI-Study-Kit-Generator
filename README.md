# StudyBuddy — AI Study Kit Generator
> **ForgeHacks 2026 Online Hackathon | Track: AI + Education**

StudyBuddy is a modern, student-first web application designed to transform dense lecture notes, textbook passages, or study material into structured, interactive study kits in seconds using Google Gemini AI.

---

## 🎬 Video Demo

[![StudyBuddy Demo Video](https://img.youtube.com/vi/a64-BD1NT2E/maxresdefault.jpg)](https://youtu.be/a64-BD1NT2E)

👉 **Watch the full project walkthrough on YouTube:** [https://youtu.be/a64-BD1NT2E](https://youtu.be/a64-BD1NT2E)

---

## 🚀 Features

- **📝 Instant Summary:** 2–3 sentence high-level overview summarizing raw notes.
- **💡 Key Concepts:** Highlighted core takeaways for quick review before exams.
- **🗂️ Interactive Flashcards:** Digital flip cards with question front and click-to-reveal answers.
- **🧠 Self-Assessment Quiz:** Interactive multiple-choice questions with instant correct/incorrect visual feedback and score calculation.
- **✨ Clean, Responsive UI:** High-contrast, mobile-friendly interface built with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Model:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`) via the `@google/genai` SDK
- **Package Manager:** `pnpm`

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   └── generate-kit/     # Gemini AI study kit generation endpoint
│   ├── globals.css           # Tailwind CSS directives
│   ├── layout.tsx            # Global layout shell with ForgeHacks header
│   └── page.tsx              # Main StudyBuddy kit generator & interactive UI
├── public/                   # Static icons & assets
├── .gitignore                # Git ignore configuration
└── README.md                 # Project documentation
```

---

## 🏃 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- `pnpm` (or `npm` / `yarn` / `bun`)
- A [Google AI Studio API Key](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone https://github.com/AlterWill/StudyBuddy-AI-Study-Kit-Generator.git
cd StudyBuddy-AI-Study-Kit-Generator
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

### 4. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License
This project was built for **ForgeHacks 2026**.
