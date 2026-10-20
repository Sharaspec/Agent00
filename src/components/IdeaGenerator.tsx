import { useState } from 'react';
import { IDEAS } from '../data/ideas';
import type { Idea, IdeaCategory } from '../data/types';

export const CATEGORY_LABELS: Record<IdeaCategory, string> = {
  move: 'Move',
  eat: 'Eat well',
  mind: 'Mind',
  social: 'Social',
  plan: 'Plan',
  rest: 'Rest',
  create: 'Create',
};

const pick = (pool: Idea[], not?: Idea) => {
  const options = pool.length > 1 ? pool.filter((i) => i.id !== not?.id) : pool;
  return options[Math.floor(Math.random() * options.length)];
};

export default function IdeaGenerator({ onAdd }: { onAdd: (idea: Idea) => void }) {
  const [filter, setFilter] = useState<IdeaCategory | 'all'>('all');
  const pool = filter === 'all' ? IDEAS : IDEAS.filter((i) => i.category === filter);
  const [idea, setIdea] = useState<Idea | undefined>(() => pick(IDEAS));
  const [spin, setSpin] = useState(0);

  const shuffle = (f = filter) => {
    const p = f === 'all' ? IDEAS : IDEAS.filter((i) => i.category === f);
    setIdea(pick(p, idea));
    setSpin((s) => s + 1);
  };

  return (
    <section className="card stack" aria-labelledby="idea-title">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 id="idea-title" className="card-title" style={{ margin: 0 }}>Idea generator</h2>
        <span className="small muted">{pool.length} ideas</span>
      </div>
      <div className="row" style={{ gap: 6 }}>
        {(['all', ...Object.keys(CATEGORY_LABELS)] as (IdeaCategory | 'all')[]).map((c) => (
          <button
            key={c}
            className={`chip${filter === c ? ' active' : ''}`}
            onClick={() => {
              setFilter(c);
              shuffle(c);
            }}
          >
            {c === 'all' ? 'Surprise me' : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      {idea && (
        <div key={spin} className={`idea-card${spin ? ' shuffle' : ''}`} aria-live="polite">
          <span className="idea-card-label">{CATEGORY_LABELS[idea.category]}{idea.minutes ? ` · ${idea.minutes} min` : ''}</span>
          <p className="idea-text">{idea.text}</p>
        </div>
      )}
      <div className="row">
        <button className="btn btn-ghost" onClick={() => shuffle()}>Shuffle</button>
        {idea && (
          <button className="btn btn-primary" onClick={() => onAdd(idea)}>
            Add to my day
          </button>
        )}
      </div>
    </section>
  );
}
