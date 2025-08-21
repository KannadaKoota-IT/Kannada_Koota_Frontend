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
import Gallery from "./components/Gallery";
import ContactUs from "./components/ContactUs";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

// Admin components
import AdminLogin from "./components/admin/AdminLogin";
import MainAdminDashboard from "./components/admin/MainAdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AnnouncementPanel from "./components/admin/AnnouncementPanel";
import AdminEvents from "./components/admin/AdminEvents";
import TeamsPanel from "./components/admin/TeamsPanel";
import AdminGallery from "./components/admin/AdminGallery";
import TeamDetails from "./components/admin/TeamDetails"

const App = () => {
  return (
    <Router>
      <SplashCursor />
      <Routes>
        {/* Admin login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected admin dashboard with nested routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainAdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="announcement" element={<AnnouncementPanel />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="teams" element={<TeamsPanel />} />
          <Route path="teamDetails/:teamId" element={<TeamDetails />} />
          <Route path="gallery" element={<AdminGallery />} />
          {/* Default */}
          <Route index element={<AnnouncementPanel />} />
        </Route>

        {/* Public home page */}
        <Route
          path="/"
          element={
            <div>
              <main id="full">
                <Navbar />
                <HeroSection />
                <About />
                <Events />
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
