import "../dashboard.css";
import Link from "next/link";

export default function ResultsPage() {
  return (
    <>
      <header className="site-header">
        <Link className="logo" href="/dashboard">
          <span>sc</span>SiteCreator
        </Link>
        <nav aria-label="Main navigation">
          <Link className="current" href="/dashboard">
            Leads
          </Link>
          <Link href="/deployments">Deployments</Link>
          <Link href="/account">Account</Link>
        </nav>
      </header>

      <main className="app-page results-page">
        <Link className="back-link" href="/dashboard">
          ← Back to search
        </Link>

        <section className="page-heading compact">
          <p className="eyebrow">SEARCH RESULTS</p>
          <h1>Dentists in Manhattan</h1>
          <p>We found 12 local businesses. Start with the leads below.</p>
        </section>

        <div className="filter-row" aria-label="Lead filters">
          <button className="selected" type="button">
            All leads <span>12</span>
          </button>
          <button type="button">
            No site found <span>8</span>
          </button>
          <button type="button">
            Not deployed <span>10</span>
          </button>
        </div>

        <section className="result-cards" aria-label="Business leads">
          <article className="result-card">
            <div className="result-main">
              <span className="site-icon peach">B</span>
              <div>
                <h2>Bright Smile Dental</h2>
                <p>Dental practice · 0.7 mi away</p>
              </div>
            </div>
            <div className="result-contact">
              <span>PHONE</span>
              <p>(212) 555-0142</p>
            </div>
            <Link href="/lead">
              Review lead <span>→</span>
            </Link>
          </article>

          <article className="result-card">
            <div className="result-main">
              <span className="site-icon">P</span>
              <div>
                <h2>Park Avenue Family Dentistry</h2>
                <p>Dentist · 1.2 mi away</p>
              </div>
            </div>
            <div className="result-contact">
              <span>PHONE</span>
              <p>(646) 555-0184</p>
            </div>
            <Link href="/lead">
              Review lead <span>→</span>
            </Link>
          </article>

          <article className="result-card">
            <div className="result-main">
              <span className="site-icon lavender">C</span>
              <div>
                <h2>Chelsea Dental Arts</h2>
                <p>Cosmetic dentistry · 1.8 mi away</p>
              </div>
            </div>
            <div className="result-contact">
              <span>PHONE</span>
              <p>(212) 555-0168</p>
            </div>
            <Link href="/lead">
              Review lead <span>→</span>
            </Link>
          </article>

          <article className="result-card">
            <div className="result-main">
              <span className="site-icon sky">M</span>
              <div>
                <h2>Midtown Smiles</h2>
                <p>Dental practice · 2.0 mi away</p>
              </div>
            </div>
            <div className="result-contact">
              <span>PHONE</span>
              <p>(917) 555-0131</p>
            </div>
            <Link href="/lead">
              Review lead <span>→</span>
            </Link>
          </article>
        </section>
      </main>

      <footer>
        <span>© 2026 SiteCreator</span>
        <Link href="/dashboard">Leads</Link>
        <a href="#support">Support</a>
      </footer>
    </>
  );
}
