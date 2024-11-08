import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminEarnings = () => {
  const [movies, setMovies] = useState([]);
  const [earnings, setEarnings] = useState({});
  const seatPrice = 100;

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

  const getTodayAndTomorrowCST = () => {
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
  

  const fetchEarningsData = async () => {
    const earningsData = {};

    for (const movie of movies) {
      earningsData[movie._id] = {};

      for (const date of getTodayAndTomorrowCST()) {
        earningsData[movie._id][date] = {};

        for (const timeSlot of movie.timeSlots) {
          const bookedSeats = await fetchBookedSeats(movie._id, date, timeSlot);
          earningsData[movie._id][date][timeSlot] = bookedSeats.length * seatPrice;
        }
      }
    }

    setEarnings(earningsData);
  };

  const fetchBookedSeats = async (movieId, date, timeSlot) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${movieId}/${date}/${timeSlot}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      return [];
    }
  };

  useEffect(() => {
    if (movies.length > 0) {
      fetchEarningsData();
    }
  }, [movies]);

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
      <h2 className="mb-4" style={{ fontSize: '18px' }}>Earnings Overview</h2>
      <div className="row">
        {movies.map((movie) => (
          <div className="col-12 mb-3" key={movie._id}>
            <div className="card shadow-sm" style={{ maxWidth: '100%', fontSize: '12px' }}>
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="img-fluid rounded-start"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="card-text"><strong>Duration:</strong> {movie.duration} mins</p>
                    <p className="card-text"><strong>Screen:</strong> {movie.screenNumber}</p>
                    
                    <div className="mt-3">
                      <h6 style={{ color: '#28a745' }}>Earnings Summary</h6>
                      {getTodayAndTomorrowCST().map((date) => (
                        <div key={date} className="mb-3">
                          <h6 >{date}</h6>
                          <div className="d-flex flex-wrap" style={{ gap: '5px' }}>
                            {movie.timeSlots.map((slot) => (
                              <div key={slot} className="p-2 border rounded text-center" style={{ minWidth: '120px', backgroundColor: '#f8f9fa' }}>
                                <strong style={{ color: '#007bff' }}>{slot}</strong>
                                <p className="mb-0" style={{ fontSize: '12px' }}>Earnings: ${earnings[movie._id]?.[date]?.[slot] || 0}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEarnings;
