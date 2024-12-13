import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "../App.css";
import toast, { Toaster } from 'react-hot-toast';
const CustomerSidebar = ({ activeSection, setActiveSection }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // For button loading state
  const [error, setError] = useState(""); // For error messages
  const [success, setSuccess] = useState(""); // For success messages
  const [userId, setUserId] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const user = JSON.parse(sessionStorage.getItem("user")); // Assuming 'user' is the key
    if (user && user.id) {
      setUserId(user.id); // Set userId from the user object
    }
      const response = await fetch("http://localhost:5000/api/customer/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      setSuccess(data.message || "Password changed successfully.");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowModal(false); // Close the modal after success
      toast.success('Password Updated Successfully');
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <a className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-icon">
            <i className="fas fa-video"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Cinema Hub</div>
        </a>
        <hr className="sidebar-divider my-0" />

        <li
          className={`nav-item ${
            activeSection === "dashboard" ? "active" : ""
          }`}
        >
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

        <li
          className={`nav-item ${activeSection === "bookings" ? "active" : ""}`}
        >
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
          <a
            className="nav-link"
            onClick={() => setShowModal(true)} 
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-fw fa-key"></i> 
            <span>Change Password</span>
          </a>
        </li>

        <li className="nav-item">
          <Link to="/" className="nav-link">
            <i className="fas fa-fw fa-sign-out-alt"></i>
            <span>Log Out</span>
          </Link>
        </li>
      </ul>

      {/* Change Password Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "12px" }}>Old Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                placeholder="Enter old password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                style={{ fontSize: "12px", padding: "4px" }}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "12px" }}>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                style={{ fontSize: "12px", padding: "4px" }}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "12px" }}>
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ fontSize: "12px", padding: "4px" }}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              style={{ fontSize: "12px", padding: "4px 8px" }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomerSidebar;
