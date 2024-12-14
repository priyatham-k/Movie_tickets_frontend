// AdminDashboard.js
import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import TopNavBar from "./TopNavBar";
import AdminDashboardBody from "./AdminDashboardBody";
import AdminBookings from "./AdminBookings";
import AdminEarnings from "./AdminEarnings";
import AdminPayments from "./AdminPayments";
import AdminScreen from "./AdminScreen";
import AdminSchedule from "./AdminSchedule";
import AdminSeatBookings from "./AdminSeatBookings"; // Import the new component
import "../App.css";
import AdminTicketChecking from "./AdminTicketChecking";
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div id="page-top">
      <div id="wrapper">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavBar />
            {activeSection === "dashboard" && <AdminDashboardBody />}
            {activeSection === "bookings" && <AdminBookings />}
            {activeSection === "schedule" && <AdminSchedule />}
            {activeSection === "seatbookings" && <AdminSeatBookings />}
            {activeSection === "ticketChecking" && <AdminTicketChecking />} {/* Add seat bookings */}
            {activeSection === "earnings" && <AdminEarnings />}
            {activeSection === "screens" && <AdminScreen />}
            {activeSection === "payments" && <AdminPayments />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
