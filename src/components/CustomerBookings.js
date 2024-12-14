import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaTrashAlt, FaDownload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [cancelDetails, setCancelDetails] = useState({
    bookingId: null,
    seatId: null,
    remarks: "",
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomerBookings();
  }, []);

  const fetchCustomerBookings = async () => {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (!userData || !userData.id) {
      toast.error("User is not logged in");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/customer/${userData.id}`
      );
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error("Error fetching bookings:", error);
    }
  };

  const handleCancelBooking = async () => {
    const { bookingId, seatId, remarks } = cancelDetails;

    if (!remarks.trim()) {
      setErrors({ remarks: "Remarks are mandatory for canceling." });
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          seatId,
          remarks,
        }
      );

      toast.success("Cancellation request submitted");
      setShowCancelModal(false);

      // Update the seat status locally to "Pending Cancel"
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                seatsBooked: booking.seatsBooked.map((seat) =>
                  seat.seatId === seatId
                    ? { ...seat, status: "Pending Cancel" }
                    : seat
                ),
              }
            : booking
        )
      );
    } catch (error) {
      toast.error("Failed to submit cancellation request");
      console.error("Error updating booking status:", error);
    }
  };

  const generatePDF = (booking, seat) => {
    const input = document.getElementById(
      `booking-card-${booking._id}-${seat.seatId}`
    );

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
      pdf.save(
        `Ticket_${booking.movie.title}_${seat.seatNumber}_${new Date(
          booking.date
        ).toLocaleDateString()}.pdf`
      );
    });
  };

  const openCancelModal = (bookingId, seatId) => {
    setCancelDetails({
      bookingId,
      seatId,
      remarks: "",
    });
    setErrors({});
    setShowCancelModal(true);
  };

  const handleRemarksChange = (e) => {
    setCancelDetails({
      ...cancelDetails,
      remarks: e.target.value,
    });
    setErrors({ ...errors, remarks: "" });
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
          success: { style: { background: "#4CAF50", color: "#fff" } },
          error: { style: { background: "#f44336", color: "#fff" } },
        }}
      />
      <h2 className="mb-4" style={{ fontSize: "18px" }}>
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <div className="row">
          {bookings.map((booking) =>
            booking.seatsBooked.map((seat) => (
              <div className="col-12 col-md-6 col-lg-4 mb-3" key={seat.seatId}>
                <div
                  className="card p-2"
                  style={{
                    fontSize: "10px",
                    minHeight: "300px",
                    position: "relative",
                  }}
                  id={`booking-card-${booking._id}-${seat.seatId}`}
                >
                  <img
                    src={booking.movie.imageUrl}
                    alt={booking.movie.title}
                    className="card-img-top mb-2"
                    style={{
                      height: "120px",
                      objectFit: "fit",
                      borderRadius: "5px",
                    }}
                  />
                  <div className="card-body p-0 mt-2">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <h6 className="card-title mb-0">{booking.movie.title}</h6>
                      <span
                        className={`badge ${
                          seat.status === "Booked"
                            ? "bg-success"
                            : seat.status === "Pending Cancel"
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                        style={{ fontSize: "8px" }}
                      >
                        {seat.status}
                      </span>
                    </div>
                    <p className="card-text mb-1">
                      <strong>Genre:</strong> {booking.movie.genre}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Screen:</strong>{" "}
                      {booking.movie.screen?.screenNumber}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Slot:</strong> {booking.timeSlot}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Date:</strong>{" "}
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                      })}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Seat:</strong>{" "}
                      {`${seat.seatNumber} (${seat.seatId})`}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    {seat.status === "Booked" && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => generatePDF(booking, seat)}
                        title="Download Ticket"
                        style={{ fontSize: "10px", padding: "4px 6px" }}
                      >
                        <FaDownload className="me-1" /> Download Ticket
                      </button>
                    )}

                    {seat.status === "Booked" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          openCancelModal(booking._id, seat.seatId)
                        }
                        title="Cancel Booking"
                        style={{ fontSize: "10px", padding: "4px 6px" }}
                      >
                        <FaTrashAlt className="me-1" /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showCancelModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          aria-labelledby="cancelTicketModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="cancelTicketModal">
                  Cancel Ticket
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowCancelModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Please provide remarks for canceling your ticket:</p>
                <textarea
                  placeholder="Add remarks (mandatory)"
                  value={cancelDetails.remarks}
                  onChange={handleRemarksChange}
                  className={`form-control ${
                    errors.remarks ? "is-invalid" : ""
                  }`}
                  rows="4"
                />
                {errors.remarks && (
                  <div className="invalid-feedback">{errors.remarks}</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCancelBooking}
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
