import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/blocks';
import { site } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Agentic AI Architect & Fractional CTO`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    'Agentic AI',
    'AI agents',
    'Fractional CTO',
    'Principal Solutions Architect',
    'Cloud cost optimization',
    'Bare-metal repatriation',
    'Sovereign AI',
    'LLMOps',
    'Model Context Protocol',
    'ClickHouse',
    'Industrial IoT',
    'Digital twins',
    'SOC 2',
    'Infrastructure lead',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: site.url,
    siteName: site.name,
    title: `${site.name} · Agentic AI Architect & Fractional CTO`,
    description: site.description,
    locale: 'en_US',
    firstName: 'Sachin',
    lastName: 'Rana',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Sachin Rana, agentic AI architect and Fractional CTO' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} · Agentic AI Architect & Fractional CTO`,
    description: site.description,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.name,
      givenName: 'Sachin',
      familyName: 'Rana',
      jobTitle: 'Agentic AI Architect & Fractional CTO',
      description: site.description,
      url: site.url,
      email: `mailto:${site.email}`,
      image: `${site.url}/profile/sachin_rana.webp`,
      worksFor: { '@type': 'Organization', name: `${site.current.company} Inc.` },
      address: { '@type': 'PostalAddress', addressLocality: 'New Delhi', addressCountry: 'IN' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Lovely Professional University' },
      knowsAbout: [
        'Agentic AI systems',
        'Cloud architecture',
        'Infrastructure as code',
        'Large language model operations',
        'Model Context Protocol',
        'Industrial IoT',
        'ClickHouse',
        'Digital twins',
      ],
      sameAs: [site.linkedin],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { '@id': `${site.url}/#person` },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        <JsonLd data={structuredData} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
