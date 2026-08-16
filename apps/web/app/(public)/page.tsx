import HeroSection from '../../components/hero-section';
import MetricsSection from '../../components/metrics-section';
import MapSection from '../../components/map-section';
import DatasetPreview from '../../components/dataset-preview';
import ReportsAlertsSection from '../../components/reports-alerts-section';
import BiodiversityRestoration from '../../components/biodiversity-restoration';
import CommunitySection from '../../components/community-section';
import PublicFooter from '../../components/public-footer';

/**
 * Public board — accessible without login.
 *
 * All data is static seed while the backend is not yet implemented.
 * Replace the imports in lib/static-data.ts with fetch() calls
 * once the API endpoints are live (see docs/api/initial-api.md).
 */
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MetricsSection />
      <MapSection />
      <DatasetPreview />
      <ReportsAlertsSection />
      <BiodiversityRestoration />
      <CommunitySection />
      <PublicFooter />
    </main>
  );
}
