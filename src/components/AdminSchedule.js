import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    movieId: "",
    screenNumber: "",
    timeSlot: "",
    date: "",
  });
  const [errors, setErrors] = useState({});

  const timeSlots = ["11:00 AM", "2:00 PM", "6:30 PM", "9:30 PM"];
  const screens = [1, 2, 3, 4];

  useEffect(() => {
    fetchSchedulesAndMovies();
  }, []);

  const fetchSchedulesAndMovies = async () => {
    try {
      const [scheduleResponse, moviesResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/schedules"),
        axios.get("http://localhost:8000/api/movies"),
      ]);
      setSchedules(scheduleResponse.data.schedules);
      setMovies(moviesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load schedules or movies.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newSchedule.movieId) errors.movieId = "Movie is required.";
    if (!newSchedule.screenNumber) errors.screenNumber = "Screen is required.";
    if (!newSchedule.timeSlot) errors.timeSlot = "Time slot is required.";
    if (!newSchedule.date) errors.date = "Date is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSchedule = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8000/api/schedules/add", newSchedule);
      toast.success("Schedule added successfully.");
      fetchSchedulesAndMovies();
      setShowModal(false);
      setNewSchedule({ movieId: "", screenNumber: "", timeSlot: "", date: "" });
    } catch (error) {
      console.error("Failed to add schedule", error);
      toast.error("Failed to add schedule.");
    }
  };

  const openModal = () => {
    setShowModal(true);
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSchedule({ movieId: "", screenNumber: "", timeSlot: "", date: "" });
    setErrors({});
  };

  if (loading) {
    return <div>Loading schedules...</div>;
  }

  return (
    <div className="container-fluid" style={{ fontSize: "12px" }}>
      <ToastContainer />
      <h2 className="mb-4">Movie Schedules</h2>
      <div className="d-flex justify-content-between mb-3">
        <h4>All Schedules</h4>
        <button className="btn btn-primary btn-sm" onClick={openModal}>
          Add Schedule
        </button>
      </div>
      {schedules.length ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Screen</th>
              <th>Time Slot</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.movie.title}</td>
                <td>{schedule.screen.screenNumber}</td>
                <td>{schedule.timeSlot}</td>
                <td>{new Date(schedule.date).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Edit</button>
                  <button className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedules available.</p>
      )}

      {/* Add Schedule Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Movie</label>
            <select
              name="movieId"
              value={newSchedule.movieId}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Movie</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
            {errors.movieId && (
              <small className="text-danger">{errors.movieId}</small>
            )}
          </div>
          <div className="mb-3">
            <label>Screen</label>
            <select
              name="screenNumber"
              value={newSchedule.screenNumber}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Screen</option>
              {screens.map((screen) => (
                <option key={screen} value={screen}>
                  Screen {screen}
                </option>
              ))}
            </select>
            {errors.screenNumber && (
              <small className="text-danger">{errors.screenNumber}</small>
            )}
          </div>
          <div className="mb-3">
            <label>Time Slot</label>
            <select
              name="timeSlot"
              value={newSchedule.timeSlot}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.timeSlot && (
              <small className="text-danger">{errors.timeSlot}</small>
            )}
          </div>
          <div className="mb-3">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={newSchedule.date}
              onChange={handleInputChange}
              className="form-control"
            />
            {errors.date && (
              <small className="text-danger">{errors.date}</small>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSchedule}>
            Add Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSchedule;
