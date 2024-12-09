import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const CustomerDashboardBody = () => {
  const [movies, setMovies] = useState([]);
  const [movieStates, setMovieStates] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    movieId: null,
    creditCard: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);

      const initialStates = response.data.reduce((acc, movie) => {
        acc[movie._id] = {
          selectedDate: null,
          selectedTimeSlot: null,
          selectedSeats: [],
          bookedSeats: [],
          seatCapacity: movie.screen?.capacity || 25,
          isActive: false,
        };
        return acc;
      }, {});
      setMovieStates(initialStates);
    } catch (error) {
      toast.error('Failed to load movies');
      console.error('Error fetching movies:', error);
    }
  };

  const getTodayAndTomorrow = () => {
    const options = { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' };
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return [
      today.toLocaleDateString('en-CA', options),
      tomorrow.toLocaleDateString('en-CA', options),
    ];
  };

  const resetOtherMovies = (activeMovieId) => {
    setMovieStates((prev) => {
      const updatedStates = { ...prev };
      Object.keys(updatedStates).forEach((movieId) => {
        if (movieId !== activeMovieId) {
          updatedStates[movieId] = {
            ...updatedStates[movieId],
            selectedDate: null,
            selectedTimeSlot: null,
            selectedSeats: [],
            isActive: false,
          };
        }
      });
      return updatedStates;
    });
  };

  const fetchBookedSeats = async (movieId, date, timeSlot) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${movieId}/${date}/${timeSlot}`);
      setMovieStates((prev) => ({
        ...prev,
        [movieId]: {
          ...prev[movieId],
          bookedSeats: response.data,
        },
      }));
    } catch (error) {
      toast.error('Failed to load booked seats');
      console.error('Error fetching booked seats:', error);
    }
  };

  const handleDateSelection = (movieId, date) => {
    resetOtherMovies(movieId);
    setMovieStates((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        selectedDate: date,
        selectedTimeSlot: null,
        bookedSeats: [],
        isActive: true,
      },
    }));
  };

  const handleTimeSlotSelection = (movieId, slot) => {
    const selectedDate = movieStates[movieId]?.selectedDate;
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    setMovieStates((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        selectedTimeSlot: slot,
        isActive: true,
      },
    }));
    fetchBookedSeats(movieId, selectedDate, slot);
  };

  const handleSeatSelection = (movieId, seat) => {
    setMovieStates((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        selectedSeats: prev[movieId].selectedSeats.includes(seat)
          ? prev[movieId].selectedSeats.filter((s) => s !== seat)
          : [...prev[movieId].selectedSeats, seat],
      },
    }));
  };

  const handleConfirmBooking = (movieId) => {
    const { selectedDate, selectedTimeSlot, selectedSeats } = movieStates[movieId];
    if (!selectedDate || !selectedTimeSlot || selectedSeats.length === 0) {
      toast.error('Please select a movie, date, time slot, and seats');
      return;
    }
    setPaymentDetails({ movieId, creditCard: '', expiry: '', cvv: '' });
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    const { movieId, creditCard, expiry, cvv } = paymentDetails;
    const { selectedDate, selectedTimeSlot, selectedSeats } = movieStates[movieId];
    const userData = JSON.parse(sessionStorage.getItem('user'));
  
    if (!userData || !userData.id) {
      toast.error('User is not logged in');
      return;
    }
  
    const userId = userData.id;
    const errors = {};
  
    // Validate credit card details
    if (!creditCard.match(/^\d{16}$/)) errors.creditCard = 'Credit card number must be 16 digits';
    if (!expiry.match(/^\d{2}\/\d{2}$/)) errors.expiry = 'Expiry date format should be MM/YY';
    if (!cvv.match(/^\d{3}$/)) errors.cvv = 'CVV must be 3 digits';
  
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
  
    try {
      // Step 1: Confirm Booking
      const bookingResponse = await axios.post('http://localhost:5000/api/bookings', {
        movieId,
        customerId: userId,
        seatsBooked: selectedSeats,
        timeSlot: selectedTimeSlot,
        date: selectedDate,
      });
  
      // Step 2: Add Payment
      const ticketPrice = movies.find((movie) => movie._id === movieId)?.ticketPrice || 0;
      const totalAmount = ticketPrice * selectedSeats.length;
  
      const paymentResponse = await axios.post('http://localhost:5000/api/payments/add', {
        customerId: userId,
        movieId,
        seatsBooked: selectedSeats,
        timeSlot: selectedTimeSlot,
        date: selectedDate,
        paymentDetails: { creditCard, expiry, cvv },
        amountPaid: totalAmount,
      });
  
      // Handle success
      toast.success('Booking and payment confirmed!');
      setShowPaymentModal(false);
      setMovieStates((prev) => ({
        ...prev,
        [movieId]: {
          ...prev[movieId],
          selectedSeats: [],
        },
      }));
      fetchBookedSeats(movieId, selectedDate, selectedTimeSlot);
    } catch (error) {
      toast.error('Failed to complete booking and payment');
      console.error('Error confirming booking and payment:', error);
    }
  };
  

  return (
    <div className="container mt-4" style={{ fontSize: '10px' }}>
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
      <h2 className="mb-4" style={{ fontSize: '18px' }}>Currently Showing</h2>
      <div className="row">
        {movies.map((movie) => {
          const movieState = movieStates[movie._id] || {};
          return (
            <div className="col-12 mb-3" key={movie._id}>
              <div className="card" style={{ maxWidth: '100%', fontSize: '10px' }}>
                <div className="row g-0">
                  <div className="col-md-3" >
                    <img src={movie.imageUrl} style={{ height:"200px" }} alt={movie.title} className="img-fluid rounded-start" />
                  </div>
                  <div className="col-md-9 position-relative">
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                      <p><strong>Genre:</strong> {movie.genre?.name}</p>
                      <p><strong>Screen:</strong> {movie.screen?.screenNumber}</p>
                      {/* <p><strong>Capacity:</strong> {movieState.seatCapacity}</p> */}
                      <div className="d-flex mt-2" style={{ gap: '5px' }}>
                        {getTodayAndTomorrow().map((date) => (
                          <button key={date} className={`btn btn-outline-secondary btn-sm ${movieState.selectedDate === date ? 'active' : ''}`}
                            onClick={() => handleDateSelection(movie._id, date)}>
                            {date}
                          </button>
                        ))}
                      </div>
                      <div className="d-flex mt-2" style={{ gap: '5px' }}>
                        {movie.timeSlots.map((slot) => (
                          <button key={slot} className={`btn btn-outline-primary btn-sm ${movieState.selectedTimeSlot === slot ? 'active' : ''}`}
                            onClick={() => handleTimeSlotSelection(movie._id, slot)}>
                            {slot}
                          </button>
                        ))}
                      </div>
                  
                    </div>
                    
                  </div>    
                  {movieState.isActive && movieState.selectedDate && movieState.selectedTimeSlot && (
                        <div style={{ padding:"10px" }}>
                          <h6>Select Seats:</h6>
                          <div className="d-flex flex-wrap justify-content-center" style={{ gap: '5px' }}>
                            {Array.from({ length: movieState.seatCapacity }, (_, i) => i + 1).map((seat) => (
                              <button key={seat} className={`btn btn-sm ${movieState.bookedSeats.includes(`Seat${seat}`) ? 'btn-secondary disabled' : movieState.selectedSeats.includes(`Seat${seat}`) ? 'btn-success' : 'btn-outline-primary'}`}
                                onClick={() => handleSeatSelection(movie._id, `Seat${seat}`)}>
                                {seat}
                              </button>
                            ))}
                          </div>
                          <button className="btn btn-success btn-sm mt-3" onClick={() => handleConfirmBooking(movie._id)}>Book Now</button>
                        </div>
                      )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Payment Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="border p-3 rounded mb-3">
      <h6 className="mb-2"><strong>Booking Summary:</strong></h6>
      <p className="mb-1">
        <strong>Selected Movie:</strong>{' '}
        {movies.find((movie) => movie._id === paymentDetails.movieId)?.title || 'N/A'}
      </p>
      <p className="mb-1">
        <strong>Date:</strong>{' '}
        {movieStates[paymentDetails.movieId]?.selectedDate || 'N/A'}
      </p>
      <p className="mb-1">
        <strong>Time Slot:</strong>{' '}
        {movieStates[paymentDetails.movieId]?.selectedTimeSlot || 'N/A'}
      </p>
      <p className="mb-1">
        <strong>Selected Seats:</strong>{' '}
        {movieStates[paymentDetails.movieId]?.selectedSeats.join(', ') || 'None'}
      </p>
    </div>

    <h6 className="mt-3"><strong>Enter Payment Details:</strong></h6>
    <input
      type="text"
      className="form-control mb-2"
      placeholder="Credit Card Number"
      value={paymentDetails.creditCard}
      onChange={(e) => setPaymentDetails((prev) => ({ ...prev, creditCard: e.target.value }))}
    />
    {errors.creditCard && <small className="text-danger">{errors.creditCard}</small>}

    <input
      type="text"
      className="form-control mb-2"
      placeholder="Expiry MM/YY"
      value={paymentDetails.expiry}
      onChange={(e) => setPaymentDetails((prev) => ({ ...prev, expiry: e.target.value }))}
    />
    {errors.expiry && <small className="text-danger">{errors.expiry}</small>}

    <input
      type="text"
      className="form-control mb-2"
      placeholder="CVV"
      value={paymentDetails.cvv}
      onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cvv: e.target.value }))}
    />
    {errors.cvv && <small className="text-danger">{errors.cvv}</small>}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Close</Button>
    <Button variant="primary" onClick={handlePayment}>Pay</Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default CustomerDashboardBody;
