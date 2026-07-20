import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function OAuthComplete() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { completeGoogleLogin } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.get("token");
    const err = params.get("error");
    if (err) {
      setError(err);
      return;
    }
    if (!token) {
      setError("No token received from Google.");
      return;
    }
    completeGoogleLogin(token)
      .then(() => navigate("/dashboard"))
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="section">
      <div className="card card-narrow" style={{ textAlign: "center" }}>
        {error ? (
          <>
            <h2>Sign-in didn't go through</h2>
            <p className="error">{error}</p>
          </>
        ) : (
          <p className="subtitle" style={{ marginBottom: 0 }}>Finishing sign-in…</p>
        )}
      </div>
    </div>
  );
}
