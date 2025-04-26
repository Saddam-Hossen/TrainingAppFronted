import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRole } from "../context/RoleContext"; // Import useRole
import { loginEmloyee } from "../services/employeeService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";
import ErrorModal from "../context/ErrorModal";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setRoleData } = useRole(); // Get setRoleData from context
  const [error, setError] = useState(null);
  // Function to trigger the modal
  const handleError = (message) => {
    setError(message);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before attempting login

    try {
      const response = await loginEmloyee(email, password, handleError);// here i  want to send modal to another function
      if (response?.result === "Authenticated") {

        const sessionExpiryTime = Date.now() + 10 * 60 * 1000; // Set expiry (10 minutes)
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("expiry", sessionExpiryTime); // Store expiry time
       
        if(response?.role === "Admin") {
          navigate("/QuizNotice");
        }
        else{
          navigate("/QuizSingleNotice");
        }
       
      } else {
        setError("⚠️ Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      {error && <ErrorModal show={true}  message={error} onClose={() => setError(null)} />}
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f4f6f9" }}>
        <div className="card p-4 shadow-lg" style={{ width: "350px", borderRadius: "10px" }}>
          <h4 className="text-center mb-3">Login</h4>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Id Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your Id Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
