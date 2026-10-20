// Daybloom mark: four soft petals that overlap into a quiet quatrefoil.
export default function BloomMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g fill="var(--brand)">
        <circle cx="20" cy="12.5" r="7.5" opacity="0.42" />
        <circle cx="27.5" cy="20" r="7.5" opacity="0.42" />
        <circle cx="20" cy="27.5" r="7.5" opacity="0.42" />
        <circle cx="12.5" cy="20" r="7.5" opacity="0.42" />
        <circle cx="20" cy="20" r="3.5" />
      </g>
    </svg>
  );
}
