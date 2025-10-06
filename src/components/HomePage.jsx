import React from "react";
import HeroSection from "./homepage/HeroSection";
import About from "./homepage/About";
import Missions from "./homepage/Missions";
import Footer from "./homepage/Footer";
import DashboardEvents from "./homepage/DashboardEvents";
import CulturalTeams from "./CulturalTeams";
import Gallery from './Gallery'

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <DashboardEvents />
      <About />
      <Missions />
      {/* <CulturalTeams /> */}
      <Gallery/>
      <Footer />
    </>
  );
};

export default HomePage;
