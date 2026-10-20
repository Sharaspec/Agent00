import type { ActivityType } from './types';

// MET values from the Compendium of Physical Activities (2011 codes, checked
// against the published table; 2024 updates differ slightly for some).
// Estimated kcal = MET × body weight (kg) × hours.
export const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'walk', label: 'Walk', met: 3.5, hasDistance: true },
  { id: 'brisk_walk', label: 'Brisk walk', met: 4.3, hasDistance: true },
  { id: 'run', label: 'Run', met: 9.8, hasDistance: true },
  { id: 'jog', label: 'Jog', met: 7.0, hasDistance: true },
  { id: 'ride', label: 'Bike ride', met: 7.5, hasDistance: true },
  { id: 'hike', label: 'Hike', met: 6.0, hasDistance: true },
  { id: 'swim', label: 'Swim', met: 6.0, hasDistance: true },
  { id: 'row', label: 'Row', met: 7.0, hasDistance: true },
  { id: 'strength', label: 'Strength', met: 3.5, hasDistance: false },
  { id: 'hiit', label: 'HIIT', met: 8.0, hasDistance: false },
  { id: 'yoga', label: 'Yoga', met: 2.5, hasDistance: false },
  { id: 'pilates', label: 'Pilates', met: 3.0, hasDistance: false },
  { id: 'dance', label: 'Dance', met: 5.0, hasDistance: false },
  { id: 'sports', label: 'Sports', met: 7.0, hasDistance: false },
  { id: 'stretch', label: 'Stretch', met: 2.3, hasDistance: false },
  { id: 'custom', label: 'Other', met: 4.0, hasDistance: false },
];

export const activityType = (id: string) => ACTIVITY_TYPES.find((a) => a.id === id) ?? ACTIVITY_TYPES[ACTIVITY_TYPES.length - 1];

export function estimateCalories(typeId: string, minutes: number, weightKg: number | null): number {
  return Math.round(activityType(typeId).met * (weightKg || 70) * (minutes / 60));
}
