import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit } from "react-icons/fa";

const AdminScreen = () => {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/screenRoutes/");
      setScreens(response.data);
      if (response.data.length > 0) {
        fetchScreenDetails(response.data[0]._id); // Default to the first screen
      }
    } catch (error) {
      console.error("Error fetching screens:", error);
      toast.error("Failed to fetch screens");
    }
  };

  const fetchScreenDetails = async (screenId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/screenRoutes/${screenId}/movies`
      );
      setSelectedScreen(response.data);
      setCapacity(response.data.screen.capacity);
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching screen details:", error);
      //toast.error("Failed to fetch screen details");
    }
  };

  const handleEditCapacity = async () => {
    if (!capacity || capacity < 25 || capacity > 250) {
      toast.error("Capacity must be between 25 and 80");
      const response = await axios.get(
        `http://localhost:5000/api/screenRoutes/${selectedScreen.screen.id}/movies`
      );
      setSelectedScreen(response.data);
      setCapacity(response.data.screen.capacity);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/screenRoutes/edit/${selectedScreen.screen.id}`, {
        capacity,
      });
      toast.success("Screen capacity updated successfully");
      fetchScreenDetails(selectedScreen.screen._id); // Refresh details
    } catch (error) {
      console.error("Error updating screen capacity:", error);
      toast.error("Failed to update screen capacity");
    }
  };

  const defaultScreens = [1, 2, 3, 4]; // Default to 4 screens

  return (
    <div className="container mt-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "12px",
            padding: "12px",
            width: "250px",
          },
          success: {
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#f44336",
              color: "#fff",
            },
          },
        }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ background: "#f8f9fa", padding: "10px" }}>
          {defaultScreens.map((screenNumber) => (
            <li
              key={screenNumber}
              className={`breadcrumb-item ${
                selectedScreen && selectedScreen.screen.screenNumber === screenNumber
                  ? "active"
                  : ""
              }`}
              style={{
                cursor: "pointer",
                color:
                  selectedScreen && selectedScreen.screen.screenNumber === screenNumber
                    ? "#fff"
                    : "#007bff",
                background:
                  selectedScreen && selectedScreen.screen.screenNumber === screenNumber
                    ? "#007bff"
                    : "transparent",
                padding: "8px 12px",
                borderRadius: "5px",
              }}
              onClick={() =>
                fetchScreenDetails(
                  screens.find((screen) => screen.screenNumber === screenNumber)?._id
                )
              }
            >
              Screen {screenNumber}
            </li>
          ))}
        </ol>
      </nav>

      <div className="row">
        {/* Screen Details */}
        <div className="col-md-6">
          {selectedScreen ? (
            <div className="card h-100">
              <div className="card-body">
                <h5>Screen Details</h5>
                <p>
                  <strong>Screen Number:</strong> {selectedScreen.screen.screenNumber}
                </p>
                <p>
                  <strong>Capacity:</strong>{" "}
                  {!isEditing ? (
                    <>
                      {capacity}{" "}
                      <FaEdit
                        style={{ cursor: "pointer", color: "#007bff" }}
                        onClick={() => setIsEditing(true)}
                      />
                    </>
                  ) : (
                    <div className="input-group" style={{ maxWidth: "250px" }}>
                      <input
                        type="number"
                        className="form-control"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleEditCapacity}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <p>No screen details available.</p>
          )}
        </div>

        {/* Movies in Screen */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5>Movies in Screen</h5>
              {selectedScreen && selectedScreen.movies && selectedScreen.movies.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {selectedScreen.movies.map((movie) => (
                    <li
                      className="list-group-item d-flex align-items-center"
                      key={movie._id}
                    >
                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "15px",
                        }}
                      />
                      <span>{movie.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No movies available for this screen.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
