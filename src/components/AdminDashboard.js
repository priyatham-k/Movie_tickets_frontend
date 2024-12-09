// AdminDashboard.js
import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import TopNavBar from "./TopNavBar";
import AdminDashboardBody from "./AdminDashboardBody";
import AdminBookings from "./AdminBookings";
import AdminEarnings from "./AdminEarnings";
import AdminPayments from  "./AdminPayments"
import "../App.css";
import AdminScreen from "./AdminScreen";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div id="page-top">
      <div id="wrapper">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavBar />
            {activeSection === "dashboard" && <AdminDashboardBody />}
            {activeSection === "bookings" && <AdminBookings />}
            {activeSection === "earnings" && <AdminEarnings />}
            {activeSection === "screens" && <AdminScreen/>}
            {activeSection === "payments" && <AdminPayments />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
