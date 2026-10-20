// Source: research/content-research.md section 7 (informed by WHO and Harvard guidance); durations are rough estimates.
import type { Idea } from './types';

export const IDEAS: Idea[] = [
  // Move
  { id: 'i1', text: 'Take a 10-minute walk after lunch', category: 'move', minutes: 10 },
  { id: 'i2', text: 'Do 3 rounds: 10 squats, 10 push-ups and a 30 s plank', category: 'move', minutes: 10 },
  { id: 'i3', text: 'Take the stairs every chance you get today', category: 'move' },
  { id: 'i4', text: 'Turn a meeting or phone call into a walk', category: 'move', minutes: 30 },
  { id: 'i5', text: 'Throw a 15-minute kitchen dance party', category: 'move', minutes: 15 },
  { id: 'i6', text: 'Bike or walk to one errand instead of driving', category: 'move' },
  { id: 'i7', text: 'Try a new 20-minute yoga video', category: 'move', minutes: 20 },
  { id: 'i8', text: 'Stretch for 5 minutes before bed', category: 'move', minutes: 5 },
  { id: 'i9', text: 'Get up and move for 2 minutes every hour', category: 'move', minutes: 2 },
  { id: 'i10', text: "Walk somewhere you've never been before", category: 'move' },
  { id: 'i11', text: 'Power through a 7-minute bodyweight circuit', category: 'move', minutes: 7 },
  { id: 'i12', text: 'Brush your teeth balancing on one leg', category: 'move', minutes: 2 },

  // Eat
  { id: 'i13', text: 'Fill half your dinner plate with vegetables', category: 'eat' },
  { id: 'i14', text: "Eat a vegetable you haven't had in a month", category: 'eat' },
  { id: 'i15', text: 'Drink a glass of water before each meal', category: 'eat' },
  { id: 'i16', text: 'Swap one sugary drink for sparkling water', category: 'eat' },
  { id: 'i17', text: "Prep tomorrow's lunch tonight", category: 'eat', minutes: 15 },
  { id: 'i18', text: 'Add beans or lentils to one meal', category: 'eat' },
  { id: 'i19', text: 'Enjoy one slow, screen-free meal', category: 'eat', minutes: 20 },
  { id: 'i20', text: 'Turn leftovers into a grain bowl', category: 'eat', minutes: 10 },
  { id: 'i21', text: 'Get some protein in at breakfast', category: 'eat' },
  { id: 'i22', text: 'Reach for fruit or nuts instead of packaged snacks', category: 'eat' },
  { id: 'i23', text: 'Cook one meal from scratch', category: 'eat', minutes: 30 },
  { id: 'i24', text: 'Read 3 ingredient lists in your pantry', category: 'eat', minutes: 5 },

  // Mind
  { id: 'i25', text: 'Try 5 minutes of box breathing: in 4, hold 4, out 4, hold 4', category: 'mind', minutes: 5 },
  { id: 'i26', text: "Write down 3 things you're grateful for", category: 'mind', minutes: 5 },
  { id: 'i27', text: 'Unwind with a 10-minute body scan', category: 'mind', minutes: 10 },
  { id: 'i28', text: 'Take a mindful walk and notice 5 sounds', category: 'mind', minutes: 10 },
  { id: 'i29', text: 'Keep your phone away for the first 30 minutes after waking', category: 'mind', minutes: 30 },
  { id: 'i30', text: 'Spend 5 minutes journaling how you feel', category: 'mind', minutes: 5 },
  { id: 'i31', text: 'Soak up 10 minutes of daylight outside', category: 'mind', minutes: 10 },

  // Social
  { id: 'i32', text: "Message a friend you haven't talked to lately", category: 'social', minutes: 5 },
  { id: 'i33', text: 'Invite someone to join you for a walk', category: 'social' },
  { id: 'i34', text: 'Share a meal with family or friends', category: 'social' },
  { id: 'i35', text: 'Send someone a thank-you note', category: 'social', minutes: 10 },
  { id: 'i36', text: 'Join a class, club or group workout', category: 'social' },
  { id: 'i37', text: 'Do a small kindness for a neighbor', category: 'social' },
  { id: 'i38', text: 'Plan a weekend activity with someone', category: 'social', minutes: 10 },

  // Plan
  { id: 'i39', text: 'Pick your top 3 priorities for today', category: 'plan', minutes: 5 },
  { id: 'i40', text: 'Time-block your day, workout included', category: 'plan', minutes: 10 },
  { id: 'i41', text: 'Plan 3 days of meals and write a grocery list', category: 'plan', minutes: 20 },
  { id: 'i42', text: 'Declutter one spot for 10 minutes', category: 'plan', minutes: 10 },
  { id: 'i43', text: 'Knock out one 25-minute focus session', category: 'plan', minutes: 25 },
  { id: 'i44', text: 'Do a weekly review: wins, lessons, goals', category: 'plan', minutes: 20 },
  { id: 'i45', text: "Lay out tomorrow's workout clothes tonight", category: 'plan', minutes: 2 },
  { id: 'i46', text: 'Archive old email and enjoy a lighter inbox', category: 'plan', minutes: 10 },

  // Rest
  { id: 'i47', text: 'Keep a consistent bedtime and aim for 7+ hours', category: 'rest' },
  { id: 'i48', text: 'Switch screens off 30-60 minutes before bed', category: 'rest', minutes: 30 },
  { id: 'i49', text: 'Take a 20-minute nap or quiet rest', category: 'rest', minutes: 20 },
  { id: 'i50', text: 'Relax with a warm shower and gentle stretches', category: 'rest', minutes: 15 },
  { id: 'i51', text: 'Take a full rest day and let your body recover', category: 'rest' },
  { id: 'i52', text: 'Foam roll for 10 minutes', category: 'rest', minutes: 10 },
  { id: 'i53', text: 'Book a check-up or dental visit', category: 'rest', minutes: 5 },
  { id: 'i54', text: 'Sip a caffeine-free tea this evening', category: 'rest' },

  // Create
  { id: 'i55', text: 'Sketch anything for 15 minutes', category: 'create', minutes: 15 },
  { id: 'i56', text: 'Cook a healthy recipe from another cuisine', category: 'create' },
  { id: 'i57', text: 'Build a fresh workout playlist', category: 'create', minutes: 15 },
  { id: 'i58', text: 'Write a short poem or story', category: 'create', minutes: 20 },
  { id: 'i59', text: 'Snap 5 nature photos on your walk', category: 'create' },
  { id: 'i60', text: 'Spend 15 minutes learning a song, riff or dance', category: 'create', minutes: 15 },
];
