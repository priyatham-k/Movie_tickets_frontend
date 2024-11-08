import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CustomerDashboardBody = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieData, setSelectedMovieData] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [creditCard, setCreditCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const seatLayout = Array.from({ length: 25 }, (_, i) => i + 1);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);
    } catch (error) {
      toast.error('Failed to load movies');
      console.error('Error fetching movies:', error);
    }
  };

  const getTodayAndTomorrow = () => {
    const options = {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const today = new Date();
    const todayCST = today.toLocaleDateString("en-CA", options);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowCST = tomorrow.toLocaleDateString("en-CA", options);

    return [todayCST, tomorrowCST];
  };

  const fetchBookedSeats = async (movieId, date, timeSlot) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${movieId}/${date}/${timeSlot}`);
      setBookedSeats(response.data);
    } catch (error) {
      toast.error('Failed to load booked seats');
      console.error('Error fetching booked seats:', error);
    }
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleConfirmBooking = (movieId) => {
    const { selectedDate, selectedTimeSlot } = selectedMovieData[movieId] || {};

    if (!selectedDate || !selectedTimeSlot || selectedSeats.length === 0) {
      toast.error('Please select a movie, date, time slot, and seats');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleDateSelection = (movie, date) => {
    setSelectedMovieData((prevData) => ({
      ...prevData,
      [movie._id]: {
        ...prevData[movie._id],
        selectedDate: date,
      },
    }));
    if (selectedMovieData[movie._id]?.selectedTimeSlot) {
      fetchBookedSeats(movie._id, date, selectedMovieData[movie._id].selectedTimeSlot);
    }
  };

  const handleTimeSlotSelection = (movie, slot) => {
    setSelectedMovieData((prevData) => ({
      ...prevData,
      [movie._id]: {
        ...prevData[movie._id],
        selectedTimeSlot: slot,
      },
    }));
    if (selectedMovieData[movie._id]?.selectedDate) {
      fetchBookedSeats(movie._id, selectedMovieData[movie._id].selectedDate, slot);
    }
  };

  const handlePayment = async (movieId) => {
    const { selectedDate, selectedTimeSlot } = selectedMovieData[movieId];
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData || !userData._id) {
      toast.error('User is not logged in');
      return;
    }

    const userId = userData._id;
    const errors = {};

    // Validate credit card fields
    if (!creditCard.match(/^\d{16}$/)) errors.creditCard = 'Credit card number must be 16 digits';
    if (!expiry.match(/^\d{2}\/\d{2}$/)) errors.expiry = 'Expiry date format should be MM/YY';
    if (!cvv.match(/^\d{3}$/)) errors.cvv = 'CVV must be 3 digits';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        movieId,
        customerId: userId,
        seatsBooked: selectedSeats,
        timeSlot: selectedTimeSlot,
        date: selectedDate, 
      });
      toast.success('Booking confirmed!');
      setShowPaymentModal(false);
      setSelectedSeats([]);
      fetchBookedSeats(movieId, selectedDate, selectedTimeSlot);
    } catch (error) {
      toast.error('Failed to book seats');
      console.error('Error confirming booking:', error);
    }
  };

  return (
    <div className="container mt-4" style={{ fontSize: '10px' }}>
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
      <h2 className="mb-4" style={{ fontSize: '18px' }}>Currently Showing</h2>
      <div className="row">
        {movies.map((movie) => (
          <div className="col-12 mb-3" key={movie._id}>
            <div className="card" style={{ maxWidth: '100%', fontSize: '10px' }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={movie.imageUrl} alt={movie.title} className="img-fluid rounded-start" style={{ height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="col-md-8 position-relative">
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="card-text"><strong>Duration:</strong> {movie.duration} mins</p>
                    <p className="card-text"><strong>Screen:</strong> {movie.screenNumber}</p>
                    
                    <p className="card-text mt-2"><strong>Select Date:</strong></p>
                    <div className="d-flex" style={{ gap: '5px' }}>
                      {getTodayAndTomorrow().map((date) => (
                        <button key={date} className={`btn btn-outline-secondary btn-sm ${selectedMovieData[movie._id]?.selectedDate === date ? 'active' : ''}`}
                          onClick={() => handleDateSelection(movie, date)}
                          style={{ fontSize: '10px', padding: '3px 5px', minWidth: '80px' }}>
                          {date}
                        </button>
                      ))}
                    </div>

                    <p className="card-text mt-2"><strong>Time Slots:</strong></p>
                    <div className="d-flex flex-wrap" style={{ gap: '5px' }}>
                      {movie.timeSlots.map((slot) => (
                        <button key={slot} className={`btn btn-outline-primary btn-sm ${selectedMovieData[movie._id]?.selectedTimeSlot === slot ? 'active' : ''}`}
                          onClick={() => handleTimeSlotSelection(movie, slot)}
                          style={{ fontSize: '10px', padding: '3px 5px', minWidth: '60px' }}>
                          {slot}
                        </button>
                      ))}
                    </div>
                    
                    {selectedMovieData[movie._id]?.selectedDate && selectedMovieData[movie._id]?.selectedTimeSlot && (
                      <>
                        <h6 className="mt-3" style={{ fontSize: '10px' }}>Select Seats</h6>
                        <div className="d-flex flex-wrap" style={{ gap: '5px', fontSize: '10px' }}>
                          {seatLayout.map((seat) => (
                            <button key={seat} className={`btn btn-sm ${bookedSeats.includes(`Seat${seat}`) ? 'btn-secondary' : selectedSeats.includes(`Seat${seat}`) ? 'btn-success' : 'btn-outline-primary'}`}
                              onClick={() => handleSeatSelection(`Seat${seat}`)}
                              disabled={bookedSeats.includes(`Seat${seat}`)}
                              style={{ width: '30px', height: '25px', padding: '2px 4px', fontSize: '8px' }}>
                              {seat}
                            </button>
                          ))}
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                          <button className="btn btn-primary btn-sm" onClick={() => handleConfirmBooking(movie._id)}>Book Now</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Date:</strong> {selectedMovieData[movies[0]?._id]?.selectedDate}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>

          <h6 className="mt-3">Payment Details</h6>
          <input type="text" className="form-control-sm form-control mb-2" placeholder="Credit Card Number" value={creditCard} onChange={(e) => setCreditCard(e.target.value)} />
          {errors.creditCard && <small className="text-danger">{errors.creditCard}</small>}
          <input type="text" className="form-control-sm form-control mb-2" placeholder="Expiry MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          {errors.expiry && <small className="text-danger">{errors.expiry}</small>}
          <input type="text" className="form-control-sm form-control mb-2" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
          {errors.cvv && <small className="text-danger">{errors.cvv}</small>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => handlePayment(movies[0]._id)}>Confirm Booking</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDashboardBody;
