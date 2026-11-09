import { LegacyRedirect, legacyMetadata } from '@/components/LegacyRedirect';

export const metadata = legacyMetadata('/expertise#cloud');

export default function Page() {
  return <LegacyRedirect to="/expertise#cloud" label="Expertise: Cloud" />;
}
