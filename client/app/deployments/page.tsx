import "../dashboard.css";
import Link from "next/link";

export default function DeploymentsPage() {
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

      <main className="app-page">
        <section className="page-heading">
          <p className="eyebrow">YOUR SITES</p>
          <h1>
            Built and ready
            <br />
            to share.
          </h1>
          <p>Keep track of every business page you&apos;ve launched.</p>
        </section>

        <section className="deployment-list" aria-label="Deployed sites">
          <article className="deployment-card">
            <div className="site-icon">W</div>
            <div className="deployment-info">
              <h2>Westside Dental Group</h2>
              <p>westside-dental.sitecreator.app</p>
              <span className="status live">
                <i></i>Live
              </span>
            </div>
            <Link href="/site">
              View details <span>→</span>
            </Link>
          </article>
          <article className="deployment-card">
            <div className="site-icon peach">B</div>
            <div className="deployment-info">
              <h2>Bright Smile Dental</h2>
              <p>brightsmile-dental.sitecreator.app</p>
              <span className="status building">
                <i></i>Building
              </span>
            </div>
            <Link href="/dashboard">
              View lead <span>→</span>
            </Link>
          </article>
        </section>
        <p className="empty-note">Your next deployment will appear here.</p>
      </main>

      <footer>
        <span>© 2026 SiteCreator</span>
        <Link href="/dashboard">Leads</Link>
        <a href="#support">Support</a>
      </footer>
    </>
  );
}
