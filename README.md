# BugHunt Web 🐛⚡

[![Deploy to GitHub Pages](https://github.com/erdogan-k/bughunt-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/erdogan-k/bughunt-web/actions/workflows/deploy.yml)

**BugHunt Web** is an interactive, browser-based JavaScript debugging game featuring a dark terminal aesthetic. Players can inspect, edit, and fix real-world JavaScript bugs directly in the browser without installing any tools.

🌐 **Live Demo (GitHub Pages):** [https://erdogan-k.github.io/bughunt-web/](https://erdogan-k.github.io/bughunt-web/)

---

## ✨ Key Features

- **14 Curated JavaScript Debugging Challenges:** Covers 6 core categories (*Arrays & Loops*, *Objects & References*, *Async & Promises*, *Scope & Closures*, *Types & Logic*, and *Strings & Data Processing*) across **Easy**, **Medium**, and **Hard** difficulty tiers.
- **Monaco Editor Integration:** Built-in VS Code editor experience with syntax highlighting, line numbers, `Ctrl + Enter` shortcut to run tests, and an instant plain-text editor fallback.
- **Isolated Web Worker Sandbox:**
  - User code is **never** executed on the main JavaScript thread (`window` / DOM context) via `eval` or `Function`.
  - Every test run spawns a short-lived, isolated **Web Worker**.
  - Network and storage APIs inside the worker (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts`, `indexedDB`, `caches`, `BroadcastChannel`) are explicitly disabled.
  - Enforces a strict **2000ms (2-second) execution timeout** (`worker.terminate()`) to protect against infinite loops (`while (true) {}`).
  - *Security Note:* Browser Web Workers provide thread-level, DOM, and `localStorage` isolation, though they are not a full OS-level virtual machine. No code is ever sent to a backend server—all execution happens client-side.
- **Gamified Progression (`localStorage`):** Earn XP, level up through debugger ranks, and unlock **6 achievement badges**. All progress and draft code are automatically persisted in `localStorage`.
- **Hints & Root-Cause Explanations:** Each challenge includes a progressive hint, reference solution, and an educational post-solution root-cause analysis.
- **Fully Responsive Layout:** Side-by-side code editor and test runner on desktop; stacked layout on mobile and tablet screens.

---

## 🛠️ Tech Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS v4**
- **Monaco Editor (`@monaco-editor/react`)**
- **Lucide React** (Icons)
- **Vitest + React Testing Library** (Unit & integration testing)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** `v18+` (`v20+` or `v22+` recommended)
- **npm** `v9+`

### Installation

1. **Clone the repository and navigate into the project folder:**
   ```bash
   git clone https://github.com/erdogan-k/bughunt-web.git
   cd bughunt-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🧪 Running Tests & Building

```bash
# Run all unit & sandbox challenge validation tests
npm test

# Run tests in interactive watch mode
npm run test:watch

# Run TypeScript type checking
npm run lint

# Build for production (outputs to ./dist)
npm run build

# Preview the production build locally
npm run preview
```

---

## 🌐 Deployment Guide

BugHunt Web is a 100% static client-side Single Page Application (SPA) with zero backend dependencies.

### 1. GitHub Pages (Automated via GitHub Actions)
This repository includes a pre-configured GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). Every push to the `main` branch automatically runs the test suite, builds the production bundle, and deploys `./dist` to GitHub Pages.

### 2. Vercel
1. Import the GitHub repository into [Vercel](https://vercel.com/).
2. **Framework Preset:** `Vite`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

### 3. Netlify
1. Select **Add new site > Import an existing project** in [Netlify](https://www.netlify.com/).
2. **Build Command:** `npm run build`
3. **Publish Directory:** `dist`
