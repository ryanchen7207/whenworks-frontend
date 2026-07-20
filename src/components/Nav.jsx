import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="nav">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark"><span></span><span></span></span>
        WhenWorks
      </Link>

      <div className="nav-links">
        <div
          className="nav-dropdown"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            className="btn btn-ghost nav-dropdown-trigger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
          >
            Menu
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 6 }}>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {menuOpen && (
            <div className="nav-dropdown-panel">
              <a href="/#how" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="/#features" onClick={() => setMenuOpen(false)}>Features</a>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </div>
          )}
        </div>

        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
            <button
              className="btn btn-ghost"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="btn btn-ghost">Sign in</Link>
            <Link to="/signup" className="btn btn-primary">Sign up free</Link>
          </>
        )}
      </div>
    </div>
  );
}
