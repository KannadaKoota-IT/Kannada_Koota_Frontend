import React from "react";
import HeroSection from "./homepage/HeroSection";
import DashboardEvents from "./homepage/DashboardEvents";
import About from "./homepage/About";
import Missions from "./homepage/Missions";
import CulturalTeams from "./CulturalTeams";
import BlogSection from "./homepage/BlogSection";
import Footer from "./homepage/Footer";

export default function HomePage({ announcements }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F8] text-[#1C1B1B]">
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8">
        <HeroSection announcements={announcements} />
        <DashboardEvents announcements={announcements} />
        {/* <About /> */}
        <Missions />
        <CulturalTeams />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
