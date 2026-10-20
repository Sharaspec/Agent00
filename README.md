# Daybloom

Plan your day, move your body and eat well, together with friends.

Daybloom is a daily planner, workout tracker and food diary in one web app, with light and dark mode and a social feed.

Anyone can use the planner, workouts and food log straight from the home page without an account; entries are saved in their browser. Creating an account saves everything to the cloud (guest entries move over automatically) and unlocks friends and sharing.

## Features

- **Today:** a time-based to-do list with categories. Bring over yesterday's unfinished tasks, track water and mood, and see progress rings for plan, movement and food.
- **Idea generator:** 60 ideas across movement, healthy eating, mindfulness, social, planning, rest and creativity. Add any of them to your day in one tap.
- **Workouts:** log walks, runs, rides, swims, hikes, lifts and more. Calories are estimated from Compendium MET values and your weight. You can build your own routines or use the 23-template library (gym, bodyweight, push/pull/legs, HIIT, Couch to 5K, walking, mobility) from beginner to advanced.
- **Food diary:** breakfast, lunch, dinner and snacks, with a 49-item quick-add list, one-tap re-logging of recent foods, custom entries, 21 healthy recipes, and calorie and macro tracking against your goals.
- **Progress:** day, week, month and year views of active minutes, distance, calories burned and eaten, tasks completed, activity mix, and a weekly streak.
- **Friends:** follow people, become friends when you follow each other, give kudos on shared workouts, and invite people through X, Facebook, Threads, WhatsApp or Instagram.
- **Profile:** username, bio, avatar color, goals, connected social logins (Google, Facebook, X, Apple), and a theme toggle.

## Tech

React 18, TypeScript, Vite, React Router, and Supabase for auth and Postgres with row-level security. It deploys to Netlify as a static site.

Without Supabase keys, it runs in **demo mode** and stores data in the browser.

## Getting started

```bash
npm install
npm run dev
```

See [SETUP.md](SETUP.md) to deploy to Netlify, connect Supabase, and turn on social logins.

## Project layout

```
src/
  pages/         Landing, AuthPage, Today, Workouts, Food, Progress, Friends, ProfilePage
  components/    App shell, charts and rings, idea generator, share buttons
  lib/           backend (Supabase + demo), auth, dates, stats, sharing
  data/          ideas, recipes, foods, workout templates, tips, MET values
  styles/        theme.css (design system), app.css
supabase/schema.sql   Tables and privacy rules
design/DESIGN.md      Design concept and tokens
research/             Research behind the built-in content
netlify.toml          Netlify build and SPA redirect
```

Nutrition and calorie figures are estimates for general wellness. They aren't medical advice.
