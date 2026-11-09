import Link from 'next/link';
import { nav, site, mailto } from '@/lib/site';
import { Container } from './ui';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-serif text-2xl text-ink">{site.name}</p>
          <p className="mt-2 text-sm text-muted">{site.roleLong}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {site.current.role} at {site.current.company}. Based in {site.location}, working with clients worldwide.
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Site</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[{ href: '/', label: 'Home' }, ...nav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-2 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={mailto('Enquiry from your profile')} className="text-ink-2 hover:text-ink">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink-2 hover:text-ink">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.cv} download="Sachin_Rana_CV.pdf" className="text-ink-2 hover:text-ink">
                Download CV (PDF)
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p>Consulting only, never a competitor to client products. Client names withheld under NDA.</p>
      </Container>
    </footer>
  );
}
