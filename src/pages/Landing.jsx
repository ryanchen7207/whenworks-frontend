import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Landing() {
  const { user } = useAuth();
  const primaryCta = user ? "/dashboard" : "/signup";

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">no login required to join a session</span>
            <h1>Stop asking "when's everyone free."</h1>
            <p className="hero-sub">
              Create a session, share a link, and everyone marks their real availability —
              preferred, okay, or avoid. WhenWorks finds the time that actually works best
              for the group, not just the first slot where nobody said no.
            </p>
            <div className="hero-ctas">
              <Link to={primaryCta} className="btn btn-primary">
                {user ? "Go to dashboard" : "Get started free"}
              </Link>
              <a href="#how" className="btn btn-ghost">See how it works</a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-block hero-block-a"><span>Marta — preferred</span></div>
            <div className="hero-block hero-block-b"><span>Tobias — preferred</span></div>
            <div className="hero-tag">4:00pm works ✓</div>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="section-head">
          <h2>Four steps, no back-and-forth</h2>
          <p>Every scheduling poll follows the same sequence — WhenWorks just makes each step faster.</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Create a session</h3>
            <p>Pick a date range and time window. Takes about ten seconds.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Share the link</h3>
            <p>No accounts needed for participants — just open the link and go.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Mark availability</h3>
            <p>Tap blocks as preferred, okay, or avoid — not just free or busy.</p>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <h3>Get the best time</h3>
            <p>WhenWorks ranks every slot by who's free and how strongly.</p>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-head">
          <h2>Built for how students actually schedule</h2>
          <p>Not a generic meeting poll — this is tuned for recurring school groups.</p>
        </div>
        <div className="features">
          <div className="feature-card">
            <div className="feature-dot" style={{ background: "var(--violet)" }} />
            <h3>Ranked preference, not just free/busy</h3>
            <p>Mark a time as preferred, okay, or avoid — the group sees the time that's actually best, not just technically possible.</p>
          </div>
          <div className="feature-card">
            <div className="feature-dot" style={{ background: "var(--teal)" }} />
            <h3>Calendar sync, entirely optional</h3>
            <p>Import an .ics file to auto-fill your busy blocks, or skip it and tap your availability by hand — your choice.</p>
          </div>
          <div className="feature-card">
            <div className="feature-dot" style={{ background: "var(--coral)" }} />
            <h3>Saved recurring commitments</h3>
            <p>Sign in to save your weekly schedule once, then reuse it across every future session.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <h2>Set up your first session in under a minute</h2>
          <p>Free, no credit card, works for groups of any size.</p>
          <Link to={primaryCta} className="btn btn-primary">
            {user ? "Go to dashboard" : "Sign up free"}
          </Link>
        </div>
      </section>
    </>
  );
}
