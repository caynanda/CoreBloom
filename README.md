# CoreBloom

![CoreBloom Logo](./assets/CoreBloom-logo.jpg)

**CoreBloom** is a postpartum strength training app designed to guide new moms through safe, effective workouts using minimal equipment—resistance bands, a 10 lb dumbbell, and adjustable barbell plates. Our focus is on rebuilding core and pelvic stability, gradually increasing full-body strength, and tracking non-scale health progress.

---

## 🎯 MVP Features

1. **Onboarding Flow**
   - 4-step introduction: Welcome, How It Works, Safety Tips, Profile Setup
   - Collects **name** & **recovery notes**, stored in `localStorage`

2. **Home Screen**
   - Dynamic greeting by name
   - Automatically selects today’s workout (A→B→C cycle)
   - Weekly progress bar (X of 3 workouts completed)

3. **Workouts Tab**
   - List of **Workout A (Lower Body)**, **B (Upper Body)**, **C (Core & Mobility)**
   - Click through to nested routes via `<Outlet>`

4. **Step-by-Step Workout Screens**
   - **WorkoutA**, **WorkoutB**, **WorkoutC** components
   - Displays exercise name, sets & reps, instructions, placeholder media
   - **Back** / **Next** navigation and **Mark Complete** logs to `localStorage`

5. **Progress Tab**
   - Lists all completed workouts from `localStorage`

6. **Profile Tab**
   - View & edit **name**, **recovery notes**, **reminders**, **training phase**
   - Persists changes to `localStorage`

---

## 📁 Project Structure

```
corebloom/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── CoreBloom-logo.jpg
│   │   └── CoreBloom-AppIcon.png
│   ├── components/
│   │   ├── Onboarding.jsx
│   │   ├── Home.jsx
│   │   ├── Workouts.jsx
│   │   ├── WorkoutA.jsx
│   │   ├── WorkoutB.jsx
│   │   ├── WorkoutC.jsx
│   │   ├── Progress.jsx
│   │   └── Profile.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .gitignore
```

---

## ⚙️ Setup & Installation

1. **Clone the repo** and navigate in:
   ```bash
   git clone <repo-url> corebloom
   cd corebloom
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

4. **View** on `http://localhost:3000`.

---

## 🛠 Technology Stack

- **React** (v18) with functional components & Hooks
- **React Router** (v6) for navigation
- **Tailwind CSS** for utility-first styling
- **lucide-react** for icons
- **LocalStorage** for lightweight persistence

---

## 🚀 AI Construction Guide

1. **Initialize Project**
   - Create a React app (`npx create-react-app corebloom`).
   - Install `react-router-dom`, `lucide-react`, `tailwindcss`, `postcss`, `autoprefixer`.
   - Configure Tailwind in `tailwind.config.js` and import `index.css`.

2. **Assets**
   - Place `CoreBloom-logo.jpg` and `CoreBloom-AppIcon.png` in `src/assets`.

3. **Generate Components**
   - Create files in `src/components` with corresponding logic:
     - `Onboarding.jsx`, `Home.jsx`, `Workouts.jsx`, `WorkoutA.jsx`, `WorkoutB.jsx`, `WorkoutC.jsx`, `Progress.jsx`, `Profile.jsx`

4. **Set Up Routing**
   - In `App.jsx`, implement onboarding guard, nested routes, and bottom tab bar.

5. **Styling**
   - Use Tailwind utility classes and define custom colors:
     - `#FADADD`, `#DB2777`, `#D4EADF`, `#F5F1EA`, `#9CA3AF`

6. **State & Persistence**
   - Hook state with React and persist to localStorage under `profile` and `workoutsDone`.

7. **Testing**
   - Validate flows: onboarding, workouts cycle, progress persistence, profile edits.

---

## 📈 Roadmap

- Add exercise images/videos.
- Connect to backend (e.g., Firebase).
- Push notifications & reminders.
- Enhanced analytics & graphs.
- PWA support.

---

## 🎨 Assets

- Logo: `src/assets/CoreBloom-logo.jpg`
- App Icon: `src/assets/CoreBloom-AppIcon.png`

---

© 2025 CoreBloom