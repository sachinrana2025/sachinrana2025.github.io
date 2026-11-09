import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from './ui';

// Old v3 routes. nginx answers these with a 301; this page covers static hosts without
// rewrite rules (meta refresh, canonical to the new URL, excluded from indexing).
export function legacyMetadata(target: string): Metadata {
  return {
    title: 'Page moved',
    alternates: { canonical: target.split('#')[0] },
    robots: { index: false, follow: true },
  };
}

export function LegacyRedirect({ to, label }: { to: string; label: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <Container className="py-24">
        <p className="text-muted">
          This page has moved to{' '}
          <Link href={to} className="text-accent underline underline-offset-4">
            {label}
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
