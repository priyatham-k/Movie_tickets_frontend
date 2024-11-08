import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/customer/register", {
        email,
        password,
      });
      if (response.data.message === "Registration successful") {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message);
    }
  };

  return (
    <div className="bg-gradient-primary vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="card o-hidden border-0 shadow-lg" style={{ maxWidth: "650px", margin: "auto" }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Image Section */}
                  <div className="col-5 d-none d-lg-block bg-register-image"></div>

                  {/* Form Section */}
                  <div className="col-7 p-5">
                    <div className="text-center mb-4">
                      <h3 className="text-gray-900" style={{ fontSize: "12px", fontWeight: "bold" }}>
                        Create an Account
                      </h3>
                    </div>
                    <form onSubmit={handleRegister}>
                      <div className="form-group mb-3">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{ fontSize: "12px", padding: "0.5rem" }}
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
                        />
                      </div>
                      <div className="form-group mb-3">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ fontSize: "12px", padding: "0.5rem" }}
                        />
                      </div>
                      {error && <p className="text-danger" style={{ fontSize: "12px" }}>{error}</p>}
                      {success && <p className="text-success" style={{ fontSize: "12px" }}>{success}</p>}
                      <button type="submit" className="btn btn-primary btn-block" style={{ fontSize: "12px" }}>
                        Register
                      </button>
                    </form>
                    <div className="text-center mt-4">
                      <a className="small" href="/" style={{ fontSize: "12px" }}>
                        Already have an account? Login
                      </a>
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

export default Register;
