import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import HeroSection from "./components/HeroSection";
import SplashCursor from "../Reactbits/SplashCursor/SplashCursor";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Missions from "./components/Missions";
import Events from "./components/Events";
import Teams from "./components/Teams";
import OurMembers from "./components/OurMembers";
import OurMemories from "./components/OurMemories";
import Gallery from "./components/Gallery";
import ContactUs from "./components/ContactUs";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

// Admin components
import AdminLogin from "./components/admin/AdminLogin";
import MainAdminDashboard from "./components/admin/MainAdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <SplashCursor />
      <Routes>
        {/* Admin login and dashboard */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Public home page */}
        <Route
          path="/"
          element={
            <div>
              <main id="full">
                <Navbar />
                <HeroSection />
                <Events />
                <About />
                <Missions />
                <Teams />
                <OurMembers />
                <Gallery />
                <ContactUs />
                <Footer />
              </main>
              <ScrollToTop />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
