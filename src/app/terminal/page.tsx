import { LegacyRedirect, legacyMetadata } from '@/components/LegacyRedirect';

export const metadata = legacyMetadata('/work');

export default function Page() {
  return <LegacyRedirect to="/work" label="Work" />;
}
