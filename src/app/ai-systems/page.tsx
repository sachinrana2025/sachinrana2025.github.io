import { LegacyRedirect, legacyMetadata } from '@/components/LegacyRedirect';

export const metadata = legacyMetadata('/agents');

export default function Page() {
  return <LegacyRedirect to="/agents" label="Agentic AI" />;
}
