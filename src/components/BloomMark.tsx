export default function BloomMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2">
        <circle cx="20" cy="9" r="7" fill="var(--c-planner)" />
        <circle cx="30.5" cy="16" r="7" fill="var(--brand)" />
        <circle cx="27" cy="28.5" r="7" fill="var(--c-food)" />
        <circle cx="13" cy="28.5" r="7" fill="var(--c-workout)" />
        <circle cx="9.5" cy="16" r="7" fill="var(--sun)" />
        <circle cx="20" cy="20" r="6" fill="var(--surface)" />
      </g>
    </svg>
  );
}
