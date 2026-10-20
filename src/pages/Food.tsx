import { useMemo, useState, type FormEvent } from 'react';
import { Empty, Modal, Ring, Toast } from '../components/ui';
import { FOODS } from '../data/foods';
import { RECIPES } from '../data/recipes';
import { TIPS } from '../data/tips';
import type { FoodItem, Meal, MealType, Recipe } from '../data/types';
import { useAuth } from '../lib/auth';
import { data } from '../lib/data';
import { addDays, friendlyDate, todayISO } from '../lib/dates';
import { useRows, useToast } from '../lib/hooks';
import { fmt, sumBy } from '../lib/stats';
import Icon from '../components/Icon';

const MEALS: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snacks' },
];

interface Entry {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  servings: string;
}

const emptyEntry: Entry = { name: '', calories: '', protein: '', carbs: '', fat: '', servings: '1' };

export default function Food() {
  const { me: profile } = useAuth();
  const [date, setDate] = useState(todayISO());
  const meals = useRows<Meal>('meals', { from: date, to: date });
  const recent = useRows<Meal>('meals', { from: addDays(todayISO(), -21), to: todayISO() });
  const toast = useToast();
  const [adding, setAdding] = useState<MealType | null>(null);
  const [query, setQuery] = useState('');
  const [entry, setEntry] = useState<Entry>(emptyEntry);
  const [recipeMeal, setRecipeMeal] = useState<MealType | 'all'>('all');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [allRecipes, setAllRecipes] = useState(false);

  const totals = {
    calories: sumBy(meals.rows, (m) => m.calories),
    protein: sumBy(meals.rows, (m) => m.protein),
    carbs: sumBy(meals.rows, (m) => m.carbs),
    fat: sumBy(meals.rows, (m) => m.fat),
  };
  const goalCal = profile?.goal_calories ?? 2000;
  const goalProtein = profile?.goal_protein ?? 100;

  // Recently logged items, most frequent first, for one-tap re-logging.
  const recents = useMemo(() => {
    const seen = new Map<string, { meal: Meal; count: number }>();
    for (const m of recent.rows) {
      const k = m.name.toLowerCase();
      const cur = seen.get(k);
      seen.set(k, { meal: m, count: (cur?.count ?? 0) + 1 });
    }
    return [...seen.values()].sort((a, b) => b.count - a.count).slice(0, 8).map((x) => x.meal);
  }, [recent.rows]);

  const results = query.trim() ? FOODS.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12) : FOODS.slice(0, 8);

  async function logItem(meal: MealType, item: { name: string; calories: number; protein: number; carbs: number; fat: number }, servings = 1) {
    const row = await data.insert<Meal>('meals', {
      date,
      meal,
      name: item.name,
      servings,
      calories: Math.round(item.calories * servings),
      protein: Math.round(item.protein * servings * 10) / 10,
      carbs: Math.round(item.carbs * servings * 10) / 10,
      fat: Math.round(item.fat * servings * 10) / 10,
    });
    meals.setRows((r) => [...r, row]);
    recent.setRows((r) => [...r, row]);
    toast.show(`Added ${item.name}`);
  }

  async function logCustom(e: FormEvent) {
    e.preventDefault();
    if (!adding || !entry.name.trim()) return;
    const s = Number(entry.servings) || 1;
    await logItem(adding, { name: entry.name.trim(), calories: Number(entry.calories) || 0, protein: Number(entry.protein) || 0, carbs: Number(entry.carbs) || 0, fat: Number(entry.fat) || 0 }, s);
    setEntry(emptyEntry);
  }

  async function remove(m: Meal) {
    meals.setRows((r) => r.filter((x) => x.id !== m.id));
    recent.setRows((r) => r.filter((x) => x.id !== m.id));
    await data.remove('meals', m.id);
  }

  const perServing = (m: Meal) => ({ name: m.name, calories: m.calories / m.servings, protein: m.protein / m.servings, carbs: m.carbs / m.servings, fat: m.fat / m.servings });
  const recipes = RECIPES.filter((r) => recipeMeal === 'all' || r.meal === recipeMeal);
  const tips = TIPS.slice(0, 3);

  return (
    <div className="page stack accent-food">
      <header className="page-header">
        <div>
          <p className="muted small"><span className="pill-food">Food diary</span></p>
          <h1>{friendlyDate(date)}</h1>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="icon-btn" aria-label="Previous day" onClick={() => setDate(addDays(date, -1))}><Icon name="chevron-left" /></button>
          <input className="input date-input" type="date" aria-label="Pick a date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
          <button className="icon-btn" aria-label="Next day" onClick={() => setDate(addDays(date, 1))}><Icon name="chevron-right" /></button>
        </div>
      </header>

      <section className="card rings-card" aria-label="Today's nutrition">
        <Ring value={totals.calories} max={goalCal} label="Calories" sub={`${fmt(totals.calories)} / ${fmt(goalCal)} kcal`} color="var(--c-food)" />
        <Ring value={totals.protein} max={goalProtein} label="Protein" sub={`${fmt(totals.protein)} / ${goalProtein} g`} color="var(--chart-2)" />
        <div className="stack macros">
          {(['carbs', 'fat'] as const).map((k) => (
            <div key={k} className="stack" style={{ gap: 4 }}>
              <div className="row small" style={{ justifyContent: 'space-between' }}>
                <span>{k === 'carbs' ? 'Carbs' : 'Fat'}</span>
                <span className="muted">{fmt(totals[k])} g</span>
              </div>
              <div className="progress"><div className="progress-bar" style={{ width: `${Math.min(100, (totals[k] / (k === 'carbs' ? (goalCal * 0.5) / 4 : (goalCal * 0.3) / 9)) * 100)}%`, background: k === 'carbs' ? 'var(--chart-3)' : 'var(--chart-4)' }} /></div>
            </div>
          ))}
          <p className="small muted">Remaining: {fmt(Math.max(0, goalCal - totals.calories))} kcal</p>
        </div>
      </section>

      <div className="grid-2">
        {MEALS.map((m) => {
          const items = meals.rows.filter((x) => x.meal === m.id);
          return (
            <section key={m.id} className="card stack" aria-labelledby={`meal-${m.id}`}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 id={`meal-${m.id}`} className="card-title" style={{ margin: 0 }}>{m.label}</h2>
                <span className="small muted">{fmt(sumBy(items, (x) => x.calories))} kcal</span>
              </div>
              {items.length === 0 ? (
                <p className="muted small">Nothing logged yet.</p>
              ) : (
                <ul className="list">
                  {items.map((x) => (
                    <li key={x.id} className="list-item">
                      <div className="stack" style={{ gap: 0 }}>
                        <span>{x.name}{x.servings !== 1 ? ` × ${x.servings}` : ''}</span>
                        <span className="small muted">P {fmt(x.protein)} · C {fmt(x.carbs)} · F {fmt(x.fat)} g</span>
                      </div>
                      <span className="small">{fmt(x.calories)} kcal</span>
                      <button className="icon-btn" aria-label={`Remove ${x.name}`} onClick={() => remove(x)}><Icon name="close" size={18} /></button>
                    </li>
                  ))}
                </ul>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => { setAdding(m.id); setQuery(''); }}>+ Add to {m.label.toLowerCase()}</button>
            </section>
          );
        })}
      </div>

      <section className="stack" aria-labelledby="recipes-title">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="recipes-title" className="card-title" style={{ margin: 0 }}>Healthy recipes</h2>
          <div className="tabs" role="tablist" aria-label="Meal">
            {(['all', ...MEALS.map((m) => m.id)] as (MealType | 'all')[]).map((k) => (
              <button key={k} role="tab" aria-selected={recipeMeal === k} className={`tab${recipeMeal === k ? ' active' : ''}`} onClick={() => setRecipeMeal(k)}>
                {k === 'all' ? 'All' : MEALS.find((m) => m.id === k)!.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid-3">
          {(allRecipes ? recipes : recipes.slice(0, 6)).map((r) => (
            <article key={r.id} className="card stack recipe-card">
              <div className="row" style={{ gap: 6 }}>
                <span className="badge">{r.minutes} min</span>
                {r.tags.slice(0, 2).map((t) => <span key={t} className="badge">{t}</span>)}
              </div>
              <h3 className="card-title" style={{ margin: 0 }}>{r.name}</h3>
              <p className="small muted">{r.calories} kcal · {r.protein} g protein per serving</p>
              <div className="row">
                <button className="btn btn-ghost btn-sm" onClick={() => setRecipe(r)}>View recipe</button>
                <button className="btn btn-primary btn-sm" onClick={() => logItem(r.meal, r)}>Log 1 serving</button>
              </div>
            </article>
          ))}
        </div>
        {recipes.length > 6 && (
          <button className="btn btn-ghost" style={{ alignSelf: 'center' }} onClick={() => setAllRecipes(!allRecipes)}>
            {allRecipes ? 'Show fewer recipes' : `Show all ${recipes.length} recipes`}
          </button>
        )}
      </section>

      <section className="grid-3">
        {tips.map((t) => (
          <article key={t.id} className="card tip-card">
            <h3 className="card-title">{t.title}</h3>
            <p className="small">{t.body}</p>
            {t.source && <p className="small muted">{t.source}</p>}
          </article>
        ))}
      </section>

      {adding && (
        <Modal title={`Add to ${MEALS.find((m) => m.id === adding)!.label.toLowerCase()}`} onClose={() => setAdding(null)}>
          {recents.length > 0 && (
            <div className="stack" style={{ gap: 6 }}>
              <span className="label">Recent</span>
              <div className="row" style={{ gap: 6 }}>
                {recents.map((m) => (
                  <button key={m.id} className="chip" onClick={() => logItem(adding, perServing(m), m.servings)}>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor="food-search">Search foods</label>
            <input id="food-search" className="input" placeholder="Try banana, oats, salmon…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <ul className="list food-results">
            {results.map((f: FoodItem) => (
              <li key={f.name} className="list-item">
                <div className="stack" style={{ gap: 0 }}>
                  <span>{f.name}</span>
                  <span className="small muted">{f.serving} · {f.calories} kcal · P {f.protein} g</span>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => logItem(adding, f)}>Add</button>
              </li>
            ))}
            {results.length === 0 && <li className="muted small">No match. Add it yourself below.</li>}
          </ul>
          <form className="stack" onSubmit={logCustom}>
            <span className="label">Or enter your own</span>
            <input id="c-name" className="input" placeholder="Food name" aria-label="Food name" required value={entry.name} onChange={(e) => setEntry({ ...entry, name: e.target.value })} />
            <div className="row custom-macros">
              {(['calories', 'protein', 'carbs', 'fat', 'servings'] as const).map((k) => (
                <input key={k} id={`c-${k}`} className="input" type="number" min="0" step="any" aria-label={k} placeholder={k === 'calories' ? 'kcal' : k === 'servings' ? 'servings' : `${k} g`} value={entry[k]} onChange={(e) => setEntry({ ...entry, [k]: e.target.value })} />
              ))}
            </div>
            <button className="btn btn-primary">Add food</button>
          </form>
        </Modal>
      )}

      {recipe && (
        <Modal title={recipe.name} onClose={() => setRecipe(null)}>
          <p className="small muted">
            {recipe.minutes} min · {recipe.servings} serving{recipe.servings > 1 ? 's' : ''} · per serving {recipe.calories} kcal, P {recipe.protein} g, C {recipe.carbs} g, F {recipe.fat} g
          </p>
          <h3 className="label">Ingredients</h3>
          <ul className="recipe-list">{recipe.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
          <h3 className="label">Steps</h3>
          <ol className="recipe-list">{recipe.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          <p className="small muted">Nutrition values are estimates.</p>
          <button className="btn btn-primary" onClick={() => { logItem(recipe.meal, recipe); setRecipe(null); }}>
            Log 1 serving to {recipe.meal}
          </button>
        </Modal>
      )}
      {empty(meals.rows.length, meals.loading)}
      <Toast message={toast.message} />
    </div>
  );
}

function empty(count: number, loading: boolean) {
  return !loading && count === 0 ? (
    <Empty title="Fresh page, fresh plate">Tap "Add" under a meal, pick a recipe, or reuse something you ate recently.</Empty>
  ) : null;
}
