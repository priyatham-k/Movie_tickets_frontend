import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loginType, setLoginType] = useState("customer"); // Default to customer login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Determine the correct login API endpoint based on login type
    const url =
      loginType === "admin"
        ? "http://localhost:5000/api/admin/login"
        : "http://localhost:5000/api/customer/login";

    try {
      // Send login request
      const response = await axios.post(url, { email, password });

      // Handle success based on API response
      if (response.status === 200) {
        const { token, user } = response.data;

        // Store token and user information in sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        // Navigate to appropriate dashboard
        navigate(loginType === "admin" ? "/admin" : "/customer");
      } else {
        setError(response.data.message || "An unexpected error occurred.");
      }
    } catch (err) {
      // Catch errors and display appropriate messages
      setError(
        err.response?.data?.message || "Failed to login. Please check your credentials."
      );
    }
  };

  return (
    <div className="bg-gradient-primary vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div
              className="card o-hidden border-0 shadow-lg"
              style={{ maxWidth: "650px", margin: "auto" }}
            >
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-5 d-none d-lg-block bg-login-image"></div>
                  <div className="col-7 p-5">
                    <div className="text-center mb-4">
                      <h3
                        className="text-gray-900"
                        style={{ fontSize: "12px", fontWeight: "bold" }}
                      >
                        Welcome Back!
                      </h3>
                    </div>
                    <form onSubmit={handleLogin}>
                      <div className="form-group mb-3">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{ fontSize: "12px", padding: "0.5rem" }}
                          required
                        />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ fontSize: "12px", padding: "0.5rem" }}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label style={{ fontSize: "12px" }}>Login as:</label>
                        <select
                          className="form-control"
                          value={loginType}
                          onChange={(e) => setLoginType(e.target.value)}
                          style={{ fontSize: "12px", padding: "0.5rem" }}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      {error && (
                        <p className="text-danger" style={{ fontSize: "12px" }}>
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                        style={{ fontSize: "12px" }}
                      >
                        Login
                      </button>
                    </form>
                    <div className="text-center mt-4">
                      {loginType === "customer" && (
                        <a
                          className="small"
                          href="/register"
                          style={{ fontSize: "12px" }}
                        >
                          Create Customer Account
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
