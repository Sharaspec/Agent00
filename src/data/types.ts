// Shared types for built-in content and user records.

export type IdeaCategory = 'move' | 'eat' | 'mind' | 'social' | 'plan' | 'rest' | 'create';

export interface Idea {
  id: string;
  text: string;
  category: IdeaCategory;
  minutes?: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Recipe {
  id: string;
  name: string;
  meal: MealType;
  minutes: number;
  servings: number;
  calories: number; // per serving
  protein: number; // grams per serving
  carbs: number;
  fat: number;
  tags: string[];
  ingredients: string[];
  steps: string[];
}

export interface FoodItem {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type WorkoutKind = 'strength' | 'cardio' | 'hiit' | 'mobility' | 'run' | 'walk';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string; // "8-12", "30s", "AMRAP"
  durationSec?: number;
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  kind: WorkoutKind;
  level: Level;
  minutes: number;
  description: string;
  exercises: Exercise[];
}

export interface ActivityType {
  id: string; // 'walk', 'run', ...
  label: string;
  met: number; // Compendium of Physical Activities MET value
  hasDistance: boolean;
}

export interface Tip {
  id: string;
  title: string;
  body: string;
  source?: string;
}

// ---- User records (stored in Supabase or in local demo storage) ----

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_color: string;
  is_public: boolean;
  weight_kg: number | null;
  goal_calories: number;
  goal_protein: number;
  goal_active_minutes: number; // per week
  goal_water: number; // glasses per day
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string | null; // HH:MM
  category: IdeaCategory;
  done: boolean;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  date: string;
  type: string; // ActivityType id or 'custom'
  name: string;
  duration_min: number;
  distance_km: number | null;
  calories: number;
  notes: string;
  exercises: Exercise[];
  shared: boolean;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  date: string;
  meal: MealType;
  name: string;
  servings: number;
  calories: number; // total for the logged servings
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export interface CustomWorkout {
  id: string;
  user_id: string;
  name: string;
  kind: WorkoutKind;
  exercises: Exercise[];
  created_at: string;
}

export interface DayNote {
  id: string; // `${user_id}_${date}`
  user_id: string;
  date: string;
  water: number;
  mood: number | null; // 1-5
  note: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Kudos {
  id: string;
  user_id: string;
  activity_id: string;
  created_at: string;
}
