import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Card } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

const AdminSeatBookings = () => {
  const [seatBookings, setSeatBookings] = useState([]);

  useEffect(() => {
    fetchSeatBookings();
  }, []);

  const fetchSeatBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/seatbookings");
      setSeatBookings(response.data);
    } catch (error) {
      toast.error("Failed to load seat bookings");
      console.error("Error fetching seat bookings:", error);
    }
  };

  const handleApprove = async (bookingId, seatId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/seatbookings/${bookingId}/approve-cancel`,
        { seatId }
      );
      toast.success("Seat booking approved");
      fetchSeatBookings();
    } catch (error) {
      toast.error("Failed to approve seat booking");
      console.error("Error approving seat booking:", error);
    }
  };

  const handleReject = async (bookingId, seatId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/seatbookings/${bookingId}/reject-cancel`,
        { seatId }
      );
      toast.success("Seat booking rejected");
      fetchSeatBookings();
    } catch (error) {
      toast.error("Failed to reject seat booking");
      console.error("Error rejecting seat booking:", error);
    }
  };

  // Group bookings by movie title
  const groupedByMovie = seatBookings.reduce((acc, booking) => {
    const movieTitle = booking.movie.title;
    if (!acc[movieTitle]) {
      acc[movieTitle] = [];
    }
    acc[movieTitle].push(booking);
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <Toaster />
      <h3 className="mb-4" style={{ fontSize: "12px" }}>
        Seat Bookings
      </h3>

      {Object.keys(groupedByMovie).map((movieTitle) => (
        <Card className="mb-4 shadow-sm" key={movieTitle}>
          <Card.Header
            className="bg-primary text-white py-2"
            style={{ fontSize: "12px" }}
          >
            <h5 className="mb-0">{movieTitle}</h5>
          </Card.Header>
          <Card.Body style={{ padding: "10px" }}>
            <Table
              striped
              bordered
              hover
              responsive
              size="sm"
              className="mb-0"
              style={{ fontSize: "12px" }}
            >
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Seat Number</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedByMovie[movieTitle].map((booking) =>
                  booking.seatsBooked.map((seat) => (
                    <tr key={seat.seatId}>
                      <td>{booking.customer.name}</td>
                      <td>{seat.seatNumber}</td>
                      <td>{seat.status}</td>
                      <td>{seat.remarks || "None"}</td>
                      <td className="text-center">
                        {seat.status === "Pending Cancel" && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                handleApprove(booking._id, seat.seatId)
                              }
                              className="me-2"
                              style={{ fontSize: "12px", padding: "4px 6px" }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleReject(booking._id, seat.seatId)
                              }
                              style={{ fontSize: "12px", padding: "4px 6px" }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default AdminSeatBookings;
