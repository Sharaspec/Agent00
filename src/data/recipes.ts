// Source: research/content-research.md section 5 (USDA-based estimates); macros per serving are approximate (+/-10-15%).
import type { Recipe } from './types';

export const RECIPES: Recipe[] = [
  // Breakfast
  {
    id: 'r1', name: 'Overnight Oats', meal: 'breakfast', minutes: 5, servings: 1,
    calories: 400, protein: 20, carbs: 55, fat: 11, tags: ['make-ahead', 'vegetarian'],
    ingredients: ['1/2 cup rolled oats', '1/2 cup milk', '1/3 cup plain Greek yogurt', '1 tbsp chia seeds', '1/2 cup berries', '1 tsp honey'],
    steps: ['Stir everything except the berries together in a jar.', 'Cover and refrigerate overnight.', 'Top with berries before eating.'],
  },
  {
    id: 'r2', name: 'Veggie Egg Scramble', meal: 'breakfast', minutes: 15, servings: 1,
    calories: 330, protein: 22, carbs: 20, fat: 18, tags: ['vegetarian', 'high-protein', '15-min'],
    ingredients: ['2 eggs', '2 egg whites', '1 cup spinach', '1/2 bell pepper, diced', '1/4 onion, diced', '1 tsp olive oil', '1 slice whole-grain toast'],
    steps: ['Heat the oil in a pan.', 'Saute the pepper, onion and spinach for 3 minutes.', 'Add the eggs and whites and stir until set.', 'Serve with the toast.'],
  },
  {
    id: 'r3', name: 'Greek Yogurt Parfait', meal: 'breakfast', minutes: 5, servings: 1,
    calories: 320, protein: 24, carbs: 38, fat: 8, tags: ['vegetarian', 'high-protein', '15-min'],
    ingredients: ['1 cup nonfat Greek yogurt', '1/2 cup berries', '1/4 cup low-sugar granola', '1 tbsp walnuts'],
    steps: ['Spoon half the yogurt into a glass or bowl.', 'Add a layer of berries and granola.', 'Repeat the layers and finish with walnuts.'],
  },
  {
    id: 'r4', name: 'Banana-PB Smoothie', meal: 'breakfast', minutes: 5, servings: 1,
    calories: 380, protein: 22, carbs: 48, fat: 12, tags: ['vegetarian', '15-min'],
    ingredients: ['1 banana', '1 tbsp peanut butter', '1 cup milk', '1/2 cup Greek yogurt', 'Handful of ice', 'Pinch of cinnamon'],
    steps: ['Add everything to a blender.', 'Blend for about 45 seconds until smooth.'],
  },
  {
    id: 'r5', name: 'Avocado Egg Toast', meal: 'breakfast', minutes: 10, servings: 1,
    calories: 360, protein: 15, carbs: 30, fat: 21, tags: ['vegetarian', '15-min'],
    ingredients: ['1 slice whole-grain bread', '1/2 avocado', '1 egg', 'Squeeze of lemon', 'Pinch of chili flakes'],
    steps: ['Toast the bread.', 'Mash the avocado with lemon and spread it on the toast.', 'Fry or poach the egg.', 'Top the toast with the egg and chili flakes.'],
  },

  // Lunch
  {
    id: 'r6', name: 'Chickpea Quinoa Salad', meal: 'lunch', minutes: 30, servings: 4,
    calories: 380, protein: 13, carbs: 50, fat: 15, tags: ['vegetarian', 'make-ahead', 'gluten-free'],
    ingredients: ['1 cup dry quinoa', '1 can chickpeas, drained and rinsed', '1 cucumber', '1 cup cherry tomatoes', '1/4 red onion', '1/4 cup feta', '2 tbsp olive oil', '1 lemon, juiced', 'Fresh parsley'],
    steps: ['Cook the quinoa and let it cool.', 'Chop the cucumber, tomatoes, onion and parsley.', 'Toss everything with the oil and lemon juice.'],
  },
  {
    id: 'r7', name: 'Chicken & Veg Wrap', meal: 'lunch', minutes: 10, servings: 1,
    calories: 420, protein: 35, carbs: 38, fat: 14, tags: ['high-protein', '15-min'],
    ingredients: ['1 whole-wheat tortilla', '3 oz cooked chicken', '2 tbsp hummus', 'Lettuce', 'Sliced tomato', 'Sliced cucumber', 'Shredded carrot'],
    steps: ['Spread the hummus over the tortilla.', 'Layer on the chicken and vegetables.', 'Roll up tightly and slice in half.'],
  },
  {
    id: 'r8', name: 'Lentil Soup', meal: 'lunch', minutes: 45, servings: 6,
    calories: 280, protein: 16, carbs: 42, fat: 5, tags: ['make-ahead', 'one-pot'],
    ingredients: ['1 1/2 cups dry lentils', '1 onion, diced', '2 carrots, diced', '2 celery stalks, diced', '3 garlic cloves, minced', '1 can diced tomatoes', '6 cups low-sodium broth', '1 tbsp oil', '1 tsp cumin', '2 handfuls spinach'],
    steps: ['Saute the onion, carrot, celery and garlic in oil for 5 minutes.', 'Add the lentils, tomatoes, broth and cumin.', 'Simmer for 25-30 minutes until the lentils are tender.', 'Stir in the spinach until wilted.'],
  },
  {
    id: 'r9', name: 'Tuna White-Bean Salad', meal: 'lunch', minutes: 10, servings: 2,
    calories: 330, protein: 30, carbs: 25, fat: 12, tags: ['high-protein', '15-min', 'gluten-free'],
    ingredients: ['1 can tuna in water, drained', '1 can cannellini beans, drained and rinsed', '1/2 red onion, diced', '1 celery stalk, diced', '1 tbsp olive oil', '1 lemon, juiced', 'Fresh parsley', 'Salad greens'],
    steps: ['Mix the tuna, beans, onion, celery and parsley.', 'Dress with the oil and lemon juice.', 'Serve over the greens.'],
  },
  {
    id: 'r10', name: 'Turkey & Black Bean Burrito Bowl', meal: 'lunch', minutes: 25, servings: 4,
    calories: 480, protein: 32, carbs: 52, fat: 15, tags: ['high-protein', 'make-ahead'],
    ingredients: ['1 lb 93% lean ground turkey', '1 can black beans, drained and rinsed', '2 cups cooked brown rice', '1 cup corn', 'Salsa', 'Shredded lettuce', '1/2 avocado, sliced', '2 tbsp taco seasoning'],
    steps: ['Brown the turkey with the taco seasoning.', 'Warm the beans and corn.', 'Divide the rice into bowls.', 'Top with turkey, beans, corn, lettuce, salsa and avocado.'],
  },

  // Dinner
  {
    id: 'r11', name: 'Sheet-Pan Salmon & Veg', meal: 'dinner', minutes: 35, servings: 2,
    calories: 480, protein: 34, carbs: 30, fat: 24, tags: ['high-protein', 'gluten-free'],
    ingredients: ['2 salmon fillets (4 oz each)', '2 cups broccoli florets', '1 sweet potato, cubed', '1 tbsp olive oil', '1 lemon', '2 garlic cloves, minced'],
    steps: ['Heat the oven to 425°F (220°C).', 'Toss the sweet potato with half the oil and roast for 10 minutes.', 'Add the broccoli and salmon, drizzle with the remaining oil and garlic.', 'Roast 12-15 minutes more until the salmon flakes.', 'Finish with a squeeze of lemon.'],
  },
  {
    id: 'r12', name: 'Chicken Stir-Fry with Brown Rice', meal: 'dinner', minutes: 30, servings: 4,
    calories: 450, protein: 33, carbs: 50, fat: 12, tags: ['high-protein', 'make-ahead'],
    ingredients: ['1 lb chicken breast, sliced', '4 cups mixed vegetables', '2 tbsp low-sodium soy sauce', '1 tbsp sesame oil', '1 tbsp grated ginger', '2 garlic cloves, minced', '3 cups cooked brown rice'],
    steps: ['Heat the sesame oil in a wok or large pan.', 'Sear the chicken for 5 minutes.', 'Add the vegetables, ginger and garlic and cook 4 minutes.', 'Stir in the soy sauce.', 'Serve over the rice.'],
  },
  {
    id: 'r13', name: 'Turkey Meatballs & Whole-Wheat Pasta', meal: 'dinner', minutes: 40, servings: 4,
    calories: 520, protein: 36, carbs: 58, fat: 15, tags: ['high-protein'],
    ingredients: ['1 lb lean ground turkey', '1 egg', '1/4 cup breadcrumbs', '8 oz whole-wheat pasta', '2 cups marinara sauce', '2 handfuls spinach'],
    steps: ['Heat the oven to 400°F (200°C).', 'Mix the turkey, egg and breadcrumbs and roll into meatballs.', 'Bake for 18 minutes.', 'Cook the pasta while the meatballs bake.', 'Simmer the meatballs and spinach in the marinara.', 'Serve over the pasta.'],
  },
  {
    id: 'r14', name: 'Black Bean Veggie Chili', meal: 'dinner', minutes: 45, servings: 6,
    calories: 310, protein: 15, carbs: 48, fat: 7, tags: ['vegan', 'gluten-free', 'make-ahead'],
    ingredients: ['2 cans black beans, drained and rinsed', '1 can kidney beans, drained and rinsed', '1 can diced tomatoes', '1 onion, diced', '1 bell pepper, diced', '1 zucchini, diced', '1 tbsp chili powder', '1 tsp cumin', '1 tbsp oil'],
    steps: ['Saute the onion, pepper and zucchini in oil until soft.', 'Add the beans, tomatoes and spices.', 'Simmer for 30 minutes, stirring now and then.'],
  },
  {
    id: 'r15', name: 'Tofu Veggie Curry', meal: 'dinner', minutes: 30, servings: 4,
    calories: 420, protein: 18, carbs: 45, fat: 19, tags: ['vegan'],
    ingredients: ['14 oz firm tofu, cubed', '1 can light coconut milk', '2 tbsp curry paste (check the label for shrimp or fish if vegan)', '3 cups mixed vegetables', '2 cups cooked rice'],
    steps: ['Pan-fry the tofu until golden, then set aside.', 'Simmer the curry paste, coconut milk and vegetables for 10 minutes.', 'Stir the tofu back in.', 'Serve with the rice.'],
  },
  {
    id: 'r16', name: 'Shrimp Tacos with Slaw', meal: 'dinner', minutes: 20, servings: 2,
    calories: 400, protein: 30, carbs: 40, fat: 13, tags: ['high-protein', 'gluten-free'],
    ingredients: ['8 oz shrimp, peeled', '4 corn tortillas', '2 cups cabbage slaw', '1/4 avocado, sliced', '1 lime', 'Greek-yogurt sauce', '1 tsp chili powder'],
    steps: ['Season the shrimp with chili powder.', 'Sear for 2 minutes per side.', 'Warm the tortillas.', 'Fill with slaw, shrimp, avocado and yogurt sauce.', 'Finish with a squeeze of lime.'],
  },

  // Snacks
  {
    id: 'r17', name: 'Apple + Peanut Butter', meal: 'snack', minutes: 2, servings: 1,
    calories: 200, protein: 4, carbs: 27, fat: 8, tags: ['vegan', 'gluten-free', '15-min'],
    ingredients: ['1 medium apple', '1 tbsp peanut butter'],
    steps: ['Slice the apple.', 'Serve with the peanut butter for dipping.'],
  },
  {
    id: 'r18', name: 'Hummus & Veg Sticks', meal: 'snack', minutes: 5, servings: 1,
    calories: 150, protein: 5, carbs: 16, fat: 7, tags: ['vegan', 'gluten-free', '15-min'],
    ingredients: ['1/4 cup hummus', '1 1/2 cups carrot, cucumber and pepper sticks'],
    steps: ['Cut the vegetables into sticks.', 'Serve with the hummus.'],
  },
  {
    id: 'r19', name: 'Roasted Chickpeas', meal: 'snack', minutes: 40, servings: 4,
    calories: 140, protein: 6, carbs: 20, fat: 4, tags: ['vegan', 'gluten-free', 'make-ahead'],
    ingredients: ['1 can chickpeas, drained and rinsed', '1 tsp oil', 'Spices of your choice'],
    steps: ['Heat the oven to 400°F (200°C).', 'Pat the chickpeas very dry.', 'Toss with the oil and spices.', 'Roast for 25-30 minutes until crunchy.'],
  },
  {
    id: 'r20', name: 'Cottage Cheese & Pineapple', meal: 'snack', minutes: 2, servings: 1,
    calories: 180, protein: 21, carbs: 18, fat: 2, tags: ['vegetarian', 'high-protein', 'gluten-free', '15-min'],
    ingredients: ['3/4 cup low-fat cottage cheese', '1/2 cup pineapple chunks'],
    steps: ['Spoon the cottage cheese into a bowl.', 'Top with the pineapple.'],
  },
  {
    id: 'r21', name: 'Trail Mix', meal: 'snack', minutes: 2, servings: 1,
    calories: 170, protein: 5, carbs: 14, fat: 11, tags: ['vegan', 'gluten-free', '15-min'],
    ingredients: ['2 tbsp almonds', '1 tbsp pumpkin seeds', '1 tbsp raisins'],
    steps: ['Mix everything together.', 'Pack it in a small container for later.'],
  },
];
