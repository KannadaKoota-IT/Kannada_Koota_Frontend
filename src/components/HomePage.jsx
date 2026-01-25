import React from "react";
import HeroSection from "./homepage/HeroSection";
import About from "./homepage/About";
import Missions from "./homepage/Missions";
import Footer from "./homepage/Footer";
import DashboardEvents from "./homepage/DashboardEvents";
import CulturalTeams from "./CulturalTeams";

const HomePage = ({ announcements }) => {
  return (
    <>
      <HeroSection />
      <DashboardEvents announcements={announcements} />
      <About />
      <Missions />
      <CulturalTeams />
      {/* <Gallery/> */}
      <Footer />
    </>
  );
};

export default HomePage;
