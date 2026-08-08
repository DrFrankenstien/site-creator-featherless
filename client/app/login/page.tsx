"use client";

import "../dashboard.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <header className="site-header">
        <Link className="logo" href="/">
          <span>sc</span>SiteCreator
        </Link>
        <nav>
          <Link href="/dashboard">Go to app</Link>
        </nav>
        <ThemeToggle />
      </header>

      <main className="login-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <p className="eyebrow">WELCOME BACK</p>
          <h1>
            Log in to
            <br />
            SiteCreator.
          </h1>

          {error && (
            <div style={{ color: "#e5484d", background: "rgba(229,72,77,0.1)", padding: "0.6rem 0.8rem", borderRadius: "6px", fontSize: "0.85rem", margin: "0.5rem 0" }}>
              {error}
            </div>
          )}

          <label htmlFor="login-email">
            Email address
            <input
              id="login-email"
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
          <a href="#reset">Forgot your password?</a>
        </form>
      </main>
    </div>
  );
}
