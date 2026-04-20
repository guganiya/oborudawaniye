import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "./components/Hero";
import New from "./components/News";
import Newsletter from "./components/Newsletter";
import VideoSection from "./components/VideoSection";
import HighlightProducts from "./components/HighlightProducts.jsx";
import Applications from "./components/Applications.jsx";

const Home = () => {
  return (
    <div className="bg-white min-h-screen text-black selection:bg-[#e21e26] selection:text-white">
      <Navbar />

      <Hero />
      {/*<VideoSection />*/}
      <New />
      <HighlightProducts />
      <Applications />
      <Newsletter />

      <Footer />
    </div>
  );
};

export default Home;
