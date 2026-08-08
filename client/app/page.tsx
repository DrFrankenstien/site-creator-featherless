"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboard.css";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("sitecreator-theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    document.body.classList.add("landing-body");
    return () => {
      document.body.classList.remove("landing-body");
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("sitecreator-theme", nextTheme);
    showToast(`Switched to ${nextTheme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`);
  };

  const showToast = (_msg: string) => {
    // Toast notifications disabled per user request
  };

  const selectLead = (element: HTMLElement, name: string, location: string, phone: string) => {
    document.querySelectorAll("#leadsList .list-item").forEach((el) => el.classList.remove("active"));
    element.classList.add("active");

    const titleEl = document.getElementById("previewTitle");
    const descEl = document.getElementById("previewDesc");
    if (titleEl) titleEl.textContent = name;
    if (descEl) descEl.textContent = `24/7 Emergency Service & Repair in ${location}. Contact: ${phone}`;
  };

  const simulateSearch = () => {
    const input = document.getElementById("tradeLocationInput") as HTMLInputElement;
    const query = input?.value || "Plumbers in Austin, TX";
    const statusText = document.getElementById("leadStatusText");
    const leadsList = document.getElementById("leadsList");

    if (statusText) statusText.textContent = "Searching...";

    setTimeout(() => {
      const parts = query.split(" in ");
      const trade = parts[0] || "Service";
      const city = parts[1] || "Local City";

      if (leadsList) {
        leadsList.innerHTML = `
          <div class="list-item active" id="lead1">
            <span>${city} ${trade} Co.</span><span class="pill">New</span>
          </div>
          <div class="list-item" id="lead2">
            <span>${trade} Express</span><span class="pill">Ready</span>
          </div>
          <div class="list-item" id="lead3">
            <span>Apex ${trade} Masters</span><span class="pill">Draft</span>
          </div>
        `;

        const el1 = document.getElementById("lead1");
        const el2 = document.getElementById("lead2");
        const el3 = document.getElementById("lead3");

        if (el1) el1.onclick = () => selectLead(el1, `${city} ${trade} Co.`, city, "(512) 555-9012");
        if (el2) el2.onclick = () => selectLead(el2, `${trade} Express`, city, "(512) 555-8810");
        if (el3) el3.onclick = () => selectLead(el3, `Apex ${trade} Masters`, city, "(512) 555-4120");

        if (el1) selectLead(el1, `${city} ${trade} Co.`, city, "(512) 555-9012");
      }

      if (statusText) statusText.textContent = "3 Leads Found";
      showToast(`Found 3 business leads for "${query}"`);
    }, 600);
  };

  const calcTimeSaved = () => {
    const leadsSlider = document.getElementById("leadsSlider") as HTMLInputElement;
    const minsSlider = document.getElementById("minsSlider") as HTMLInputElement;
    if (!leadsSlider || !minsSlider) return;

    const leads = parseInt(leadsSlider.value);
    const mins = parseInt(minsSlider.value);

    const leadsVal = document.getElementById("leadsVal");
    const minsVal = document.getElementById("minsVal");
    const hoursSavedResult = document.getElementById("hoursSavedResult");

    if (leadsVal) leadsVal.textContent = leads + " leads";
    if (minsVal) minsVal.textContent = mins + " mins";

    const totalMinsMonth = leads * mins * 4;
    const hoursSaved = Math.round(totalMinsMonth / 60);

    if (hoursSavedResult) hoursSavedResult.textContent = hoursSaved + " Hours";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
            --bg: #ffffff;
            --bg-gradient: #ffffff;
            --surface: #ffffff;
            --surface-2: #f0f3ff;
            --surface-3: #edf8fa;
            --text: #171719;
            --muted: #595a60;
            --dim: #8a8b91;
            --accent: #d94f00;
            --accent-dark: #ba4200;
            --accent-light: rgba(217, 79, 0, 0.08);
            --border: #dedfe5;
            --border-highlight: rgba(217, 79, 0, 0.4);
            --shadow: 0 12px 30px rgba(27, 35, 56, 0.08);
            --shadow-hover: 0 18px 40px rgba(27, 35, 56, 0.14);
            
            --font-sans: 'Suisse Intl', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --radius-lg: 12px;
            --radius-md: 8px;
            --radius-sm: 6px;
            --radius-full: 999px;
        }

        [data-theme="dark"] {
            --bg: #14110f;
            --bg-gradient: #14110f;
            --surface: #1e1916;
            --surface-2: #2a231f;
            --surface-3: #231d19;
            --text: #f5eee7;
            --muted: #b8ac9e;
            --dim: #7e7367;
            --accent: #d94f00;
            --accent-dark: #ba4200;
            --accent-light: rgba(217, 79, 0, 0.15);
            --border: #382f29;
            --border-highlight: rgba(217, 79, 0, 0.4);
            --shadow: 0 14px 40px rgba(0, 0, 0, 0.4);
            --shadow-hover: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        body {
            font-family: var(--font-sans);
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }

        .toast-container {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            pointer-events: none;
        }

        .toast-msg {
            background: var(--text);
            color: var(--bg);
            padding: 0.8rem 1.4rem;
            border-radius: var(--radius-full);
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            opacity: 0;
            transform: translateY(20px);
            animation: toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            pointer-events: auto;
        }

        @keyframes toastIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        header.landing-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.9);
            border-bottom: 1px solid var(--border);
        }

        [data-theme="dark"] header.landing-header {
            background: rgba(20, 17, 15, 0.9);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.1rem 1.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo-mark-sc {
            width: 29px;
            height: 29px;
            border-radius: 8px;
            background: var(--accent);
            color: #ffffff;
            display: grid;
            place-items: center;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: -1px;
        }

        .nav-links {
            display: flex;
            gap: 1.8rem;
            color: var(--muted);
            font-size: 0.95rem;
            font-weight: 500;
            list-style: none;
        }

        .nav-links a {
            transition: color 0.2s ease;
            text-decoration: none;
            color: #4e5058;
        }

        .nav-links a:hover {
            color: var(--accent);
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .theme-toggle-btn {
            background: var(--surface-2);
            border: 1px solid var(--border);
            color: var(--text);
            width: 38px;
            height: 38px;
            border-radius: var(--radius-full);
            display: grid;
            place-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.3rem;
            border-radius: var(--radius-sm);
            border: 1px solid transparent;
            font-weight: 700;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
            text-decoration: none;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            background: var(--accent-dark);
        }

        .btn-secondary {
            background: var(--surface);
            border-color: var(--border);
            color: var(--text);
        }

        .btn-secondary:hover {
            border-color: var(--accent);
        }

        .hero {
            max-width: 1200px;
            margin: 0 auto;
            padding: 4.5rem 1.25rem 3.5rem;
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
            gap: 2.5rem;
            align-items: center;
        }

        .eyebrow {
            margin: 0 0 16px;
            color: #565e73;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }

        .hero h1 {
            font-size: clamp(2.3rem, 4.2vw, 3.6rem);
            line-height: 1.08;
            letter-spacing: -0.03em;
            margin-bottom: 1.2rem;
            font-weight: 700;
        }

        .hero p {
            font-size: 1.05rem;
            color: var(--muted);
            max-width: 600px;
            line-height: 1.6;
        }

        .hero-actions {
            display: flex;
            gap: 0.85rem;
            flex-wrap: wrap;
            margin: 1.5rem 0 1.5rem;
        }

        .hero-points {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 0.65rem;
            color: var(--muted);
            font-size: 0.9rem;
        }

        .hero-points li {
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 0.35rem 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
        }

        .hero-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 1.25rem;
            box-shadow: var(--shadow);
        }

        .card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.2rem 0.2rem 0.85rem;
            color: var(--muted);
            font-size: 0.88rem;
            font-weight: 600;
            border-bottom: 1px solid var(--border);
            margin-bottom: 1rem;
        }

        .demo-search-bar {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .demo-search-bar input {
            flex: 1;
            padding: 0.6rem 0.85rem;
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            background: var(--bg);
            color: var(--text);
            font-family: inherit;
            font-size: 0.88rem;
            outline: none;
        }

        .card-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .panel {
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 1rem;
        }

        .panel h2, .panel h3, .panel h4 {
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.6rem 0.4rem;
            border-bottom: 1px solid var(--border);
            font-size: 0.88rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .list-item:hover, .list-item.active {
            background: rgba(217, 79, 0, 0.1);
        }

        .pill {
            font-size: 0.72rem;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            background: var(--accent-light);
            color: var(--accent);
            font-weight: 700;
        }

        .preview-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 1rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .section {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3.5rem 1.25rem 0;
        }

        .section-heading {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .section-heading h2 {
            font-size: clamp(1.6rem, 2.5vw, 2.1rem);
            letter-spacing: -0.02em;
            max-width: 550px;
            font-weight: 700;
        }

        .section-heading p {
            color: var(--muted);
            max-width: 480px;
            font-size: 0.98rem;
        }

        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.25rem;
        }

        .feature-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 1.6rem;
            box-shadow: var(--shadow);
            transition: all 0.2s ease;
        }

        .feature-card-num {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 0.5rem;
        }

        .feature-card h3 {
            font-size: 1.15rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        .feature-card p {
            color: var(--muted);
            font-size: 0.95rem;
            line-height: 1.55;
        }

        .split {
            display: grid;
            grid-template-columns: 0.95fr 1.05fr;
            gap: 1.25rem;
            padding-top: 3.5rem;
        }

        .quote-card {
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .quote-card p {
            font-size: 1.35rem;
            line-height: 1.35;
            color: var(--text);
            margin-bottom: 1.5rem;
        }

        .quote-meta {
            color: var(--muted);
            font-size: 0.88rem;
            font-weight: 600;
        }

        .stack-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 2rem;
            box-shadow: var(--shadow);
        }

        .stack-card h3 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        .stack-card ul {
            list-style: none;
            display: grid;
            gap: 0.85rem;
        }

        .stack-card li {
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
            color: var(--muted);
            font-size: 0.98rem;
        }

        .calc-box {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 2rem;
            margin-top: 3.5rem;
            box-shadow: var(--shadow);
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 2rem;
            align-items: center;
        }

        .calc-controls {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        .range-group label {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.4rem;
        }

        .range-group label span:last-child {
            color: var(--accent);
            font-weight: 700;
        }

        input[type="range"] {
            width: 100%;
            accent-color: var(--accent);
            height: 6px;
            border-radius: 3px;
            background: var(--surface-2);
            outline: none;
        }

        .calc-result {
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 1.75rem;
            text-align: center;
        }

        .calc-result-num {
            font-size: 3rem;
            font-weight: 700;
            color: var(--accent);
            margin: 0.5rem 0;
        }

        .cta {
            max-width: 1200px;
            margin: 0 auto;
            padding: 4rem 1.25rem 4.5rem;
        }

        .cta-box {
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 2.5rem 2.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
        }

        .cta-box h3 {
            color: var(--text);
            font-size: 1.45rem;
            margin-bottom: 0.4rem;
            font-weight: 700;
        }

        .cta-box p {
            color: var(--muted);
            font-size: 0.98rem;
            max-width: 580px;
        }

        .cta-box .btn-primary {
            background: var(--accent);
            color: white;
            padding: 0.9rem 1.6rem;
            font-size: 1rem;
            white-space: nowrap;
        }

        dialog#authModal {
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 2rem;
            width: min(90vw, 420px);
            background: var(--surface);
            color: var(--text);
        }

        dialog#authModal::backdrop {
            background: rgba(0, 0, 0, 0.4);
        }

        .auth-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--muted);
        }

        .auth-tabs {
            display: flex;
            border-bottom: 1px solid var(--border);
            margin-bottom: 1.5rem;
        }

        .auth-tab {
            flex: 1;
            padding: 0.75rem;
            background: none;
            border: none;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--muted);
            cursor: pointer;
        }

        .auth-tab.active {
            color: var(--accent);
            border-bottom: 2px solid var(--accent);
        }

        .auth-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            margin-bottom: 0.4rem;
        }

        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            background: var(--bg);
            color: var(--text);
            font-size: 0.95rem;
        }

        .password-input-wrapper {
            position: relative;
        }

        .password-toggle-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--muted);
            font-size: 0.85rem;
            cursor: pointer;
        }

        footer.landing-footer {
            display: block;
            width: 100%;
            margin: 0;
            box-sizing: border-box;
            border-top: 1px solid var(--border);
            padding: 3.5rem clamp(24px, 4vw, 62px) 2.5rem;
            background: var(--surface);
        }

        .footer-container {
            width: 100%;
            margin: 0;
            display: grid;
            grid-template-columns: 2.2fr 1fr 1fr 1fr;
            gap: 2rem;
        }

        .footer-brand p {
            color: var(--muted);
            font-size: 0.9rem;
            margin-top: 0.75rem;
            max-width: 320px;
        }

        .footer-column h4 {
            font-size: 0.9rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .footer-column ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .footer-column a {
            color: var(--muted);
            text-decoration: none;
            font-size: 0.9rem;
        }

        .footer-column a:hover {
            color: var(--accent);
        }

        .footer-bottom {
            width: 100%;
            margin: 2.5rem 0 0;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--muted);
            font-size: 0.85rem;
        }
      ` }} />

      <div id="toastContainer" className="toast-container"></div>

      <header className="landing-header">
        <div className="nav-container">
          <Link className="logo" href="/">
            <div className="logo-mark-sc">sc</div>
            SiteCreator
          </Link>

          <ul className="nav-links">
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#calculator">Time savings</a></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/deployments">Deployments</Link></li>
          </ul>

          <div className="nav-actions">
            <button className="theme-toggle-btn" id="themeBtn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              )}
            </button>
            <Link className="btn btn-secondary" href="/login">Log in</Link>
            <Link className="btn btn-primary" href="/login">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>





            <h1>Find business leads without websites and deploy starter pages in minutes.</h1>
            <p>SiteCreator connects local directory search with instant Next.js site generation so you can stop manually copying business info into site builders.</p>

            <div className="hero-actions">
              <Link className="btn btn-primary" href="/login">Start with a sample lead list →</Link>
              <Link className="btn btn-secondary" href="/dashboard">Explore dashboard</Link>
            </div>

            <ul className="hero-points">
              <li>✓ Local directory indexing</li>
              <li>✓ Pre-built Next.js pages</li>
              <li>✓ One-click publishing</li>
            </ul>
          </div>

          <div className="hero-card" id="heroTiltCard">
            <div className="card-top">
              <span>Interactive Lead Search Sandbox</span>
              <span id="leadStatusText" className="pill">3 Leads Found</span>
            </div>

            <div className="demo-search-bar">
              <input type="text" id="tradeLocationInput" defaultValue="Plumbers in Austin, TX" />
              <button className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.88rem" }} onClick={simulateSearch}>Search</button>
            </div>

            <div className="card-body">
              <div className="panel">
                <h3>Local leads</h3>
                <div id="leadsList">
                  <div className="list-item active" onClick={(e) => selectLead(e.currentTarget, "Austin Plumber Co.", "Austin, TX", "(512) 555-9012")}>
                    <span>Austin Plumber Co.</span><span className="pill">New</span>
                  </div>
                  <div className="list-item" onClick={(e) => selectLead(e.currentTarget, "Capital City Express", "Austin, TX", "(512) 555-8810")}>
                    <span>Capital City Express</span><span className="pill">Ready</span>
                  </div>
                  <div className="list-item" onClick={(e) => selectLead(e.currentTarget, "Apex Drain Masters", "Austin, TX", "(512) 555-4120")}>
                    <span>Apex Drain Masters</span><span className="pill">Draft</span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3>Page preview</h3>
                <div className="preview-card">
                  <div className="preview-header">
                    <strong id="previewTitle" style={{ color: "var(--text)" }}>Austin Plumber Co.</strong>
                    <span className="pill" id="previewBadge">Draft Ready</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)" }} id="previewDesc">24/7 Emergency Service & Repair in Austin, TX. Contact: (512) 555-9012</p>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                  <Link href="/site" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "0.4rem 0.6rem", marginTop: "0.8rem", width: "100%", textAlign: "center" }}>
                    View Live Site →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="section-heading">
            <h2>It is built to make the middle of the job easier.</h2>
            <p>Instead of splitting lead gathering and web publishing into two separate tasks, SiteCreator keeps them in one place.</p>
          </div>

          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-card-num">01</div>
              <h3>1. Start with a place and a trade</h3>
              <p>Enter the market you care about and pull local listings that are already there.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-num">02</div>
              <h3>2. Review the details</h3>
              <p>Cut through the clutter and keep contact info, service areas, and notes in one simple list.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-num">03</div>
              <h3>3. Publish a page</h3>
              <p>Turn each lead into a basic landing page that feels useful for follow-up rather than overbuilt.</p>
            </div>
          </div>
        </section>

        <section className="section split" id="details">
          <div className="quote-card">
            <p>“The point is not to make something flashy. It is to get from a list of names to a page you can actually use without wasting the afternoon.”</p>
            <div className="quote-meta">A simple workflow for agency teams and solo operators</div>
          </div>

          <div className="stack-card">
            <h3>What you get in a typical run</h3>
            <ul>
              <li>Lead names, phone numbers, and location details pulled into one place.</li>
              <li>A short page draft with business info and a clear contact point.</li>
              <li>A faster way to move from “found a lead” to “sent a follow-up.”</li>
            </ul>
          </div>
        </section>

        <section className="section" id="calculator">
          <div className="section-heading">
            <h2>Calculate your weekly time savings.</h2>
            <p>See how much tedious research and manual page creation time SiteCreator saves your team every month.</p>
          </div>

          <div className="calc-box">
            <div className="calc-controls">
              <div className="range-group">
                <label>
                  <span>Leads Researched Per Week</span>
                  <span id="leadsVal">40 leads</span>
                </label>
                <input type="range" id="leadsSlider" min="10" max="200" step="5" defaultValue="40" onInput={calcTimeSaved} />
              </div>

              <div className="range-group">
                <label>
                  <span>Minutes Saved Per Lead</span>
                  <span id="minsVal">25 mins</span>
                </label>
                <input type="range" id="minsSlider" min="10" max="60" step="5" defaultValue="25" onInput={calcTimeSaved} />
              </div>
            </div>

            <div className="calc-result">
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 700 }}>Hours Saved Every Month</span>
              <div className="calc-result-num" id="hoursSavedResult">66 Hours</div>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Reclaim ~8 full working days per month for active outreach and closing deals.</p>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-heading">
            <h2>Built for the part of the job that usually feels messy.</h2>
            <p>It is meant to be practical first and a little more polished second.</p>
          </div>

          <div className="grid-3">
            <div className="feature-card">
              <h3>Less busywork</h3>
              <p>Keep the research and the follow-up in the same flow so things do not fall through the cracks.</p>
            </div>
            <div className="feature-card">
              <h3>Better handoff</h3>
              <p>Share a clean list and a draft page instead of a pile of notes and screenshots.</p>
            </div>
            <div className="feature-card">
              <h3>More room to actually work</h3>
              <p>Spend less time setting up and more time calling, emailing, and getting the job done.</p>
            </div>
          </div>
        </section>

        <section className="cta">

          <div className="cta-box">
            <div>
              <h3>Start with a real lead list, not a blank page.</h3>
              <p>Create a free account and try a sample search to see how it feels in practice.</p>
            </div>
            <Link className="btn btn-primary" href="/login">Get started</Link>
          </div>

        </section>
      </main>




      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <div className="logo-mark-sc">sc</div>
              SiteCreator
            </Link>
            <p>A straightforward tool for pulling local lead data and turning it into a page without a lot of setup.</p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><Link href="/dashboard">Lead list</Link></li>
              <li><Link href="/deployments">Page drafts</Link></li>
              <li><a href="#calculator">Simple follow-up</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#details">Support</a></li>
              <li><a href="#about">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; 2026 SiteCreator Inc.</div>
          <div>Built for practical follow-up, not hype.</div>
        </div>
      </footer>



    </>
  );
}
