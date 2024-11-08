import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaTrashAlt, FaDownload } from "react-icons/fa"; // Import download icon
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchCustomerBookings();
  }, []);

  const fetchCustomerBookings = async () => {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (!userData || !userData._id) {
      toast.error("User is not logged in");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/customer/${userData._id}`
      );
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error("Error fetching bookings:", error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
      toast.success("Booking canceled");
      fetchCustomerBookings(); // Refresh the bookings list
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error("Error updating booking status:", error);
    }
  };

  const generatePDF = (booking) => {
    // Get the booking card element
    const input = document.getElementById(`booking-card-${booking._id}`);
  
    // Temporarily hide the Download Ticket and Cancel Booking buttons
    const downloadButton = input.querySelector('.btn-secondary');
    const cancelButton = input.querySelector('.btn-warning');
    
    if (downloadButton) downloadButton.style.display = 'none';
    if (cancelButton) cancelButton.style.display = 'none';
  
    // Generate PDF using html2canvas and jsPDF
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 160); // Adjusts size for the PDF
      pdf.save(`Ticket_${booking.movie.title}_${new Date(booking.date).toLocaleDateString()}.pdf`);
  
      // Restore visibility of both buttons after PDF generation
      if (downloadButton) downloadButton.style.display = 'block';
      if (cancelButton) cancelButton.style.display = 'block';
    });
  };
  
  

  return (
    <div className="container mt-4" style={{ fontSize: "10px" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '12px',
            padding: '12px',
            width: '250px',
          },
          success: { style: { background: '#4CAF50', color: '#fff' } },
          error: { style: { background: '#f44336', color: '#fff' } },
        }}
      />
      <h2 className="mb-4" style={{ fontSize: "18px" }}>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <div className="row">
          {bookings.map((booking) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3" key={booking._id}>
              <div
                className="card p-2"
                style={{ fontSize: "10px", minHeight: "300px", position: "relative" }}
                id={`booking-card-${booking._id}`}
              >
                <img
                  src={booking.movie.imageUrl}
                  alt={booking.movie.title}
                  className="card-img-top mb-2"
                  style={{ height: "120px", objectFit: "fit", borderRadius: "5px" }}
                />
                <div className="card-body p-0 mt-2">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <h6 className="card-title mb-0">{booking.movie.title}</h6>
                    <span
                      className={`badge ${booking.status === "Active" ? "bg-success" : "bg-danger"}`}
                      style={{ fontSize: "8px" }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="card-text mb-1"><strong>Genre:</strong> {booking.movie.genre}</p>
                  <p className="card-text mb-1"><strong>Screen:</strong> {booking.movie.screenNumber}</p>
                  <p className="card-text mb-1"><strong>Slot:</strong> {booking.timeSlot}</p>
                  <p className="card-text mb-1"><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                  <p className="card-text mb-2"><strong>Seats:</strong> {booking.seatsBooked.join(", ")}</p>
                </div>

                <div className="d-flex justify-content-between mt-2">
  {booking.status === "Active" && (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => generatePDF(booking)} // Pass only necessary data to PDF generator
      title="Download Ticket"
      style={{ fontSize: "10px", padding: "4px 6px" }}
    >
      <FaDownload className="me-1" /> Download Ticket
    </button>
  )}

  {booking.status === "Active" && (
    <button
      className="btn btn-warning btn-sm"
      onClick={() => handleCancelBooking(booking._id)}
      title="Cancel Booking"
      style={{ fontSize: "10px", padding: "4px 6px" }}
    >
      <FaTrashAlt className="me-1" /> Cancel Booking
    </button>
  )}
</div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
