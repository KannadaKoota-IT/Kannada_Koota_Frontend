import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Teams from "./components/Teams";
import DomainDetail from "./components/DomainDetail";
import Gallery from "./components/Gallery";
import HomePage from "./components/HomePage";
import Events from "./components/Events";

// Admin components
import AdminLogin from "./components/admin/AdminLogin";
import MainAdminDashboard from "./components/admin/MainAdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AnnouncementPanel from "./components/admin/AnnouncementPanel";
import AdminEvents from "./components/admin/AdminEvents";
import TeamsPanel from "./components/admin/TeamsPanel";
import AdminGallery from "./components/admin/AdminGallery";
import TeamDetails from "./components/admin/TeamDetails";

const App = () => {
  return (
    <Router>
      {/* <SplashCursor /> */}
      <Routes>
        {/* Admin login */}
        <Route path="/admin-login" element={<AdminLogin />} />

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
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="teams" element={<Teams />} />
          <Route path="team-details/:teamId" element={<DomainDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="event" element={<Events />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
