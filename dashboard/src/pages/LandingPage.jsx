import { useState, useEffect } from "react";
import MainSection from "../components/MainSection";
import Search from "../components/Search";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {isLoading ? (
        <div className="loading-screen">
          <div className="loader">
            <div className="beer-mug">
              <div className="beer-foam"></div>
              <div className="beer-liquid"></div>
            </div>
            <p>Loading Breweries...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Discover Amazing Breweries</h1>
              <p className="hero-subtitle">
                Find the best craft breweries across the country
              </p>
              <Search />
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">8,500+</span>
                  <span className="stat-label">Breweries</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50</span>
                  <span className="stat-label">States</span>
                </div>
                <div className="stat">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Brewery Types</span>
                </div>
              </div>
            </div>
          </div>
          <MainSection />
        </>
      )}
    </div>
  );
};

export default LandingPage;
