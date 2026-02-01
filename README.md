# UniFlow 🎓

> **When Students Want to Attend Events but Still Miss Them**

UniFlow is a redesigned event discovery experience that helps students discover, decide, and act on events they actually care about. It bridges the gap between intent and participation by providing a personalized, noise-free platform for campus activities.

## 🚀 Features

-   **Personalized "For You" Feed**: An intelligent recommendation engine that prioritizes events based on your selected interests.
-   **Smart Onboarding**: select your interests (e.g., Hackathons, Cultural, Workshops) to tailor your experience from day one.
-   **Unified Event Dashboard**: A centralized hub for all campus events, categorized for easy navigation.
-   **Monochrome Aesthetic**: A premium, high-contrast black-and-white design system (with Light/Dark mode support) that focuses on content clarity.
-   **Instant Clarity**: Standardized event cards with clear "Register" actions and essential details (Date, Time, Venue).

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Font**: [Geist](https://vercel.com/font)
-   **State Management**: React Context (Theme & User Preferences)

## 🏁 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `src/app`: Application routes and pages.
-   `src/components`: Reusable UI components (Event Cards, Navbar, etc.).
-   `src/context`: Global state providers (ThemeContext).
-   `src/data`: Mock data for events and user profiles.

## 🎨 Design Philosophy

The project uses a strict **monochrome** theme to reduce cognitive load. The design ensures that the *content* (the event details) is the "color" in the application, while the UI remains invisible and supportive.
