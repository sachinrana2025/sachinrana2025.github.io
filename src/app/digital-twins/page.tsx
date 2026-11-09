import { LegacyRedirect, legacyMetadata } from '@/components/LegacyRedirect';

export const metadata = legacyMetadata('/twins');

export default function Page() {
  return <LegacyRedirect to="/twins" label="Digital Twins" />;
}
