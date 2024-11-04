import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // New function to handle login for different roles
  const handleLogin = async (role) => {
    sessionStorage.clear();

    setError(null); // Reset error state

    try {
      let response;
      // If role is instructor, call instructor login API
      response = await axios.post(
        "http://localhost:5000/api/user/login/" + role,
        {
          email: username, // Use username as email for instructor login
          password,
          role,
        }
      );
      console.log(response);
      if (response.data.message === "Login successful") {
        // Navigate based on the role
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.role === "customer") {
          navigate("/Customer");
        } else if (response.data.role === "manager") {
          navigate("/Manager");
        } else if (response.data.role === "admin") {
          navigate("/Admin");
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div>
      <div className="bg-gradient-primary appStyle">
        <div className="container p-1">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-9">
              <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                    <div className="col-lg-6">
                      <div className="p-5">
                        <div className="text-center">
                          <h1 className="h4 text-gray-900 mb-4">Welcome!</h1>
                        </div>

                        <form
                          className="user"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin("customer"); // Default role is student for form submission
                          }}
                        >
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control form-control-user"
                              id="exampleInputEmail"
                              aria-describedby="emailHelp"
                              placeholder="Enter Email Address..."
                              onChange={(e) => setUsername(e.target.value)}
                            ></input>
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control form-control-user"
                              id="exampleInputPassword"
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                            ></input>
                          </div>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                          <button
                            type="submit"
                            className="btn btn-primary btn-user btn-block"
                          >
                            Customer Login
                          </button>
                          <hr></hr>
                          <button
                            type="button"
                            className="btn btn-google btn-user btn-block"
                            onClick={() => handleLogin("manger")}
                          >
                            Manager Login
                          </button>
                          <button
                            type="button"
                            className="btn btn-facebook btn-user btn-block"
                            onClick={() => handleLogin("admin")}
                          >
                            Admin Login
                          </button>
                        </form>
                        <hr></hr>
                        <div className="text-center">
                          <Link className="small" to="/Register">
                            Create an Account!
                          </Link>
                        </div>
                      </div>
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
