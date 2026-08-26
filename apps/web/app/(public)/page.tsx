import EmergencyBanner from '../../components/emergency-banner';
import HeroSection from '../../components/hero-section';
import NationalClimateBand from '../../components/national-climate-band';
import MetricsSection from '../../components/metrics-section';
import MapSection from '../../components/map-section';
import FloodRiskStrip from '../../components/flood-risk-strip';
import AirQualityGrid from '../../components/air-quality-grid';
import ReportsAlertsSection from '../../components/reports-alerts-section';
import BiodiversityRestoration from '../../components/biodiversity-restoration';
import DatasetPreview from '../../components/dataset-preview';
import PublicFooter from '../../components/public-footer';

export default function HomePage() {
  return (
    <main>
      {/* Conditional — only renders when EMERGENCY alerts are active */}
      <EmergencyBanner />

      <HeroSection />

      {/* 8-division climate snapshot — renders only when climate data is available */}
      <NationalClimateBand />

      <MetricsSection />

      <MapSection />

      {/* Flood risk — renders only when ≥1 district exceeds discharge threshold */}
      <FloodRiskStrip />

      <ReportsAlertsSection />

      {/* PM2.5 ranking — renders only when districts have 30d climate data */}
      <AirQualityGrid />

      <BiodiversityRestoration />

      <DatasetPreview />

      <PublicFooter />
    </main>
  );
}
