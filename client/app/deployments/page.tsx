"use client";

import "../dashboard.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSites } from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

export default function DeploymentsPage() {
  const [sites, setSites] = useState<Array<{ _id: string; name: string; phone?: string; port?: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSites()
      .then((data) => {
        if (Array.isArray(data)) {
          setSites(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
          {sites.map((site) => {
            const letter = site.name ? site.name.charAt(0).toUpperCase() : "S";
            const sub = site.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
            return (
              <article className="deployment-card" key={site._id || site.name}>
                <div className="site-icon">{letter}</div>
                <div className="deployment-info">
                  <h2>{site.name}</h2>
                  <p>{sub}.sitecreator.app</p>
                  <span className="status live">
                    <i></i>Live
                  </span>
                </div>
                <Link href={`/site?name=${encodeURIComponent(site.name)}`}>
                  View details <span>→</span>
                </Link>
              </article>
            );
          })}


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
