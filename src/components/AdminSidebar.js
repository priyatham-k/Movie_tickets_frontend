import React from "react";
import "../App.css";

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      {/* Brand Section */}
      <a className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon">
          <i className="fas fa-video"></i>
        </div>
        <div className="sidebar-brand-text mx-3">Cinema Hub</div>
      </a>

      <hr className="sidebar-divider my-0" />

      {/* Dashboard Section */}
      <li className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}>
        <a
          className="nav-link"
          onClick={() => setActiveSection("dashboard")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Movie Dashboard</span>
        </a>
      </li>

      <hr className="sidebar-divider" />

      {/* Menu Heading */}
      <div className="sidebar-heading">Menu</div>

      {/* Bookings Section */}
      <li className={`nav-item ${activeSection === "bookings" ? "active" : ""}`}>
        <a
          className="nav-link"
          onClick={() => setActiveSection("bookings")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-fw fa-ticket-alt"></i>
          <span>Bookings</span>
        </a>
      </li>

      {/* Screens Section */}
      <li className={`nav-item ${activeSection === "screens" ? "active" : ""}`}>
        <a
          className="nav-link"
          onClick={() => setActiveSection("screens")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-fw fa-tv"></i>
          <span>Screens</span>
        </a>
      </li>

      {/* Earnings Section */}
      <li className={`nav-item ${activeSection === "earnings" ? "active" : ""}`}>
        <a
          className="nav-link"
          onClick={() => setActiveSection("earnings")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-fw fa-dollar-sign"></i>
          <span>Earnings</span>
        </a>
      </li>

      {/* Payments Section */}
      <li className={`nav-item ${activeSection === "payments" ? "active" : ""}`}>
        <a
          className="nav-link"
          onClick={() => setActiveSection("payments")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-fw fa-credit-card"></i>
          <span>Payments</span>
        </a>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />

      {/* Log Out Section */}
      <li className="nav-item">
        <a className="nav-link" href="/">
          <i className="fas fa-fw fa-sign-out-alt"></i>
          <span>Log Out</span>
        </a>
      </li>
    </ul>
  );
};

export default AdminSidebar;
