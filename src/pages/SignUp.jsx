import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { googleSignInUrl } from "../api.js";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <div className="card card-narrow">
        <h2>Create your account</h2>
        <p className="subtitle">Takes about 30 seconds. Only needed to save sessions and templates.</p>

        <a href={googleSignInUrl()} className="btn btn-google btn-block">
          <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#4285F4" d="M15.68 8.18c0-.58-.05-1.13-.15-1.66H8v3.15h4.3a3.68 3.68 0 01-1.6 2.42v2h2.58c1.5-1.39 2.4-3.44 2.4-5.9z"/><path fill="#34A853" d="M8 16c2.16 0 3.97-.72 5.3-1.9l-2.58-2.02c-.72.48-1.63.77-2.72.77-2.1 0-3.87-1.4-4.5-3.3H.83v2.07A8 8 0 008 16z"/><path fill="#FBBC05" d="M3.5 9.55A4.8 4.8 0 013.23 8c0-.54.1-1.06.27-1.55V4.38H.83A8 8 0 000 8c0 1.29.31 2.5.83 3.62l2.67-2.07z"/><path fill="#EA4335" d="M8 3.18c1.18 0 2.23.4 3.06 1.2l2.3-2.3C11.96.9 10.16 0 8 0A8 8 0 00.83 4.38L3.5 6.45C4.13 4.55 5.9 3.18 8 3.18z"/></svg>
          Continue with Google
        </a>
        <div className="divider">or sign up with email</div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Marta Reyes" required />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />

          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ marginTop: 18 }}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="subtitle" style={{ marginTop: 16, marginBottom: 0 }}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
