import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="nav">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark"><span></span><span></span></span>
        WhenWorks
      </Link>
      <div className="nav-links">
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
