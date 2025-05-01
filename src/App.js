import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { isTokenExpired, checkAndRefreshToken } from "./services/Auth";
import { useEffect ,useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let inactivityTimer = null; // Timer reference
  useEffect(() => {
    // Check if user is logged in
    const storedAuthToken = localStorage.getItem("authToken");
    if (storedAuthToken && !isTokenExpired()) {
      setIsAuthenticated(true);
    }

    if (isAuthenticated) {
      console.log("Starting global token refresh interval...");
      const interval = setInterval(checkAndRefreshToken, 60 * 1000);

      return () => {
        console.log("Clearing global token refresh interval...");
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]); // ✅ Runs when `isAuthenticated` changes

   // ✅ Detect user activity (reset inactivity timer)
   useEffect(() => {
    if (isAuthenticated) {
      const resetTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          console.log("User inactive for 10 minutes. Logging out...");
          logoutUser();
        }, 20 * 60 * 1000); // 10 minutes (600,000 ms)
      };

      // Listen to user interactions
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keypress", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);

      resetTimer(); // Start the timer initially

      return () => {
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keypress", resetTimer);
        window.removeEventListener("click", resetTimer);
        window.removeEventListener("scroll", resetTimer);
        clearTimeout(inactivityTimer);
      };
    }
  }, [isAuthenticated]);

  // ✅ Logout function
  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/";

  };
  return <AppRoutes />;
};

export default App;
