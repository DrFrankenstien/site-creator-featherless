"use client";

import "../dashboard.css";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchBusinesses } from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Dentists in Manhattan";
  const [leads, setLeads] = useState<Array<{ name: string; phone?: string; address?: string; site?: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    searchBusinesses(query)
      .then((data) => {
        if (isMounted) {
          setLeads(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError(err.message || "Failed to load results from server");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <>
      <main className="app-page results-page">
        <Link className="back-link" href="/dashboard">
          ← Back to search
        </Link>

        <section className="page-heading compact">
          <p className="eyebrow">SEARCH RESULTS</p>
          <h1>{query}</h1>
          <p>{loading ? "Searching local business directories..." : `We found ${leads.length} local businesses. Start with the leads below.`}</p>
        </section>

        {!loading && (
          <div className="filter-row" aria-label="Lead filters">
            <button className="selected" type="button">
              All leads <span>{leads.length}</span>
            </button>
            <button type="button">
              No site found <span>{leads.filter((l) => !l.site).length}</span>
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--muted)" }}>
            <div className="live-message" style={{ justifyContent: "center" }}>
              <i></i> Scraper and database indexing query: &quot;{query}&quot;
            </div>
          </div>
        ) : error ? (
          <div style={{ padding: "2rem", color: "#e5484d", background: "rgba(229,72,77,0.1)", borderRadius: "8px", margin: "1rem 0" }}>
            {error}
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--muted)" }}>
            No leads found for this query. Try a different business category or location.
          </div>
        ) : (
          <section className="result-cards" aria-label="Business leads">
            {leads.map((lead, idx) => {
              const letter = lead.name ? lead.name.charAt(0).toUpperCase() : "B";
              const colors = ["peach", "", "lavender", "sky"];
              const colorClass = colors[idx % colors.length];

              return (
                <article className="result-card" key={idx}>
                  <div className="result-main">
                    <span className={`site-icon ${colorClass}`}>{letter}</span>
                    <div>
                      <h2>{lead.name}</h2>
                      <p>{lead.address || "Local business"}</p>
                    </div>
                  </div>
                  <div className="result-contact">
                    <span>PHONE</span>
                    <p>{lead.phone || "No phone listed"}</p>
                  </div>
                  <Link href={`/lead?name=${encodeURIComponent(lead.name)}&phone=${encodeURIComponent(lead.phone || "")}&address=${encodeURIComponent(lead.address || "")}`}>
                    Review lead <span>→</span>
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}

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
        <ThemeToggle />
      </header>

      <Suspense fallback={<div style={{ padding: "2rem" }}>Loading results...</div>}>
        <ResultsContent />
      </Suspense>

      <footer>
        <span>© 2026 SiteCreator</span>
        <Link href="/dashboard">Leads</Link>
        <a href="#support">Support</a>
      </footer>
    </>
  );
}
