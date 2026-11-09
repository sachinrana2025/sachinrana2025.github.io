// Public identity constants shared by layout metadata, JSON-LD, header and footer.
export const site = {
  name: 'Sachin Rana',
  role: 'Agentic AI Architect · Fractional CTO',
  roleLong: 'Principal Solutions Architect · Agentic AI & LLMOps Lead · Fractional CTO',
  // A personal profile, published on GitHub Pages. It names no company of its own;
  // the current role is the only employer shown outside the career timeline.
  current: { role: 'Infrastructure Lead', company: 'Brick AI' },
  url: 'https://sachinrana2025.github.io',
  email: 'sachin.rana@live.com',
  linkedin: 'https://www.linkedin.com/in/sachinrana2k11',
  location: 'New Delhi, India',
  cv: '/Sachin_Rana_CV.pdf',
  brief: '/engage#brief',
  description:
    'Agentic AI architect and Fractional CTO. I build AI agents, LLM platforms, industrial telemetry and live digital twins that solve real operational problems, on infrastructure you own.',
} as const;

export const nav = [
  { href: '/agents', label: 'Agentic AI' },
  { href: '/twins', label: 'Digital Twins' },
  { href: '/work', label: 'Work' },
  { href: '/expertise', label: 'Expertise' },
  { href: '/about', label: 'About' },
  { href: '/engage', label: 'Engage' },
] as const;

export function mailto(subject: string, body?: string): string {
  const q = `subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  return `mailto:${site.email}?${q}`;
}

// Deep link into the brief builder with a problem area pre-selected.
export function briefHref(area?: string): string {
  return area ? `/engage?area=${encodeURIComponent(area)}#brief` : '/engage#brief';
}
