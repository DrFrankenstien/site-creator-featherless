"use client";

import "../dashboard.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("Dentists in Manhattan");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/results?q=${encodeURIComponent(query.trim())}`);
  };

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

      <main>
        <section className="welcome">
          <p className="eyebrow">LEAD SEARCH</p>
          <h1>
            Find a business
            <br />
            to build for.
          </h1>
          <p>Choose a business type and location. We&apos;ll handle the search.</p>
        </section>

        <form className="search-area" onSubmit={handleSearch} aria-label="Find business leads">
          <label htmlFor="lead-search">Search local businesses</label>
          <div className="search-row">
            <input
              id="lead-search"
              name="q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Plumbers in Austin, TX"
            />
            <button type="submit">Search</button>
          </div>
        </form>

        <section className="results" id="deployments" aria-labelledby="results-heading">
          <div className="results-title">
            <div>
              <p className="eyebrow">LATEST SEARCH</p>
              <h2 id="results-heading">Dentists in Manhattan</h2>
            </div>
            <span>4 results</span>
          </div>
          <div className="lead-list">
            <article className="lead">
              <div>
                <h3>Bright Smile Dental</h3>
                <p>Dental practice · Manhattan, NY</p>
              </div>
              <Link href="/lead?name=Bright%20Smile%20Dental&phone=(212)%20555-0142">
                Review lead <span>→</span>
              </Link>
            </article>
            <article className="lead">
              <div>
                <h3>Westside Dental Group</h3>
                <p>Dental practice · Manhattan, NY</p>
              </div>
              <span className="live">
                <i></i>Site live
              </span>
            </article>
            <article className="lead">
              <div>
                <h3>Park Avenue Family Dentistry</h3>
                <p>Dentist · Midtown, NY</p>
              </div>
              <Link href="/lead?name=Park%20Avenue%20Family%20Dentistry&phone=(212)%20555-0168">
                Review lead <span>→</span>
              </Link>
            </article>
            <article className="lead">
              <div>
                <h3>Chelsea Dental Arts</h3>
                <p>Cosmetic dentistry · Chelsea, NY</p>
              </div>
              <Link href="/lead?name=Chelsea%20Dental%20Arts&phone=(917)%20555-0131">
                Review lead <span>→</span>
              </Link>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 SiteCreator</span>
        <Link href="/deployments">Deployments</Link>
        <a href="#support">Support</a>
      </footer>
    </>
  );
}
