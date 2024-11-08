import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const CustomerSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <a className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon">
          <i className="fas fa-video"></i>
        </div>
        <div className="sidebar-brand-text mx-3">
          Cinema Hub
        </div>
      </a>
      <hr className="sidebar-divider my-0" />

      <li className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}>
        <a
          className="nav-link"
          onClick={() => setActiveSection("dashboard")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-fw fa-film"></i> {/* Updated icon */}
          <span>Movies</span>
        </a>
      </li>

      <hr className="sidebar-divider" />

      <div className="sidebar-heading">Menu</div>

      <li className={`nav-item ${activeSection === "bookings" ? "active" : ""}`}>
        <a
          className="nav-link"
          onClick={() => setActiveSection("bookings")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-fw fa-ticket-alt"></i> {/* Ticket icon */}
          <span>My Bookings</span>
        </a>
      </li>

      <li className="nav-item">
        <Link to="/" className="nav-link">
          <i className="fas fa-fw fa-sign-out-alt"></i>
          <span>Log Out</span>
        </Link>
      </li>
    </ul>
  );
};

export default CustomerSidebar;
