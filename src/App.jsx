import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Nav from "./components/Nav.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Contact from "./pages/Contact.jsx";
import OAuthComplete from "./pages/OAuthComplete.jsx";
import CreateSession from "./components/CreateSession.jsx";
import SessionPage from "./components/SessionPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className="page">
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/oauth-complete" element={<OAuthComplete />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateSession />
              </ProtectedRoute>
            }
          />
          <Route path="/s/:id" element={<SessionPage />} />
        </Routes>
        <div className="footer">
          WhenWorks — built for students, by students. ·{" "}
          <a href="/contact" style={{ color: "inherit" }}>Contact</a>
        </div>
      </div>
    </AuthProvider>
  );
}
