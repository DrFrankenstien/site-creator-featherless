import "../dashboard.css";
import Link from "next/link";

export default function SitePage() {
  return (
    <>
      <header className="site-header">
        <Link className="logo" href="/dashboard">
          <span>sc</span>SiteCreator
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/dashboard">Leads</Link>
          <Link className="current" href="/deployments">
            Deployments
          </Link>
          <Link href="/account">Account</Link>
        </nav>
      </header>

      <main className="app-page site-page">
        <Link className="back-link" href="/deployments">
          ← All deployments
        </Link>

        <section className="site-status">
          <p className="eyebrow">SITE DEPLOYMENT</p>
          <h1>Westside Dental Group</h1>
          <p className="live-message">
            <i></i> Your site is live
          </p>
          <a className="site-url" href="#visit-site">
            westside-dental.sitecreator.app <span>↗</span>
          </a>
        </section>

        <section className="site-preview">
          <div className="browser-bar">
            <i></i>
            <i></i>
            <i></i>
            <span>westside-dental.sitecreator.app</span>
          </div>
          <div className="preview-content">
            <p>WESTSIDE DENTAL GROUP</p>
            <h2>Smile with confidence.</h2>
            <span>Book an appointment</span>
          </div>
        </section>

        <section className="site-actions">
          <a href="#edit">Edit business details</a>
          <a href="#copy">Copy site link</a>
          <a href="#unpublish" className="danger">
            Unpublish site
          </a>
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
