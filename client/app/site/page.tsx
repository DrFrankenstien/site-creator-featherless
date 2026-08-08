"use client";

import "../dashboard.css";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import { getSites, getSiteById, deploySite } from "../lib/api";

function SiteDetailsContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("id");
  const initialName = searchParams.get("name") || "Westside Dental Group";

  const [site, setSite] = useState<any>(null);
  const [siteName, setSiteName] = useState(initialName);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (siteId) {
      getSiteById(siteId).then((data) => {
        if (isMounted && data) {
          setSite(data);
          if (data.name) setSiteName(data.name);
        }
        setLoading(false);
      });
    } else {
      getSites().then((sites) => {
        if (isMounted && Array.isArray(sites) && sites.length > 0) {
          const match = sites.find((s: any) => s.name?.toLowerCase() === initialName.toLowerCase()) || sites[0];
          setSite(match);
          if (match?.name) setSiteName(match.name);
        }
        setLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [siteId, initialName]);

  const handleDeploy = async () => {
    if (!site?._id) {
      setMessage("✨ Site preview draft is active!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setDeploying(true);
    try {
      await deploySite(site._id);
      setMessage("🚀 Site deployment initiated on Vercel!");
    } catch (err: any) {
      setMessage(`ℹ️ ${err.message || "Site build queued"}`);
    } finally {
      setDeploying(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const copyLink = () => {
    const slug = siteName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    navigator.clipboard.writeText(`https://${slug}.sitecreator.app`);
    setMessage("📋 Link copied to clipboard!");
    setTimeout(() => setMessage(null), 3000);
  };

  const slug = siteName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const siteUrl = `${slug}.sitecreator.app`;

  return (
    <main className="app-page site-page">
      <Link className="back-link" href="/deployments">
        ← All deployments
      </Link>

      {message && (
        <div style={{ background: "var(--card-bg)", color: "var(--ink)", padding: "0.8rem 1.2rem", borderRadius: "8px", border: "1px solid var(--line)", marginBottom: "1rem" }}>
          {message}
        </div>
      )}

      <section className="site-status">
        <p className="eyebrow">SITE DEPLOYMENT</p>
        <h1>{siteName}</h1>
        <p className="live-message">
          <i></i> {loading ? "Loading site status..." : "Your site is live"}
        </p>
        <a className="site-url" href={`https://${siteUrl}`} target="_blank" rel="noreferrer">
          {siteUrl} <span>↗</span>
        </a>
      </section>

      <section className="site-preview">
        <div className="browser-bar">
          <i></i>
          <i></i>
          <i></i>
          <span>{siteUrl}</span>
        </div>
        <div className="preview-content">
          <p>{siteName.toUpperCase()}</p>
          <h2>Smile with confidence.</h2>
          <span>Book an appointment</span>
        </div>
      </section>

      <section className="site-actions">
        <Link href={`/site/edit?id=${site?._id || ""}&name=${encodeURIComponent(siteName)}`}>
          Edit business details
        </Link>
        <button type="button" onClick={copyLink} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", font: "inherit" }}>
          Copy site link
        </button>
        <button type="button" onClick={handleDeploy} disabled={deploying} style={{ background: "none", border: "none", color: "#e5484d", cursor: "pointer", font: "inherit" }}>
          {deploying ? "Deploying..." : "Publish to Vercel"}
        </button>
      </section>
    </main>
  );
}

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
        <ThemeToggle />
      </header>

      <Suspense fallback={<div style={{ padding: "2rem" }}>Loading site details...</div>}>
        <SiteDetailsContent />
      </Suspense>

      <footer>
        <span>© 2026 SiteCreator</span>
        <Link href="/dashboard">Leads</Link>
        <a href="#support">Support</a>
      </footer>
    </>
  );
}
