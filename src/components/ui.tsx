import type { ReactNode } from 'react';
import type { Profile } from '../data/types';
import { periodLabel, shiftPeriod, todayISO, type Period } from '../lib/dates';

export function Ring({ value, max, label, sub, color, size = 112 }: { value: number; max: number; label: string; sub?: string; color: string; size?: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div className="ring-wrap">
      <div className="ring" style={{ ['--size' as string]: `${size}px` }} role="img" aria-label={`${label}: ${Math.round(pct * 100)}%`}>
        <svg viewBox="0 0 120 120">
          <circle className="ring-track" cx="60" cy="60" r={r} />
          <circle className="ring-fill" cx="60" cy="60" r={r} style={{ stroke: color }} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
        </svg>
        <div className="ring-label">
          <span className="stat-value">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <div className="stat-label">{label}</div>
      {sub && <div className="small muted nums">{sub}</div>}
    </div>
  );
}

export function BarChart({ data, color, unit = '', height = 160 }: { data: { label: string; value: number }[]; color: string; unit?: string; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const w = 100 / Math.max(data.length, 1);
  const showEvery = data.length > 16 ? Math.ceil(data.length / 10) : 1;
  return (
    <div className="chart" role="img" aria-label={`Bar chart, max ${Math.round(max)}${unit}`}>
      <svg width="100%" height={height + 22} viewBox={`0 0 100 ${height + 22}`} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1="0" x2="100" y1={height - height * g} y2={height - height * g} stroke="var(--chart-grid)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
        ))}
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 6);
          return (
            <rect key={i} x={i * w + w * 0.18} width={w * 0.64} y={height - h} height={Math.max(h, d.value > 0 ? 1.5 : 0)} rx="0.8" fill={color}>
              <title>{`${d.label}: ${Math.round(d.value)}${unit}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="chart-labels">
        {data.map((d, i) => (
          <span key={i} style={{ width: `${w}%` }}>
            {i % showEvery === 0 ? d.label : ''}
          </span>
        ))}
      </div>
      <div className="small muted">{data.some((d) => d.value > 0) ? `Peak: ${Math.round(max).toLocaleString()}${unit}` : 'No entries yet for this period'}</div>
    </div>
  );
}

export function PeriodPicker({ period, anchor, onChange }: { period: Period; anchor: string; onChange: (p: Period, anchor: string) => void }) {
  const periods: Period[] = ['day', 'week', 'month', 'year'];
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="tabs" role="tablist" aria-label="Time period">
        {periods.map((p) => (
          <button key={p} role="tab" aria-selected={p === period} className={`tab${p === period ? ' active' : ''}`} onClick={() => onChange(p, anchor)}>
            {p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="icon-btn" aria-label="Previous" onClick={() => onChange(period, shiftPeriod(period, anchor, -1))}>
          ‹
        </button>
        <strong>{periodLabel(period, anchor)}</strong>
        <div className="row" style={{ gap: 4 }}>
          {anchor !== todayISO() && (
            <button className="btn btn-ghost btn-sm" onClick={() => onChange(period, todayISO())}>
              Today
            </button>
          )}
          <button className="icon-btn" aria-label="Next" onClick={() => onChange(period, shiftPeriod(period, anchor, 1))}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export function Avatar({ profile, large }: { profile: Pick<Profile, 'display_name' | 'avatar_color'>; large?: boolean }) {
  const initials = profile.display_name
    .replace(/\([^)]*\)/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s.match(/\p{L}|\d/u)?.[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <span className={`avatar${large ? ' avatar-lg' : ''}`} style={{ background: profile.avatar_color }} aria-hidden="true">
      {initials || '?'}
    </span>
  );
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-art" aria-hidden="true" />
      <span className="empty-title">{title}</span>
      {children && <p className="muted">{children}</p>}
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  return message ? (
    <div className="toast" role="status">
      {message}
    </div>
  ) : null;
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title" style={{ margin: 0 }}>
            {title}
          </h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
