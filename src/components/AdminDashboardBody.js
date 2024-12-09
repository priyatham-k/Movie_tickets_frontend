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
    screens: [],
    timeSlots: [],
    imageUrl: "",
    actors: "",
    director: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [errors, setErrors] = useState({});

  const timeSlots = ["11:00 am", "2:00 pm", "6:30 pm", "9:30 pm"];
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
    setMovieData((prev) => {
      if (name === "screenNumber" && editingMovie) {
        // Update the nested screen object
        const selectedScreenNumber = parseInt(value, 10);
        return {
          ...prev,
          screen: {
            ...(prev.screen || {}), // Preserve existing screen properties or initialize as empty object
            screenNumber: selectedScreenNumber,
          },
        };
      }
      // Generic handling for other fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setMovieData({ ...movieData, imageUrl: reader.result });
      setImagePreview(reader.result);
    };
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
    if (!movieData.title) errors.title = "Title is required";
    if (!movieData.genre) errors.genre = "Genre is required";
    if (!movieData.actors) errors.actors = "Actors are required";
    if (!movieData.director) errors.director = "Director is required";
    if (movieData.duration < 70 || movieData.duration > 180)
      errors.duration = "Duration must be between 70 and 180 minutes";
    if (movieData.timeSlots.length === 0)
      errors.timeSlots = "At least one time slot must be selected";
    if (!movieData.imageUrl) errors.imageUrl = "Image is required";


    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrEditMovie = async () => {
    if (!validateForm()) return;
   
    try {
      if (editingMovie) {
        movieData["screenNumber"] = parseInt(movieData["screen"]["screenNumber"])
        await axios.put(
          `http://localhost:5000/api/movieRoutes/edit/${editingMovie._id}`,
          movieData
        );
        toast.success("Movie updated successfully");
      } else {
        movieData["screenNumber"] = !movieData["screenNumber"] ? 1:movieData["screenNumber"];
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
      toast.error(error.response.data.message);
    }
  };

  const resetForm = () => {
    setMovieData({
      title: "",
      genre: "",
      duration: 70,
      screenNumber: null,
      timeSlots: [],
      imageUrl: "",
      actors: "",
      director: "",
    });
    setImagePreview(null);
    setEditingMovie(null);
    setErrors({});
  };

  const handleEditMovie = (movie) => {
    setMovieData(movie);
    setImagePreview(movie.imageUrl);
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
                  <div className="col-md-4">
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="img-fluid rounded-start"
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8 position-relative">
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text" style={{ marginBottom:"5px" }}>
                        <strong>Genre:</strong> {movie.genre}
                      </p>
                      <p className="card-text" style={{ marginBottom:"5px" }}>
                        <strong>Duration:</strong> {movie.duration} mins
                      </p>
                      <p className="card-text" style={{ marginBottom:"5px" }}>
                        <strong>Screen:</strong> {movie.screen?.screenNumber}
                      </p>
                      <p className="card-text" style={{ marginBottom:"5px" }}>
                        <strong>Capacity:</strong> {movie.screen?.capacity}
                      </p>
                      <p className="card-text" style={{ marginBottom:"5px" }}>
                        <strong>Time Slots:</strong>{" "}
                        {movie.timeSlots.join(", ")}
                      </p>
                      <p className="card-text" style={{ marginBottom:"5px" }}>
                        <strong>Actors:</strong> {movie.actors}
                      </p>
                      <p className="card-text" style={{ marginBottom:"5px" }}>
                        <strong>Director:</strong> {movie.director}
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
        <h4 className="text-center">No Movies Available.</h4>
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
                {imagePreview && (
                  <div className="mb-3 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}

                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label style={{ fontSize: "12px" }}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={movieData.title}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                    />
                    {errors.title && (
                      <p className="text-danger" style={{ fontSize: "10px" }}>
                        {errors.title}
                      </p>
                    )}
                  </div>
                  <div className="col-md-4 mb-2">
                    <label style={{ fontSize: "12px" }}>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={movieData.genre}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                    />
                    {errors.genre && (
                      <p className="text-danger" style={{ fontSize: "10px" }}>
                        {errors.genre}
                      </p>
                    )}
                  </div>
                  <div className="col-md-4 mb-2">
                    <label style={{ fontSize: "12px" }}>Actors</label>
                    <input
                      type="text"
                      name="actors"
                      value={movieData.actors}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                    />
                    {errors.actors && (
                      <p className="text-danger" style={{ fontSize: "10px" }}>
                        {errors.actors}
                      </p>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label style={{ fontSize: "12px" }}>Director</label>
                    <input
                      type="text"
                      name="director"
                      value={movieData.director}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                    />
                    {errors.director && (
                      <p className="text-danger" style={{ fontSize: "10px" }}>
                        {errors.director}
                      </p>
                    )}
                  </div>
                  <div className="col-md-4 mb-2">
                    <label style={{ fontSize: "12px" }}>Duration</label>
                    <input
                      type="number"
                      name="duration"
                      value={movieData.duration}
                      onChange={handleInputChange}
                      className="form-control form-control-sm"
                      min="70"
                      max="180"
                    />
                    {errors.duration && (
                      <p className="text-danger" style={{ fontSize: "10px" }}>
                        {errors.duration}
                      </p>
                    )}
                  </div>
                  <div className="col-md-4 mb-2">
                    <label style={{ fontSize: "12px" }}>Screen Number</label>
                    <select
                      name="screenNumber"
                      value={movieData.screen?.screenNumber}
                      onChange={handleInputChange}
                      className="form-select form-select-sm"
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label style={{ fontSize: "12px" }}>Time Slots</label>
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
                          style={{
                            width: "20px",
                            height: "20px",
                            borderColor: "green",
                          }}
                        />
                        <label
                          className="form-check-label"
                          style={{ marginLeft: "10px", marginTop:"4px", fontSize: "14px"}}
                        >
                          {slot}
                        </label>
                      </div>
                    ))}
                    {errors.timeSlots && (
                      <p className="text-danger" style={{ fontSize: "10px" }}>
                        {errors.timeSlots}
                      </p>
                    )}
                  </div>
                  <div className="col-md-8 mb-2">
                    <label style={{ fontSize: "12px" }}>Upload Image</label>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="form-control form-control-sm"
                    />
                    {errors.imageUrl && (
                      <p className="text-danger" style={{ fontSize: "10px" }}>
                        {errors.imageUrl}
                      </p>
                    )}
                  </div>
                </div>
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
