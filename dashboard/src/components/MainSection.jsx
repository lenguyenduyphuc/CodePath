"use client";

import { useEffect, useState } from "react";
import BreweryFilter from "./BreweryFilter";
import { MapPin, Phone, Globe, Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const MainSection = () => {
  const [breweries, setBreweries] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true);
      try {
        // Build URL with filter parameters
        const url = new URL("https://api.openbrewerydb.org/v1/breweries");

        // Add all filters to URL parameters
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            url.searchParams.append(key, value);
          }
        });

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        setBreweries(data);
        setError(null);

        // Trigger animation after data is loaded
        setTimeout(() => {
          setAnimateCards(true);
        }, 100);
      } catch (error) {
        console.error("Error fetching breweries:", error);
        setError("Failed to load breweries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();

    // Reset animation state when filters change
    setAnimateCards(false);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return "";
    // Clean the phone string to contain only digits
    const cleaned = phone.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(
        3,
        6
      )}-${cleaned.substring(6, 10)}`;
    }
    return phone;
  };

  // Toggle favorite
  const toggleFavorite = (brewery) => {
    const newFavorites = [...favorites];
    const index = newFavorites.findIndex((fav) => fav.id === brewery.id);

    if (index >= 0) {
      newFavorites.splice(index, 1);
    } else {
      newFavorites.push(brewery);
    }

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Check if brewery is favorited
  const isFavorite = (breweryId) => {
    return favorites.some((fav) => fav.id === breweryId);
  };

  return (
    <div className="main-section">
      <div className="section-header">
        <h2>Discover Breweries</h2>
        <p className="section-description">
          Find and explore unique breweries from around the country
        </p>
      </div>

      <BreweryFilter onFilterChange={handleFilterChange} />

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-beer">
              <div className="beer-foam"></div>
              <div className="beer-liquid"></div>
            </div>
          </div>
          <p>Loading breweries...</p>
        </div>
      ) : breweries.length > 0 ? (
        <div className="brewery-grid">
          {breweries.map((brewery, index) => (
            <div
              key={brewery.id}
              className={`brewery-card ${animateCards ? "animate-in" : ""}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="brewery-card-content">
                <div className="brewery-header">
                  <h3 className="brewery-name">{brewery.name}</h3>
                  <span className="brewery-type">{brewery.brewery_type}</span>
                </div>

                <div className="brewery-details">
                  {brewery.street && (
                    <div className="brewery-detail">
                      <MapPin className="detail-icon" />
                      <span>
                        {brewery.street}, {brewery.city}, {brewery.state}{" "}
                        {brewery.postal_code}
                      </span>
                    </div>
                  )}

                  {brewery.phone && (
                    <div className="brewery-detail">
                      <Phone className="detail-icon" />
                      <span>{formatPhone(brewery.phone)}</span>
                    </div>
                  )}

                  {brewery.website_url && (
                    <div className="brewery-detail">
                      <Globe className="detail-icon" />
                      <a
                        href={brewery.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {brewery.website_url.replace(/^https?:\/\//, "")}
                        <ExternalLink
                          size={12}
                          className="external-link-icon"
                        />
                      </a>
                    </div>
                  )}
                </div>

                <div className="brewery-actions">
                  <button
                    className={`favorite-button ${
                      isFavorite(brewery.id) ? "favorited" : ""
                    }`}
                    onClick={() => toggleFavorite(brewery)}
                  >
                    <Star className="favorite-icon" />
                    <span>
                      {isFavorite(brewery.id) ? "Favorited" : "Favorite"}
                    </span>
                  </button>

                  <Link
                    to={`/breweries/${brewery.id}`}
                    className="details-button"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-content">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="no-results-icon"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 15H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9H9.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 9H15.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>No breweries found matching your criteria.</p>
            <button onClick={() => setFilters({})} className="reset-button">
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSection;
