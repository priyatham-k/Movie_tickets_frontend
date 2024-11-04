import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const ManagerDashBoard = lazy(() => import("./components/ManagerDashBoard"));
const CustomerDashbooard = lazy(() => import("./components/CustomerDashboard"));
function App() {
  return (
    <div className="appStyle">
      <Router>
        {/* Suspense to show fallback while components load */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Admin" element={<AdminDashboard />} />
            <Route path="/Manager" element={<ManagerDashBoard />} />
            <Route path="/Customer" element={<CustomerDashbooard />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
