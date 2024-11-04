import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [theatreData, setTheatreData] = useState({
    name: "",
    location: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Load theatre data from sessionStorage on mount
  useEffect(() => {
    const storedData = sessionStorage.getItem("theatreData");
    if (storedData) {
      setTheatreData(JSON.parse(storedData));
      setIsEditing(true); // Set editing mode if data is found
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTheatreData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing theatre
        await axios.put(`http://localhost:5000/api/theatre/updateTheatre`, theatreData);
      } else {
        // Add new theatre
        await axios.post("http://localhost:5000/api/theatre/addTheatre", theatreData);
      }
      // Store data in sessionStorage
      sessionStorage.setItem("theatreData", JSON.stringify(theatreData));
      alert("Theatre successfully " + (isEditing ? "updated" : "added") + ".");
      setModalVisible(false); // Close the modal
      resetForm(); // Reset form data
    } catch (error) {
      console.error("Error submitting theatre data:", error);
      alert("Error submitting theatre data.");
    }
  };

  const resetForm = () => {
    setTheatreData({ name: "", location: "" });
    setIsEditing(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    resetForm();
    setModalVisible(false);
  };

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-university"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY OF TEXAS</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <hr className="sidebar-divider" />
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <span style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: "600" }}>Logout</span>
              </Link>
            </li>
            <hr className="sidebar-divider" />
          </ul>
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <div className="container-fluid">
                <h1 className="h3 mb-4 text-gray-800">Theatre Management</h1>

                {/* Button Container */}
                <div className="d-flex justify-content-between mb-3">
                  <button className="btn btn-secondary" onClick={openModal}>
                    Add Screen
                  </button>
                  <button className="btn btn-primary" onClick={openModal}>
                    {isEditing ? "Edit Theatre" : "Add Theatre"}
                  </button>
                </div>

                {/* Modal for Adding/Editing Theatre */}
                <div className={`modal ${modalVisible ? "show" : ""}`} style={{ display: modalVisible ? "block" : "none" }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{isEditing ? "Update Theatre" : "Add Theatre"}</h5>
                        <button type="button" className="close" onClick={closeModal}>
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label htmlFor="name">Theatre Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              name="name"
                              value={theatreData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                              type="text"
                              className="form-control"
                              id="location"
                              name="location"
                              value={theatreData.location}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <button type="submit" className="btn btn-primary">
                            {isEditing ? "Update Theatre" : "Add Theatre"}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Modal */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
