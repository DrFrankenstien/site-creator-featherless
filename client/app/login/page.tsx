import "../dashboard.css";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="login-body">
      <header className="site-header">
        <Link className="logo" href="/">
          <span>sc</span>SiteCreator
        </Link>
        <nav>
          <Link href="/dashboard">Go to app</Link>
        </nav>
      </header>

      <main className="login-wrap">
        <form className="login-card" action="/dashboard">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>
            Log in to
            <br />
            SiteCreator.
          </h1>
          <label htmlFor="login-email">
            Email address
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </label>
          <button type="submit">Log in</button>
          <a href="#reset">Forgot your password?</a>
        </form>
      </main>
    </div>
  );
}
