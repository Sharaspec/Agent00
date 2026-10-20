// Sources: WHO 2020, US PAG, Harvard Healthy Eating Plate, National Academies, PROT-AGE, Lane et al. BMJ 2024, Paluch et al. 2022; figures are estimates.
import type { Tip } from './types';

export const TIPS: Tip[] = [
  {
    id: 't1', title: 'Fill half your plate with veg and fruit',
    body: 'Make vegetables and fruit half of each plate, then split the rest between whole grains and protein. Potatoes count as starch, not veg.',
    source: 'Harvard Healthy Eating Plate',
  },
  {
    id: 't2', title: 'Pick fish, beans, nuts, poultry or eggs',
    body: 'These make the healthiest protein picks. Limit red meat and avoid processed meats like bacon and deli slices.',
    source: 'Harvard Healthy Eating Plate',
  },
  {
    id: 't3', title: 'Drink water, not sugar',
    body: 'Water, tea and coffee are your best drinks. Skip sugary drinks and keep milk to 1-2 servings a day.',
    source: 'Harvard Healthy Eating Plate',
  },
  {
    id: 't4', title: 'Spread protein across your meals',
    body: 'Aim for roughly 20-40 g of protein per meal. The baseline is 0.8 g per kg of body weight a day, about 1.0-1.2 g/kg after 65 and 1.4-2.0 g/kg if you strength train; if you have kidney disease, ask a clinician first.',
    source: 'PROT-AGE; ISSN',
  },
  {
    id: 't5', title: 'Build up your fiber slowly',
    body: 'A common target is about 14 g per 1,000 kcal, roughly 25 g a day for women and 31-38 g for men, and most people get about half that. Add beans, whole grains, veg, fruit, nuts and seeds gradually, with plenty of water.',
    source: 'Dietary Guidelines for Americans',
  },
  {
    id: 't6', title: 'Check your hydration by color',
    body: 'Pale-yellow urine is a good sign you are drinking enough. Total water needs (about 2.7-3.7 L a day, including roughly 20% from food) go up in heat and with exercise.',
    source: 'National Academies water DRI',
  },
  {
    id: 't7', title: 'Favor short ingredient lists',
    body: 'A 2024 review of 45 meta-analyses linked higher ultra-processed food intake to 32 health problems. The studies were observational, so they show a link rather than proof, but cooking at home more is an easy win.',
    source: 'Lane et al., BMJ 2024',
  },
  {
    id: 't8', title: 'Go easy on sugar, salt and saturated fat',
    body: 'Keep free sugars and saturated fat each under 10% of daily calories. Aim for less than 2,300 mg of sodium a day (WHO suggests under 2,000 mg).',
    source: 'WHO; Dietary Guidelines for Americans',
  },
  {
    id: 't9', title: 'Eat 5 portions of fruit and veg a day',
    body: 'That is at least 400 g a day. Add fish about twice a week and keep alcohol to a minimum.',
    source: 'WHO; Dietary Guidelines for Americans',
  },
  {
    id: 't10', title: 'Aim for 150 active minutes a week',
    body: 'Adults benefit from 150-300 minutes of moderate activity or 75-150 minutes of vigorous activity a week. Any amount counts, so sit less and move more.',
    source: 'WHO 2020 guidelines',
  },
  {
    id: 't11', title: 'Strength train twice a week',
    body: 'Work all major muscle groups on at least 2 days a week. After 65, add balance training too.',
    source: 'WHO 2020; US Physical Activity Guidelines',
  },
  {
    id: 't12', title: 'Walk toward 8,000 steps a day',
    body: 'In a large observational analysis, benefits leveled off around 6,000-8,000 steps a day for people over 60 and 8,000-10,000 for younger adults. Every extra walk helps.',
    source: 'Paluch et al., Lancet Public Health 2022',
  },
];
