import { LegacyRedirect, legacyMetadata } from '@/components/LegacyRedirect';

export const metadata = legacyMetadata('/engage');

export default function Page() {
  return <LegacyRedirect to="/engage" label="Engage" />;
}
