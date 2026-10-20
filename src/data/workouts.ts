// Sources: ACSM-style programming, NHS Couch to 5K (via research/content-research.md section 2); times and loads are estimates.
import type { WorkoutTemplate } from './types';

const WARM_UP = { name: 'Warm-up', durationSec: 300, notes: 'Light cardio and dynamic moves, 5-10 min.' };
const WALK_WARM_UP = { name: 'Brisk walk warm-up', durationSec: 300 };
const WALK_COOL_DOWN = { name: 'Walk cool-down', durationSec: 300 };

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // ---- Full-body gym ----
  {
    id: 'w1', name: 'Full-body gym starter', kind: 'strength', level: 'beginner', minutes: 40,
    description: 'A simple machine-and-dumbbell session to repeat 2-3 times a week on non-consecutive days.',
    exercises: [
      WARM_UP,
      { name: 'Goblet squat', sets: 2, reps: '10-12', notes: 'Stop 2-3 reps short of failure. Rest 60-90 s.' },
      { name: 'Dumbbell bench press or push-up', sets: 2, reps: '10-12', notes: 'Rest 60-90 s.' },
      { name: 'Seated cable row', sets: 2, reps: '10-12', notes: 'Rest 60-90 s.' },
      { name: 'Dumbbell Romanian deadlift', sets: 2, reps: '10-12', notes: 'Hinge at the hips, flat back. Rest 60-90 s.' },
      { name: 'Lat pulldown', sets: 2, reps: '10-12', notes: 'Rest 60-90 s.' },
      { name: 'Plank', sets: 3, reps: '20-30 s' },
    ],
  },
  {
    id: 'w2', name: 'Full-body gym A/B', kind: 'strength', level: 'intermediate', minutes: 50,
    description: 'Alternate Day A and Day B, training 3 times a week; do one day per session.',
    exercises: [
      WARM_UP,
      { name: 'Back squat (Day A)', sets: 3, reps: '6-10', notes: 'Rest 2-3 min.' },
      { name: 'Bench press (Day A)', sets: 3, reps: '6-10', notes: 'Rest 2-3 min.' },
      { name: 'Barbell row (Day A)', sets: 3, reps: '6-10', notes: 'Rest 90 s.' },
      { name: 'Plank (Day A)', sets: 3, reps: '30 s' },
      { name: 'Deadlift (Day B)', sets: 3, reps: '6-10', notes: 'Rest 2-3 min.' },
      { name: 'Overhead press (Day B)', sets: 3, reps: '6-10', notes: 'Rest 2-3 min.' },
      { name: 'Pull-up or lat pulldown (Day B)', sets: 3, reps: '6-10', notes: 'Rest 90 s.' },
      { name: 'Walking lunge (Day B)', sets: 3, reps: '10/leg', notes: 'Rest 60-90 s.' },
    ],
  },
  {
    id: 'w3', name: 'Full-body gym 3-day', kind: 'strength', level: 'advanced', minutes: 65,
    description: 'Run Days 1, 2 and 3 across the week with at least one rest day between sessions.',
    exercises: [
      WARM_UP,
      { name: 'Back squat (Day 1)', sets: 5, reps: '5', notes: 'Rest 2-3 min.' },
      { name: 'Bench press (Day 1)', sets: 5, reps: '5', notes: 'Rest 2-3 min.' },
      { name: 'Barbell row (Day 1)', sets: 4, reps: '6', notes: 'Rest 2 min.' },
      { name: 'Front squat (Day 2)', sets: 4, reps: '8', notes: 'Rest 2 min.' },
      { name: 'Incline dumbbell press (Day 2)', sets: 4, reps: '10', notes: 'Rest 90 s.' },
      { name: 'Pull-up (Day 2)', sets: 4, reps: 'AMRAP', notes: 'Rest 90 s.' },
      { name: 'Romanian deadlift (Day 2)', sets: 3, reps: '10', notes: 'Rest 90 s.' },
      { name: 'Deadlift (Day 3)', sets: 5, reps: '3', notes: 'Rest 3 min.' },
      { name: 'Overhead press (Day 3)', sets: 4, reps: '6', notes: 'Rest 2 min.' },
      { name: 'Weighted chin-up (Day 3)', sets: 4, reps: '6', notes: 'Rest 2 min.' },
      { name: 'Bulgarian split squat (Day 3)', sets: 3, reps: '8/leg', notes: 'Rest 90 s.' },
    ],
  },

  // ---- Bodyweight at home ----
  {
    id: 'w4', name: 'Home bodyweight basics', kind: 'strength', level: 'beginner', minutes: 20,
    description: 'A no-equipment circuit you can do 2-3 times a week in your living room.',
    exercises: [
      { name: 'Chair squat', sets: 3, reps: '10', notes: '2-3 rounds of the circuit; rest 60 s between rounds.' },
      { name: 'Wall or incline push-up', sets: 3, reps: '8' },
      { name: 'Glute bridge', sets: 3, reps: '12' },
      { name: 'Bird-dog', sets: 3, reps: '6/side' },
      { name: 'Dead bug', sets: 3, reps: '6/side' },
      { name: 'Knee plank', sets: 3, reps: '20 s' },
    ],
  },
  {
    id: 'w5', name: 'Home bodyweight circuit', kind: 'strength', level: 'intermediate', minutes: 30,
    description: 'A tougher no-equipment circuit for 2-3 sessions a week.',
    exercises: [
      { name: 'Bodyweight squat', sets: 4, reps: '15', notes: '3-4 rounds of the circuit; rest 60 s between rounds.' },
      { name: 'Push-up', sets: 4, reps: '10' },
      { name: 'Reverse lunge', sets: 4, reps: '10/leg' },
      { name: 'Table or towel row', sets: 4, reps: '10', notes: 'Use a sturdy table or a towel looped around a closed door.' },
      { name: 'Side plank', sets: 4, reps: '30 s/side' },
      { name: 'Mountain climbers', sets: 4, reps: '30 s' },
    ],
  },
  {
    id: 'w6', name: 'Home bodyweight burner', kind: 'strength', level: 'advanced', minutes: 40,
    description: 'A high-volume bodyweight circuit for 2-3 sessions a week when you want a real challenge.',
    exercises: [
      { name: 'Jump squat', sets: 5, reps: '15', notes: '4-5 rounds of the circuit; rest 45 s between rounds.' },
      { name: 'Decline or archer push-up', sets: 5, reps: '8/side' },
      { name: 'Bulgarian split squat', sets: 5, reps: '12/leg' },
      { name: 'Pike push-up', sets: 5, reps: '10' },
      { name: 'Single-leg Romanian deadlift', sets: 5, reps: '10/leg' },
      { name: 'Hollow hold', sets: 5, reps: '40 s' },
      { name: 'Burpee', sets: 5, reps: '10' },
    ],
  },

  // ---- HIIT ----
  {
    id: 'w7', name: 'Low-impact HIIT intro', kind: 'hiit', level: 'beginner', minutes: 20,
    description: 'Gentle 20/40 intervals to do 1-3 times a week, never on back-to-back days.',
    exercises: [
      WARM_UP,
      { name: 'March or high knees', sets: 2, durationSec: 20, notes: 'Work 20 s, rest 40 s.' },
      { name: 'Bodyweight squat', sets: 2, durationSec: 20, notes: 'Work 20 s, rest 40 s.' },
      { name: 'Step-back lunge', sets: 2, durationSec: 20, notes: 'Work 20 s, rest 40 s.' },
      { name: 'Incline push-up', sets: 2, durationSec: 20, notes: 'Work 20 s, rest 40 s.' },
      { name: 'Skater step', sets: 2, durationSec: 20, notes: 'Work 20 s, rest 40 s.' },
      { name: 'Cool-down', durationSec: 300, notes: 'Easy walking and light stretching.' },
    ],
  },
  {
    id: 'w8', name: 'HIIT 30/30', kind: 'hiit', level: 'intermediate', minutes: 25,
    description: 'Equal work and rest intervals for 1-3 sessions a week, with a rest day in between.',
    exercises: [
      WARM_UP,
      { name: 'Jumping jacks', sets: 3, durationSec: 30, notes: 'Work 30 s, rest 30 s.' },
      { name: 'Jump squats', sets: 3, durationSec: 30, notes: 'Work 30 s, rest 30 s.' },
      { name: 'Push-ups', sets: 3, durationSec: 30, notes: 'Work 30 s, rest 30 s.' },
      { name: 'Mountain climbers', sets: 3, durationSec: 30, notes: 'Work 30 s, rest 30 s.' },
      { name: 'Speed skaters', sets: 3, durationSec: 30, notes: 'Work 30 s, rest 30 s.' },
      { name: 'Cool-down', durationSec: 300, notes: 'Easy walking and light stretching.' },
    ],
  },
  {
    id: 'w9', name: 'HIIT 40/20 power', kind: 'hiit', level: 'advanced', minutes: 30,
    description: 'Hard 40/20 intervals for up to 3 sessions a week, never on consecutive days.',
    exercises: [
      WARM_UP,
      { name: 'Burpees', sets: 4, durationSec: 40, notes: 'Work 40 s, rest 20 s.' },
      { name: 'Jump lunges', sets: 4, durationSec: 40, notes: 'Work 40 s, rest 20 s.' },
      { name: 'Tuck jumps', sets: 4, durationSec: 40, notes: 'Work 40 s, rest 20 s.' },
      { name: 'Plank jacks', sets: 4, durationSec: 40, notes: 'Work 40 s, rest 20 s.' },
      { name: 'Sprints', sets: 4, durationSec: 40, notes: 'Work 40 s, rest 20 s. For a sprint day instead: 6-10 x 30 s all-out / 90 s easy.' },
      { name: 'Cool-down', durationSec: 300, notes: 'Easy walking and light stretching.' },
    ],
  },

  // ---- Walking ----
  {
    id: 'w10', name: 'Easy starter walk', kind: 'walk', level: 'beginner', minutes: 15,
    description: 'Walk 5 days a week and add 5 minutes each week until you reach 30 minutes.',
    exercises: [
      { name: 'Easy walk', durationSec: 900, notes: 'Comfortable, conversational pace. Start with 10-15 min.' },
    ],
  },
  {
    id: 'w11', name: 'Brisk walk', kind: 'walk', level: 'intermediate', minutes: 40,
    description: 'Walk briskly 5 days a week and pick a hilly route for one of them.',
    exercises: [
      { name: 'Easy walk warm-up', durationSec: 300 },
      { name: 'Brisk walk', durationSec: 1800, notes: 'About 100+ steps/min (3-4 mph). Build to 30-45 min.' },
      { name: 'Easy walk cool-down', durationSec: 300 },
    ],
  },
  {
    id: 'w12', name: 'Power walk intervals', kind: 'walk', level: 'advanced', minutes: 50,
    description: 'Do 45-60 minute power walks most days and add one 90+ minute hike each week.',
    exercises: [
      { name: 'Easy walk warm-up', durationSec: 300 },
      { name: 'Fast walk', sets: 6, durationSec: 180, notes: 'Alternate with the moderate interval below.' },
      { name: 'Moderate walk', sets: 6, durationSec: 120 },
      { name: 'Steady power walk', durationSec: 600, notes: 'Optional: ruck with 5-10 kg in a backpack.' },
      { name: 'Easy walk cool-down', durationSec: 300 },
    ],
  },

  // ---- Mobility ----
  {
    id: 'w13', name: 'Morning mobility', kind: 'mobility', level: 'beginner', minutes: 10,
    description: 'A gentle 10-minute routine to do at least 2-3 days a week.',
    exercises: [
      { name: 'Neck rolls', reps: '5/side', notes: 'Slow and controlled.' },
      { name: 'Shoulder rolls', reps: '10' },
      { name: 'Cat-cow', reps: '8' },
      { name: "Child's pose", reps: '30 s' },
      { name: 'Standing hamstring stretch', reps: '30 s/side' },
      { name: 'Half-kneeling hip flexor stretch', reps: '30 s/side' },
      { name: 'Calf stretch at the wall', reps: '30 s/side' },
    ],
  },
  {
    id: 'w14', name: 'Hips and spine flow', kind: 'mobility', level: 'intermediate', minutes: 15,
    description: 'A 15-minute flow for 2-3 or more days a week, great after workouts.',
    exercises: [
      { name: "World's greatest stretch", reps: '5/side' },
      { name: '90/90 hip switches', reps: '8' },
      { name: 'Thoracic open-book', reps: '8/side' },
      { name: 'Down dog to cobra', reps: '8' },
      { name: 'Deep squat hold', sets: 3, reps: '30 s' },
      { name: 'Pigeon stretch', reps: '45 s/side' },
      { name: 'Doorway pec stretch', reps: '30 s/side' },
    ],
  },
  {
    id: 'w15', name: 'Full-body mobility', kind: 'mobility', level: 'advanced', minutes: 25,
    description: 'A thorough 20-25 minute joint-by-joint session for 2-3 or more days a week.',
    exercises: [
      { name: 'Controlled articular rotations (neck, shoulders, hips, ankles)', reps: '3-5/joint', notes: 'Move slowly through your full pain-free range.' },
      { name: 'Cossack squat', reps: '8/side' },
      { name: 'Jefferson curl (light)', reps: '8', notes: 'Use a very light weight or none.' },
      { name: 'Couch stretch', reps: '60 s/side' },
      { name: 'Active straight-leg raise', reps: '10/side' },
      { name: 'Dead hang', sets: 3, reps: '30 s' },
      { name: 'Sun salutation', reps: '5' },
    ],
  },

  // ---- Push / Pull / Legs ----
  {
    id: 'w16', name: 'Push day', kind: 'strength', level: 'intermediate', minutes: 60,
    description: 'Chest, shoulders and triceps; rotate with Pull and Legs for 3 days a week.',
    exercises: [
      WARM_UP,
      { name: 'Bench press', sets: 4, reps: '6-8', notes: 'Rest 2-3 min.' },
      { name: 'Overhead press', sets: 3, reps: '8-10', notes: 'Rest 2 min.' },
      { name: 'Incline dumbbell press', sets: 3, reps: '10', notes: 'Rest 90 s.' },
      { name: 'Lateral raise', sets: 3, reps: '12-15', notes: 'Rest 60 s.' },
      { name: 'Triceps pushdown', sets: 3, reps: '12', notes: 'Rest 60 s.' },
      { name: 'Overhead triceps extension', sets: 2, reps: '12', notes: 'Rest 60 s.' },
    ],
  },
  {
    id: 'w17', name: 'Pull day', kind: 'strength', level: 'intermediate', minutes: 60,
    description: 'Back and biceps; rotate with Push and Legs for 3 days a week.',
    exercises: [
      WARM_UP,
      { name: 'Deadlift or rack pull', sets: 3, reps: '5', notes: 'Rest 2-3 min.' },
      { name: 'Pull-up or lat pulldown', sets: 4, reps: '8', notes: 'Rest 2 min.' },
      { name: 'Row', sets: 3, reps: '10', notes: 'Rest 90 s.' },
      { name: 'Face pull', sets: 3, reps: '15', notes: 'Rest 60 s.' },
      { name: 'Dumbbell curl', sets: 3, reps: '12', notes: 'Rest 60 s.' },
      { name: 'Hammer curl', sets: 2, reps: '12', notes: 'Rest 60 s.' },
    ],
  },
  {
    id: 'w18', name: 'Legs day', kind: 'strength', level: 'intermediate', minutes: 65,
    description: 'Quads, hamstrings, glutes, calves and core; rotate with Push and Pull for 3 days a week.',
    exercises: [
      WARM_UP,
      { name: 'Back squat', sets: 4, reps: '6-8', notes: 'Rest 2-3 min.' },
      { name: 'Romanian deadlift', sets: 3, reps: '8-10', notes: 'Rest 2 min.' },
      { name: 'Leg press', sets: 3, reps: '12', notes: 'Rest 90 s.' },
      { name: 'Walking lunge', sets: 3, reps: '10/leg', notes: 'Rest 90 s.' },
      { name: 'Leg curl', sets: 3, reps: '12', notes: 'Rest 60 s.' },
      { name: 'Calf raise', sets: 4, reps: '12-15', notes: 'Rest 60 s.' },
      { name: 'Hanging knee raise', sets: 3, reps: '12', notes: 'Rest 60 s.' },
    ],
  },

  // ---- Running ----
  {
    id: 'w19', name: 'Couch to 5K: Week 1', kind: 'run', level: 'beginner', minutes: 30,
    description: 'Your first step toward 5K; do this run 3 times a week with a rest day between.',
    exercises: [
      WALK_WARM_UP,
      { name: 'Run', sets: 8, durationSec: 60, notes: 'Easy pace. Follow each run with the walk below.' },
      { name: 'Walk', sets: 8, durationSec: 90 },
      WALK_COOL_DOWN,
    ],
  },
  {
    id: 'w20', name: 'Couch to 5K: Week 5, Run 1', kind: 'run', level: 'beginner', minutes: 35,
    description: 'Five-minute run blocks; this is the first of 3 runs this week.',
    exercises: [
      WALK_WARM_UP,
      { name: 'Run', sets: 3, durationSec: 300, notes: 'Steady, conversational pace. Follow each run with the walk below.' },
      { name: 'Walk', sets: 3, durationSec: 180 },
      WALK_COOL_DOWN,
    ],
  },
  {
    id: 'w21', name: 'Couch to 5K: Week 9', kind: 'run', level: 'beginner', minutes: 40,
    description: 'The finish line: a 30-minute run (about 5 km), 3 times this week.',
    exercises: [
      WALK_WARM_UP,
      { name: 'Continuous run', durationSec: 1800, notes: 'Keep it steady; slow down rather than stop.' },
      WALK_COOL_DOWN,
    ],
  },
  {
    id: 'w22', name: '10K builder: tempo run', kind: 'run', level: 'intermediate', minutes: 40,
    description: 'One of 4 weekly runs on the road from 5K to 10K; the rest are easy, interval and long runs.',
    exercises: [
      { name: 'Easy run', durationSec: 600 },
      { name: 'Tempo run', durationSec: 1200, notes: 'Comfortably hard, 15-20 min.' },
      { name: 'Easy run', durationSec: 600 },
    ],
  },
  {
    id: 'w23', name: 'VO2 max intervals', kind: 'run', level: 'advanced', minutes: 55,
    description: 'One hard session in a 5-6 run week where about 80% of running stays easy.',
    exercises: [
      { name: 'Easy run warm-up', durationSec: 600 },
      { name: '1000 m repeat', sets: 5, reps: '1 km', notes: 'At 5K race pace. Jog 2-3 min between repeats.' },
      { name: 'Easy run cool-down', durationSec: 600 },
    ],
  },
];
