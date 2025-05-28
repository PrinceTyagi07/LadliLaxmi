import { useState, useEffect } from "react";
// Import 'Navigate' component for declarative redirects (like <Navigate to="/"/>)
// Import 'useNavigate' hook for programmatic redirects within components (like in PrivateRoute)
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSyncExternalStore } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode for decoding JWTs (make sure you've installed it)

// Import your custom components and pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Registration from "./Pages/Registration";
import Profile from "./Pages/Profile";
import UserDashboard from "./components/Profile/userDashboard"; // Import the UserDashboard component

// --- App Component ---
function App() {
  let email = ""; // Variable to hold the decoded email from the token

  // useSyncExternalStore is used here to get the 'token' from localStorage,
  // and re-render the component whenever the 'token' in localStorage changes
  // (e.g., from another tab, or from a direct localStorage.setItem call).
  const subscribe = (callback) => {
    window.addEventListener("storage", callback); // Listen for browser storage events
    const intervalId = setInterval(callback, 500); // Also poll every 500ms for robust detection
    return () => {
      clearInterval(intervalId); // Clean up interval
      window.removeEventListener("storage", callback); // Clean up event listener
    };
  };

  const getSnapshot = () => localStorage.getItem("token"); // Function to read the current token from localStorage
  const userToken = useSyncExternalStore(subscribe, getSnapshot, getSnapshot); // Get the current token

  // If a user token exists, attempt to decode it to extract the email.
  if (userToken) {
    try {
      const decodedToken = jwtDecode(userToken); // Decode the JWT token
      email = decodedToken.email; // Assuming your JWT has an 'email' field
    } catch (error) {
      console.error("Invalid token or decoding error:", error);
      // If the token is invalid, it might be corrupted or expired.
      // It's a good practice to remove it from localStorage.
      localStorage.removeItem("token");
    }
  }

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Route for Home page */}
        <Route path="/" element={<Home />} />

        {/* Conditional Route for Account page:
              Shows Profile if userToken exists, otherwise shows Registration. */}
        <Route
          path="/account/*"
          element={userToken ? <Profile /> : <Registration />}
        />
        {/* Protected Dashboard Routes - UserDashboard component will handle authentication check internally */}
        {/* The '*' in path="/dashboard/*" allows UserDashboard to handle nested routes like /dashboard/profile, /dashboard/transactions etc. */}
        <Route path="/userdashboard/*" element={<UserDashboard />} />
        {/* Protected Admin Routes using PrivateRoute */}
        {/* Note: PrivateRoute wraps the component in the 'element' prop of the Route */}

        {/* Fallback Route: For any unmatched paths, redirect to the Home page.
              This uses the 'Navigate' component for declarative redirection. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
