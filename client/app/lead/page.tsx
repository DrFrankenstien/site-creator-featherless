"use client";

import "../dashboard.css";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createSite } from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

function LeadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "Bright Smile Dental";
  const phone = searchParams.get("phone") || "(212) 555-0142";
  const address = searchParams.get("address") || "235 W 54th St, New York, NY";

  const [initialPrompt, setInitialPrompt] = useState(`Create a site for ${name}`);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setDeploying(true);
    setError(null);
    const queryPrompt = encodeURIComponent(initialPrompt.trim());
    try {
      const res = await createSite(name, phone);
      if (res && res.site && res.site._id) {
        router.push(`/site/edit?id=${res.site._id}&name=${encodeURIComponent(name)}&prompt=${queryPrompt}`);
      } else {
        setError("Failed to create site database entry.");
      }
    } catch (err: any) {
      console.error("Site creation error:", err);
      setError(err.message || "Failed to create site.");
    } finally {
      setDeploying(false);
    }
  };

  const letter = name.charAt(0).toUpperCase();

  return (
    <main className="app-page detail-page">
      <Link className="back-link" href="/results">
        ← All results
      </Link>

      <section className="lead-hero">
        <span className="lead-letter">{letter}</span>
        <div>
          <p className="eyebrow">BUSINESS LEAD</p>
          <h1>{name}</h1>
          <p>{address}</p>
        </div>
      </section>

      {error && (
        <div style={{ color: "#e5484d", background: "rgba(229,72,77,0.1)", padding: "0.8rem", borderRadius: "8px", margin: "1rem 0" }}>
          {error}
        </div>
      )}

      <div className="detail-grid">
        <section className="details-card">
          <h2>Business details</h2>
          <dl>
            <div>
              <dt>Phone</dt>
              <dd>{phone}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{address}</dd>
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
            Create a tailored business site with their details already filled in.
          </p>

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <label htmlFor="lead-prompt" style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600 }}>
              Initial AI Edit Prompt
            </label>
            <textarea
              id="lead-prompt"
              value={initialPrompt}
              onChange={(e) => setInitialPrompt(e.target.value)}
              placeholder="e.g. Create a site for my cafe called Almarino Cafe"
              style={{
                width: "100%",
                minHeight: "70px",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "var(--input-bg)",
                color: "var(--ink)",
                fontSize: "13px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <button className="primary-button" onClick={handleDeploy} disabled={deploying} style={{ border: "none", cursor: "pointer", width: "100%" }}>
            {deploying ? "Creating Site..." : "Create Site & Open Editor →"}
          </button>
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
  );
}

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
        <ThemeToggle />
      </header>

      <Suspense fallback={<div style={{ padding: "2rem" }}>Loading lead details...</div>}>
        <LeadContent />
      </Suspense>

      <footer>
        <span>© 2026 SiteCreator</span>
        <Link href="/dashboard">Leads</Link>
        <a href="#support">Support</a>
      </footer>
    </>
  );
}
