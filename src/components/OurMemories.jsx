import React from "react";
import CircularGallery from "../../Reactbits/CircularGallery/CircularGallery";

// Media imports
import img1 from "../components/assets/gallery/1.png";
import img2 from "../components/assets/gallery/2.png";
import img3 from "../components/assets/gallery/3.png";
import img4 from "../components/assets/gallery/4.png";
import img5 from "../components/assets/gallery/5.png";
import img6 from "../components/assets/gallery/6.png";
import img7 from "../components/assets/gallery/7.png";
import img8 from "../components/assets/gallery/8.png";
import img9 from "../components/assets/gallery/9.png";
import img10 from "../components/assets/gallery/10.png";
import img11 from "../components/assets/gallery/11.png";
import img12 from "../components/assets/gallery/12.png";
import img13 from "../components/assets/gallery/13.png";
import img14 from "../components/assets/gallery/14.png";
import img15 from "../components/assets/gallery/15.png";
import v1 from "../components/assets/gallery/v1.mp4";
import v2 from "../components/assets/gallery/v2.mp4";
import v3 from "../components/assets/gallery/v3.mp4";

// Media items
const mediaItems = [
  { image: img1, text: "Opening Ceremony" },
  { image: v1, text: "Stage Highlights" },
  { image: img2, text: "Art Display" },
  { image: img3, text: "Cultural Celebration" },
  { image: img4, text: "Unity Parade" },
  { image: img5, text: "Drama Performance" },
  { image: v2, text: "Live Performances" },
  { image: img6, text: "Traditional Wear Day" },
  { image: img7, text: "Food Fest" },
  { image: img8, text: "Backstage Moments" },
  { image: img9, text: "Photo Booth" },
  { image: img10, text: "Music Jam" },
  { image: img11, text: "Group Photos" },
  { image: v3, text: "Highlight Reel" },
  { image: img12, text: "Flashmob Fun" },
  { image: img13, text: "College Spirit" },
  { image: img14, text: "Celebration Night" },
  { image: img15, text: "Closing Cheers" },
];

export default function OurMemories() {
  return (
    <section
      id="memories"
      style={{
        background: "black",
        color: "white",
        padding: "4rem 10% 0",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
          color: "#ffd700",
        }}
      >
        Our Memories
      </h2>
      <p
        style={{
          maxWidth: "700px",
          margin: "0 auto 2rem",
          fontSize: "1.1rem",
          color: "#ccc",
        }}
      >
        Here's a beautiful collection of moments we've lived, laughed, and
        celebrated together. From on-stage brilliance to candid backstage fun,
        these memories define the spirit of our club.
      </p>

      <div style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          items={mediaItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div>
    </section>
  );
}
