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

## 🛠 Technology Stack

- **React** (v18) with functional components & Hooks
- **React Router** (v6) for navigation
- **Tailwind CSS** for utility-first styling
- **lucide-react** for icons
- **LocalStorage** for lightweight persistence

---

© 2025 CoreBloom# CoreBloom
