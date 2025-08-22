// HomePage.js
import React from "react";
import HeroSection from "./homepage/HeroSection";
import About from "./homepage/About";
import Missions from "./homepage/Missions";
import ContactUs from "./homepage/ContactUs";
import Footer from "./homepage/Footer";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <About />
      <Missions />
      <ContactUs />
      <Footer />
    </>
  );
};

export default HomePage;
