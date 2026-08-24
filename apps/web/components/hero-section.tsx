import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="public-hero" aria-label="Platform overview">
      <p className="eyebrow">Public Environmental Board · Bangladesh</p>
      <h1>Environmental signals, open to everyone.</h1>
      <p>
        Browse active alerts, verified citizen reports, environmental datasets,
        biodiversity records, and restoration projects — no login required.
        Sign in to contribute, submit reports, or download datasets.
      </p>
      <div className="button-row">
        <a className="button" href="#dashboard">
          View dashboard
        </a>
        <Link className="button ghost" href="/login">
          Sign in to contribute
        </Link>
      </div>
    </section>
  );
}
