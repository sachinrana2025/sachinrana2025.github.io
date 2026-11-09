import { LegacyRedirect, legacyMetadata } from '@/components/LegacyRedirect';

export const metadata = legacyMetadata('/expertise#iiot');

export default function Page() {
  return <LegacyRedirect to="/expertise#iiot" label="Expertise: Industrial IoT" />;
}
