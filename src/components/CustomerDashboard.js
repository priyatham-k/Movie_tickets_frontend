import React, { useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import TopNavBar from "./TopNavBar";
import CustomerDashboardBody from "./CustomerDashboardBody";
import CustomerBookings from "./CustomerBookings";
import "../App.css";

const CustomerDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard"); // Initial section set to "dashboard"

  return (
    <div id="page-top">
      <div id="wrapper">
        <CustomerSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavBar />
            {activeSection === "dashboard" ? (
              <CustomerDashboardBody />
            ) : (
              <CustomerBookings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
