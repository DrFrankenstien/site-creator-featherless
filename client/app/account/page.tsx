"use client";

import "../dashboard.css";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function AccountPage() {
  return (
    <>
      <header className="site-header">
        <Link className="logo" href="/dashboard">
          <span>sc</span>SiteCreator
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/dashboard">Leads</Link>
          <Link href="/deployments">Deployments</Link>
          <Link className="current" href="/account">
            Account
          </Link>
        </nav>
        <ThemeToggle />
      </header>

      <main className="app-page account-page" id="account">
        <section className="page-heading">
          <p className="eyebrow">YOUR ACCOUNT</p>
          <h1>
            Keep things
            <br />
            simple.
          </h1>
          <p>Manage your profile and how SiteCreator works for you.</p>
        </section>

        <form className="settings-card" onSubmit={(e) => e.preventDefault()}>
          <div className="form-title">
            <h2>Profile</h2>
            <p>These details are only visible to you.</p>
          </div>
          <label htmlFor="name">
            Name
            <input id="name" type="text" defaultValue="Ayaan Mittal" />
          </label>
          <label htmlFor="email">
            Email address
            <input id="email" type="email" defaultValue="ayaan@example.com" />
          </label>
          <button type="button">Save changes</button>
        </form>

        <section className="plan-card">
          <div>
            <p className="eyebrow">STARTER PLAN</p>
            <h2>18 of 50 sites used</h2>
          </div>
          <a href="#plans">
            Manage plan <span>→</span>
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
