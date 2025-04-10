// BreweryList.jsx
import { useState, useEffect } from "react";
import BreweryFilter from "./BreweryFilter";

const BreweryList = () => {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 20,
    sort: "name:asc",
  });

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build URL with query parameters
        let baseUrl = "https://api.openbrewerydb.org/v1/breweries";
        const queryParams = new URLSearchParams();

        // Add all non-empty filters to query params
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            // Special handling for search query
            if (key === "query") {
              // Use search endpoint instead
              baseUrl = "https://api.openbrewerydb.org/v1/breweries/search";
            }
            queryParams.append(key, value);
          }
        });

        const url = `${baseUrl}?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setBreweries(data);
      } catch (err) {
        setError(err.message || "Failed to fetch breweries");
        console.error("Error fetching breweries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="brewery-list-container">
      <BreweryFilter onFilterChange={handleFilterChange} />

      {loading && <div className="loading-state">Loading breweries...</div>}
      {error && <div className="error-state">Error: {error}</div>}

      <div className="breweries-grid">
        {breweries.map((brewery) => (
          <div key={brewery.id} className="brewery-card">
            <h3>{brewery.name}</h3>
            <span className="brewery-type">{brewery.brewery_type}</span>
            <p>
              {brewery.city}, {brewery.state}
            </p>
            {/* Add more brewery details as needed */}
          </div>
        ))}
      </div>

      {!loading && breweries.length === 0 && (
        <div className="empty-state">
          No breweries found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default BreweryList;
