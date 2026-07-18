import { Routes, Route, Link } from "react-router-dom";
import CreateSession from "./components/CreateSession.jsx";
import SessionPage from "./components/SessionPage.jsx";

export default function App() {
  return (
    <div className="container">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1>WhenWorks</h1>
      </Link>
      <p className="subtitle">Find the meeting time that actually works — no login, no back-and-forth.</p>

      <Routes>
        <Route path="/" element={<CreateSession />} />
        <Route path="/s/:id" element={<SessionPage />} />
      </Routes>
    </div>
  );
}
