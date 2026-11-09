import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>;
}

export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
      {index && <span className="text-accent">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-line-strong" />}
      <span>{children}</span>
    </p>
  );
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
  tone = 'paper',
}: {
  id?: string;
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: 'paper' | 'surface';
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cx(
        'scroll-mt-20 border-t border-line py-20 sm:py-24',
        tone === 'surface' && 'bg-surface',
        className,
      )}
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Eyebrow index={index}>{eyebrow}</Eyebrow>
            <h2
              id={id ? `${id}-title` : undefined}
              className="mt-4 font-serif text-3xl leading-[1.1] tracking-tight text-ink sm:text-4xl"
            >
              {title}
            </h2>
          </div>
          {intro && (
            <div className="text-base leading-relaxed text-muted sm:text-lg lg:col-span-7 lg:col-start-6 lg:pt-8">
              {intro}
            </div>
          )}
        </div>
        <div className="mt-12 sm:mt-14">{children}</div>
      </Container>
    </section>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  external?: boolean;
  download?: boolean;
};

export function ButtonLink({ href, children, variant = 'primary', className, external, download }: ButtonProps) {
  const styles = {
    primary:
      'bg-ink text-paper hover:bg-ink-2 px-5 py-3 rounded-md border border-ink',
    secondary:
      'border border-line-strong text-ink hover:border-ink px-5 py-3 rounded-md bg-surface',
    text: 'text-accent hover:underline underline-offset-4 px-0 py-1',
  }[variant];
  const cls = cx(
    'group inline-flex items-center gap-2 text-sm font-medium transition-colors',
    styles,
    className,
  );
  const content = (
    <>
      {children}
      {variant !== 'secondary' && !download && (
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );
  const isPlain = external || download || href.startsWith('mailto:') || href.endsWith('.pdf');
  if (isPlain) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download: 'Sachin_Rana_CV.pdf' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-line bg-sunken px-2 py-0.5 font-mono text-[11px] leading-5 text-ink-2">
      {children}
    </span>
  );
}

export function TagList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden">
      <div aria-hidden className="blueprint absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative pb-16 pt-16 sm:pb-20 sm:pt-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
          {title}
        </h1>
        <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</div>
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}
