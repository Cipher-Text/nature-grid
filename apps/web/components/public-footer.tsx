import Link from 'next/link';

export default function PublicFooter() {
  return (
    <div
      className="public-footer"
      role="complementary"
      aria-label="Sign in prompt"
    >
      <div>
        <h2>Ready to contribute?</h2>
        <p>
          Sign in to submit reports, log observations, join restoration projects,
          download datasets, and track your environmental impact across Bangladesh.
        </p>
      </div>
      <Link className="button" href="/register">
        Create a free account
      </Link>
    </div>
  );
}
