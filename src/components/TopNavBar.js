import React, { useEffect, useState } from "react";
import "../App.css";

const TopNavBar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData && userData.email) {
      const emailUsername = userData.email.split("@")[0];
      setUsername(emailUsername);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      <ul className="navbar-nav ml-auto">
        <div className="topbar-divider d-none d-sm-block"></div>
        
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{username}</span>
            <div className="img-profile rounded-circle" style={{ width: "32px", height: "32px", display: "inline-block" }}>
              {/* Colorful Profile SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                style={{ width: "100%", height: "100%" }}
              >
                <circle cx="12" cy="12" r="10" fill="#4e73df" /> {/* Blue background */}
                <path
                  d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"
                  fill="#f6c23e"  // Yellow head
                />
                <path
                  d="M16 16c0-2.21-1.79-4-4-4s-4 1.79-4 4v1h8v-1z"
                  fill="#e74a3b" // Red shoulders
                />
              </svg>
            </div>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default TopNavBar;
