import EmergencyBanner from '../../components/emergency-banner';
import FloodRiskStrip from '../../components/flood-risk-strip';
import HeroSection from '../../components/hero-section';
import LiveWeatherStrip from '../../components/live-weather-strip';
import NationalClimateBand from '../../components/national-climate-band';
import MetricsSection from '../../components/metrics-section';
import CivicScienceSection from '../../components/civic-science-section';
import AirQualityGrid from '../../components/air-quality-grid';
import DatasetPreview from '../../components/dataset-preview';
import PersonaFooter from '../../components/persona-footer';
import PublicNav from '../../components/public-nav';

export default function HomePage() {
  return (
    <main>
      <PublicNav />
      {/* Safety alerts — both conditional (null when nothing active) */}
      <EmergencyBanner />
      <FloodRiskStrip />

      {/* Hero — compact heading + live stats bar + CTA buttons */}
      <HeroSection />

      {/* Live weather strip — hottest/coolest/rain right now across 64 districts */}
      <LiveWeatherStrip />

      {/* 8-division climate snapshot — 30-day rolling averages */}
      <NationalClimateBand />

      {/* Platform counts — anchored at #dashboard */}
      <MetricsSection />

      {/* Civic activity & science — tabbed: Reports / Alerts / Biodiversity / Restoration */}
      <CivicScienceSection />

      {/* District air quality ranking (PM2.5) + dataset catalog */}
      <AirQualityGrid />
      <DatasetPreview />

      {/* Persona CTAs — Citizen / Researcher / NGO */}
      <PersonaFooter />
    </main>
  );
}
