import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminTicketChecking = () => {
  const [formData, setFormData] = useState({
    screenNumber: "",
    date: "",
    timeSlot: "",
    seatId: "",
  });

  const [seatStatus, setSeatStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const timeSlots = ["11:00 am", "2:00 pm", "6:30 pm", "9:30 pm"]; // Example slots

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.screenNumber.trim()) errors.screenNumber = "Screen number is required.";
    if (!formData.date.trim()) errors.date = "Date is required.";
    if (!formData.timeSlot.trim()) errors.timeSlot = "Time slot is required.";
    if (!formData.seatId.trim()) errors.seatId = "Seat ID is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckin = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/check-seat-status", formData);
      const seatNumber = formData.seatId; // Explicitly using seatId as seatNumber
      setSeatStatus(`${response.data.status}`);
      toast.success("Seat status fetched successfully!");
    } catch (error) {
      console.error("Error checking seat status:", error);
      toast.error(error.response?.data?.status);
    }
  };

  return (
    <div className="container mt-4" style={{ fontSize: "12px" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "12px" },
          success: { style: { background: "#4CAF50", color: "#fff" } },
          error: { style: { background: "#f44336", color: "#fff" } },
        }}
      />
      <h2 className="mb-4" style={{ fontSize: "14px" }}>Seat Check-in</h2>
      <div className="card shadow-sm p-3" style={{ fontSize: "12px" }}>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label htmlFor="screenNumber" className="form-label" style={{ fontSize: "12px" }}>
              Screen Number
            </label>
            <input
              type="number"
              id="screenNumber"
              name="screenNumber"
              className={`form-control form-control-sm ${errors.screenNumber ? "is-invalid" : ""}`}
              placeholder="Screen number"
              value={formData.screenNumber}
              onChange={handleInputChange}
            />
            {errors.screenNumber && <div className="invalid-feedback">{errors.screenNumber}</div>}
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="date" className="form-label" style={{ fontSize: "12px" }}>
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className={`form-control form-control-sm ${errors.date ? "is-invalid" : ""}`}
              value={formData.date}
              onChange={handleInputChange}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="timeSlot" className="form-label" style={{ fontSize: "12px" }}>
              Time Slot
            </label>
            <select
              id="timeSlot"
              name="timeSlot"
              className={`form-select form-select-sm ${errors.timeSlot ? "is-invalid" : ""}`}
              value={formData.timeSlot}
              onChange={handleInputChange}
            >
              <option value="">Select slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.timeSlot && <div className="invalid-feedback">{errors.timeSlot}</div>}
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="seatId" className="form-label" style={{ fontSize: "12px" }}>
              Seat ID
            </label>
            <input
              type="text"
              id="seatId"
              name="seatId"
              className={`form-control form-control-sm ${errors.seatId ? "is-invalid" : ""}`}
              placeholder="Seat ID"
              value={formData.seatId}
              onChange={handleInputChange}
            />
            {errors.seatId && <div className="invalid-feedback">{errors.seatId}</div>}
          </div>
        </div>

        <div className="text-end">
          <button className="btn btn-primary btn-sm" onClick={handleCheckin}>
            Check-in
          </button>
        </div>
      </div>

      {seatStatus && (
        <div className="mt-4">
          <h5 style={{ fontSize: "14px" }}>Seat Status:</h5>

          <div className="alert alert-info" style={{ fontSize: "12px" }}>
            {seatStatus}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketChecking;
