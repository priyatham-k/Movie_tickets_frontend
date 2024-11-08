import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminDashboardBody = () => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    genre: "",
    duration: 70,
    screenNumber: 1,
    timeSlots: [],
    imageUrl: "",
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const [errors, setErrors] = useState({});

  const timeSlots = ["11:00am", "2:00pm", "6:00pm", "9:00pm"];
  const screens = [1, 2, 3, 4];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/movies/with-available-seats"
      );
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies with available seats");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData({ ...movieData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () =>
      setMovieData({ ...movieData, imageUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleTimeSlotChange = (e) => {
    const selectedSlot = e.target.value;
    setMovieData((prevData) => ({
      ...prevData,
      timeSlots: prevData.timeSlots.includes(selectedSlot)
        ? prevData.timeSlots.filter((slot) => slot !== selectedSlot)
        : [...prevData.timeSlots, selectedSlot],
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Basic validations for required fields
    if (!movieData.title) errors.title = "Title is required";
    if (!movieData.genre) errors.genre = "Genre is required";
    if (movieData.duration < 70 || movieData.duration > 180)
      errors.duration = "Duration must be between 70 and 180 minutes";
    if (movieData.timeSlots.length === 0)
      errors.timeSlots = "At least one time slot must be selected";
    if (!movieData.imageUrl) errors.imageUrl = "Image is required";
    const isScreenOccupied = movies.some(
      (movie) =>
      
        movie.screenNumber == movieData.screenNumber && // Check if any movie has the same screen number
        (!editingMovie || movie._id !== editingMovie._id) 
        // Exclude the current movie if we're editing it
    );

    if (isScreenOccupied) {
      errors.screenNumber = "Selected screen is occupied by another movie";
    }

    // Update the errors state with any found errors
    setErrors(errors);

    // Return true if there are no validation errors
    return Object.keys(errors).length === 0;
  };

  const handleAddOrEditMovie = async () => {
    if (!validateForm()) return;

    try {
      if (editingMovie) {
        await axios.put(
          `http://localhost:5000/api/movieRoutes/edit/${editingMovie._id}`,
          movieData
        );
        toast.success("Movie updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/movieRoutes/add",
          movieData
        );
        toast.success("Movie added successfully");
      }
      fetchMovies();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error("Error saving movie");
      console.error("Error saving movie:", error);
    }
  };

  const resetForm = () => {
    setMovieData({
      title: "",
      genre: "",
      duration: 70,
      screenNumber: 1,
      timeSlots: [],
      imageUrl: "",
    });
    setEditingMovie(null);
    setErrors({});
  };

  const handleEditMovie = (movie) => {
    setMovieData(movie);
    setEditingMovie(movie);
    setShowModal(true);
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/movieRoutes/delete/${id}`);
      toast.success("Movie deleted successfully");
      fetchMovies();
    } catch (error) {
      toast.error("Error deleting movie");
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div className="container mt-4" style={{ fontSize: "10px" }}>
           <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '12px', // Increase font size
            padding: '12px', // Increase padding
            width: '250px',  // Increase width
          },
          success: {
            style: {
              background: '#4CAF50', // Success color
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#f44336', // Error color
              color: '#fff',
            },
          },
        }}
      />
      <div className="d-flex justify-content-between mb-4">
        <h2 style={{ fontSize: "18px" }}>Movie Dashboard</h2>
        <button
          className="btn btn-success btn-sm"
          onClick={() => setShowModal(true)}
        >
          Add Movie
        </button>
      </div>

      {movies.length > 0 ? (
        <div className="row">
          {movies.map((movie) => (
            <div className="col-md-6 mb-3" key={movie._id}>
              <div
                className="card"
                style={{ maxWidth: "100%", fontSize: "10px" }}
              >
                <div className="row g-0">
                  <div className="col-md-6">
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="img-fluid rounded-start"
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-6 position-relative">
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text">
                        <strong>Genre:</strong> {movie.genre}
                      </p>
                      <p className="card-text">
                        <strong>Duration:</strong> {movie.duration} mins
                      </p>
                      <p className="card-text">
                        <strong>Screen:</strong> {movie.screenNumber}
                      </p>
                      <p className="card-text">
                        <strong>Time Slots:</strong>{" "}
                        {movie.timeSlots.join(", ")}
                      </p>
                    </div>
                    <div
                      className="position-absolute top-0 end-0 d-flex mt-2 me-2"
                      style={{ gap: "5px" }}
                    >
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditMovie(movie)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteMovie(movie._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No movies available.</p>
      )}

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingMovie ? "Edit Movie" : "Add Movie"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={movieData.title}
                  onChange={handleInputChange}
                  className="form-control form-control-sm mb-2"
                />
                {errors.title && (
                  <p className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.title}
                  </p>
                )}

                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  value={movieData.genre}
                  onChange={handleInputChange}
                  className="form-control form-control-sm mb-2"
                />
                {errors.genre && (
                  <p className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.genre}
                  </p>
                )}

                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (70-180 mins)"
                  value={movieData.duration}
                  onChange={handleInputChange}
                  min="70"
                  max="180"
                  className="form-control form-control-sm mb-2"
                />
                {errors.duration && (
                  <p className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.duration}
                  </p>
                )}

                <select
                  name="screenNumber"
                  value={movieData.screenNumber}
                  onChange={handleInputChange}
                  className="form-select form-select-sm mb-2"
                >
                  {screens.map((screen) => (
                    <option key={screen} value={screen}>
                      Screen {screen}
                    </option>
                  ))}
                </select>
                {errors.screenNumber && (
                  <p className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.screenNumber}
                  </p>
                )}

                <div className="mb-2">
                  <label style={{ fontSize: "10px" }}>Select Time Slots:</label>
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className="form-check"
                      style={{ fontSize: "10px" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={slot}
                        onChange={handleTimeSlotChange}
                        checked={movieData.timeSlots.includes(slot)}
                      />
                      <label className="form-check-label">{slot}</label>
                    </div>
                  ))}
                  {errors.timeSlots && (
                    <p className="text-danger" style={{ fontSize: "10px" }}>
                      {errors.timeSlots}
                    </p>
                  )}
                </div>

                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="form-control form-control-sm mb-2"
                />
                {errors.imageUrl && (
                  <p className="text-danger" style={{ fontSize: "10px" }}>
                    {errors.imageUrl}
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAddOrEditMovie}
                >
                  {editingMovie ? "Update Movie" : "Add Movie"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardBody;
