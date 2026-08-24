import HeroSection from '../../components/hero-section';
import MetricsSection from '../../components/metrics-section';
import MapSection from '../../components/map-section';
import DatasetPreview from '../../components/dataset-preview';
import ReportsAlertsSection from '../../components/reports-alerts-section';
import BiodiversityRestoration from '../../components/biodiversity-restoration';
import PublicFooter from '../../components/public-footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MetricsSection />
      <MapSection />
      <DatasetPreview />
      <ReportsAlertsSection />
      <BiodiversityRestoration />
      <PublicFooter />
    </main>
  );
}
