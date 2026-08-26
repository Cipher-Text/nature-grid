import EmergencyBanner from '../../components/emergency-banner';
import FloodRiskStrip from '../../components/flood-risk-strip';
import HeroSection from '../../components/hero-section';
import NationalClimateBand from '../../components/national-climate-band';
import MetricsSection from '../../components/metrics-section';
import MapSection from '../../components/map-section';
import CivicScienceSection from '../../components/civic-science-section';
import AirQualityGrid from '../../components/air-quality-grid';
import DatasetPreview from '../../components/dataset-preview';
import PersonaFooter from '../../components/persona-footer';

export default function HomePage() {
  return (
    <main>
      {/* ── TIER 1: Safety-first header band ───────────────────────────────────
          Emergency banner + flood strip both render conditionally (null when
          no active alerts / no at-risk districts). Hero always renders and
          now carries live platform metrics. */}
      <EmergencyBanner />
      <FloodRiskStrip />
      <HeroSection />

      {/* 8-division climate snapshot — renders only when climate data is available */}
      <NationalClimateBand />

      {/* Platform-wide counts — anchored at #dashboard for skip-link targets */}
      <MetricsSection />

      {/* ── TIER 2: Geo-environmental explorer ─────────────────────────────────
          Leaflet map (ssr: false) + conditions sidebar, anchored at #map */}
      <MapSection />

      {/* ── TIER 3: Civic activity & science (tabbed) ──────────────────────────
          Reports / Alerts / Biodiversity / Restoration in a single compact
          block — tab state handled client-side, data fetched server-side */}
      <CivicScienceSection />

      {/* ── TIER 4: Data transparency ───────────────────────────────────────────
          PM2.5 district ranking (conditional) then the dataset catalog */}
      <AirQualityGrid />
      <DatasetPreview />

      {/* ── TIER 5: Persona-based CTA footer ────────────────────────────────────
          Citizen / Researcher / NGO onboarding cards replace the generic
          "Ready to contribute?" strip */}
      <PersonaFooter />
    </main>
  );
}
