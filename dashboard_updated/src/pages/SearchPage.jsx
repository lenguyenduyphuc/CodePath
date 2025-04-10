import React from "react";
import Search from "../components/Search";

const SearchPage = () => {
  return (
    <div className="landing-page">
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
    </div>
  );
};

export default SearchPage;
