import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/');
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to load payments');
      console.error('Error fetching payments:', error);
    }
  };

  return (
    <div className="container mt-4" style={{ fontSize: '12px' }}>
      <Toaster />
      <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>Payment Dashboard</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Movie Title</th>
              <th>Seats</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td>{payment.customerId?.firstName} {payment.customerId?.lastName || ''}</td>
                  <td>{payment.customerId?.email || 'N/A'}</td>
                  <td>{payment.movieId?.title || 'N/A'}</td>
                  <td>{payment.seatsBooked?.join(', ') || 'N/A'}</td>
                  <td>{payment.date}</td>
                  <td>{payment.timeSlot}</td>
                  <td>${payment.amountPaid}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDashboard;
