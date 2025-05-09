"use client";

import { useState, useEffect } from "react";
import MainSection from "../components/MainSection";

const DashBoard = () => {
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byType: {},
    byState: {},
  });

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    fetch("https://api.openbrewerydb.org/v1/breweries/meta")
      .then((response) => response.json())
      .then((data) => {
        setStats({
          total: data.total,
          byType: data.by_type,
          byState: data.by_state,
        });
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Your Brewery Dashboard</h1>
        <p>Track your favorite breweries and discover new ones</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Breweries</h3>
          <p className="stat-value">{stats.total.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Favorites</h3>
          <p className="stat-value">{favorites.length}</p>
        </div>
        <div className="stat-card">
          <h3>Most Common Type</h3>
          <p className="stat-value">
            {Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0]?.[0] ||
              "Micro"}
          </p>
        </div>
      </div>

      <MainSection />
    </div>
  );
};

export default DashBoard;
