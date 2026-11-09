import { LegacyRedirect, legacyMetadata } from '@/components/LegacyRedirect';

export const metadata = legacyMetadata('/about');

export default function Page() {
  return <LegacyRedirect to="/about" label="About" />;
}
