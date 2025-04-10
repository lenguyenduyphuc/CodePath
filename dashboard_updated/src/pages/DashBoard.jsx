import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainSection from "../components/MainSection";
import BreweryCharts from "../components/Chart";

const DashBoard = () => {
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byType: {},
    byState: {},
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Load favorites from local storage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Get stats data
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

    // Handle search query if present
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      setIsLoading(true);
      setError(null);

      // Check if query is a brewery type (case insensitive match)
      const breweryTypes = [
        "micro",
        "nano",
        "regional",
        "brewpub",
        "large",
        "planning",
        "bar",
        "contract",
        "proprietor",
        "closed",
      ];
      const queryLower = query.toLowerCase();
      const isBreweryType = breweryTypes.includes(queryLower);

      // Choose appropriate endpoint based on query
      const apiUrl = isBreweryType
        ? `https://api.openbrewerydb.org/v1/breweries?by_type=${queryLower}`
        : `https://api.openbrewerydb.org/v1/breweries/search?query=${encodeURIComponent(
            query
          )}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch search results");
          }
          return response.json();
        })
        .then((data) => {
          setSearchResults(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error searching breweries:", error);
          setError("Failed to load search results. Please try again.");
          setIsLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [location.search]);

  // Function to add to favorites
  const addToFavorites = (brewery) => {
    const newFavorites = [...favorites, brewery];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Function to remove from favorites
  const removeFromFavorite = (breweryId) => {
    const newFavorites = favorites.filter((fav) => fav.id !== breweryId);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Check if brewery is in favorites
  const isInFavorites = (breweryId) => {
    return favorites.some((fav) => fav.id === breweryId);
  };

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

      {/* Search Results Section */}
      {isLoading && <div className="loading">Loading search results...</div>}

      {error && <div className="error-message">{error}</div>}

      {searchResults.length > 0 && (
        <div className="search-results-section">
          <h2>Search Results</h2>
          <div className="brewery-results-grid">
            {searchResults.map((brewery) => (
              <div key={brewery.id} className="brewery-card">
                <h3>{brewery.name}</h3>
                <p className="brewery-type">{brewery.brewery_type}</p>
                <p className="brewery-address">
                  {brewery.city}, {brewery.state}
                </p>
                {brewery.website_url && (
                  <a
                    href={brewery.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brewery-website"
                  >
                    Visit Website
                  </a>
                )}
                <button
                  className={`favorite-button ${
                    isInFavorites(brewery.id) ? "favorited" : ""
                  }`}
                  onClick={() =>
                    isInFavorites(brewery.id)
                      ? removeFromFavorite(brewery.id)
                      : addToFavorites(brewery)
                  }
                >
                  {isInFavorites(brewery.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 &&
        new URLSearchParams(location.search).get("query") &&
        !isLoading && (
          <div className="no-results">
            <h2>No breweries found matching your search</h2>
            <p>Try different keywords or browse our brewery directory</p>
          </div>
        )}

      <BreweryCharts byType={stats.byType} byState={stats.byState} />
      <MainSection />
    </div>
  );
};

export default DashBoard;
