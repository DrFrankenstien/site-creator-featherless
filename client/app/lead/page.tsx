import "../dashboard.css";
import Link from "next/link";

export default function LeadPage() {
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

      <main className="app-page detail-page">
        <Link className="back-link" href="/results">
          ← All results
        </Link>
        <section className="lead-hero">
          <span className="lead-letter">B</span>
          <div>
            <p className="eyebrow">BUSINESS LEAD</p>
            <h1>Bright Smile Dental</h1>
            <p>Dental practice · Manhattan, NY</p>
          </div>
        </section>

        <div className="detail-grid">
          <section className="details-card">
            <h2>Business details</h2>
            <dl>
              <div>
                <dt>Phone</dt>
                <dd>(212) 555-0142</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>235 W 54th St, New York, NY</dd>
              </div>
              <div>
                <dt>Website</dt>
                <dd className="missing">No website found</dd>
              </div>
            </dl>
          </section>

          <aside className="deploy-card">
            <p className="eyebrow">READY WHEN YOU ARE</p>
            <h2>Give this business a home online.</h2>
            <p>
              Create a tailored business site with their details already filled
              in.
            </p>
            <Link className="primary-button" href="/site">
              Deploy site <span>→</span>
            </Link>
          </aside>
        </div>

        <section className="notes">
          <h2>Why this lead?</h2>
          <p>
            No active business website was found. Their contact details match the
            search and they haven&apos;t been deployed before.
          </p>
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
