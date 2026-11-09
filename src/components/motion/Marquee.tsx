// Slow strip of technology names. Pure CSS: pauses on hover/focus, still under
// reduced motion. The list is duplicated so the loop is seamless; the copy is hidden
// from assistive tech.
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t) => (
        <li key={t} className="whitespace-nowrap font-mono text-sm text-muted">
          {t}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className="marquee relative overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-label={label}
      role="region"
    >
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
