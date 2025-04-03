"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Trash2,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
  Info,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name:asc");
  const [filterType, setFilterType] = useState("");
  const [filterState, setFilterState] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueStates, setUniqueStates] = useState([]);
  const [animateCards, setAnimateCards] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      setFavorites(parsedFavorites);
      setFilteredFavorites(parsedFavorites);

      // Extract unique brewery types and states for filters
      const types = [
        ...new Set(
          parsedFavorites.map((brewery) => brewery.brewery_type).filter(Boolean)
        ),
      ];
      const states = [
        ...new Set(
          parsedFavorites.map((brewery) => brewery.state).filter(Boolean)
        ),
      ];

      setUniqueTypes(types.sort());
      setUniqueStates(states.sort());
    }

    // Trigger animation after data is loaded
    setTimeout(() => {
      setAnimateCards(true);
    }, 100);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...favorites];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (brewery) =>
          brewery.name.toLowerCase().includes(query) ||
          (brewery.city && brewery.city.toLowerCase().includes(query)) ||
          (brewery.state && brewery.state.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (filterType) {
      result = result.filter((brewery) => brewery.brewery_type === filterType);
    }

    // Apply state filter
    if (filterState) {
      result = result.filter((brewery) => brewery.state === filterState);
    }

    // Apply sorting
    const [sortField, sortDirection] = sortBy.split(":");
    result.sort((a, b) => {
      const valueA = (a[sortField] || "").toLowerCase();
      const valueB = (b[sortField] || "").toLowerCase();

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    setFilteredFavorites(result);

    // Reset animation state when filters change
    setAnimateCards(false);
    setTimeout(() => {
      setAnimateCards(true);
    }, 100);
  }, [favorites, searchQuery, sortBy, filterType, filterState]);

  // Remove a brewery from favorites
  const removeFavorite = (breweryId) => {
    const updatedFavorites = favorites.filter(
      (brewery) => brewery.id !== breweryId
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      setFavorites([]);
      localStorage.setItem("favorites", JSON.stringify([]));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterType("");
    setFilterState("");
    setSortBy("name:asc");
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

  // Capitalize brewery type
  const capitalizeBreweryType = (type) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Your Favorite Breweries</h1>
        <p>Manage and explore your saved breweries</p>
      </div>

      {favorites.length > 0 ? (
        <>
          <div className="favorites-filter">
            <div className="filter-header">
              <h3 className="filter-title">
                <Star className="filter-title-icon" />
                Favorites
                <span className="favorites-count">{favorites.length}</span>
              </h3>

              <div className="filter-actions">
                <button
                  className="filter-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="toggle-icon" />
                  <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                  <ChevronDown
                    className={`chevron-icon ${showFilters ? "rotate" : ""}`}
                  />
                </button>

                {(searchQuery || filterType || filterState) && (
                  <button className="reset-button" onClick={resetFilters}>
                    <X className="reset-icon" />
                    <span>Reset Filters</span>
                  </button>
                )}

                {favorites.length > 0 && (
                  <button
                    className="clear-all-button"
                    onClick={clearAllFavorites}
                  >
                    <Trash2 className="trash-icon" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search bar */}
            <div className="search-container">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="clear-icon" />
                  </button>
                )}
              </div>
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="filters-grid">
                {/* Brewery type filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <Star className="label-icon" />
                    <span>Brewery Type</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      className="filter-select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                          {capitalizeBreweryType(type)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="select-icon" />
                  </div>
                  {filterType && (
                    <button
                      className="clear-filter"
                      onClick={() => setFilterType("")}
                      aria-label="Clear brewery type filter"
                    >
                      <X className="clear-filter-icon" />
                    </button>
                  )}
                </div>

                {/* State filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <MapPin className="label-icon" />
                    <span>State</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      className="filter-select"
                      value={filterState}
                      onChange={(e) => setFilterState(e.target.value)}
                    >
                      <option value="">All States</option>
                      {uniqueStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="select-icon" />
                  </div>
                  {filterState && (
                    <button
                      className="clear-filter"
                      onClick={() => setFilterState("")}
                      aria-label="Clear state filter"
                    >
                      <X className="clear-filter-icon" />
                    </button>
                  )}
                </div>

                {/* Sort by filter */}
                <div className="filter-group">
                  <label className="filter-label">
                    <ArrowUpDown className="label-icon" />
                    <span>Sort By</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      className="filter-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name:asc">Name (A-Z)</option>
                      <option value="name:desc">Name (Z-A)</option>
                      <option value="brewery_type:asc">Type (A-Z)</option>
                      <option value="brewery_type:desc">Type (Z-A)</option>
                      <option value="city:asc">City (A-Z)</option>
                      <option value="city:desc">City (Z-A)</option>
                      <option value="state:asc">State (A-Z)</option>
                      <option value="state:desc">State (Z-A)</option>
                    </select>
                    <ChevronDown className="select-icon" />
                  </div>
                </div>
              </div>
            )}

            {/* Active filters display */}
            {(searchQuery || filterType || filterState) && (
              <div className="active-filters">
                <div className="active-filters-header">
                  <span className="active-filters-title">Active Filters:</span>
                  <button className="clear-all-filters" onClick={resetFilters}>
                    Clear All
                  </button>
                </div>
                <div className="filter-tags">
                  {searchQuery && (
                    <div className="filter-tag">
                      <span>Search: {searchQuery}</span>
                      <button onClick={() => setSearchQuery("")}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {filterType && (
                    <div className="filter-tag">
                      <span>Type: {capitalizeBreweryType(filterType)}</span>
                      <button onClick={() => setFilterType("")}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {filterState && (
                    <div className="filter-tag">
                      <span>State: {filterState}</span>
                      <button onClick={() => setFilterState("")}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {filteredFavorites.length > 0 ? (
            <div className="favorites-grid">
              {filteredFavorites.map((brewery, index) => (
                <div
                  key={brewery.id}
                  className={`brewery-card favorite-card ${
                    animateCards ? "animate-in" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="brewery-card-content">
                    <div className="brewery-header">
                      <h3 className="brewery-name">{brewery.name}</h3>
                      <span className="brewery-type">
                        {capitalizeBreweryType(brewery.brewery_type)}
                      </span>
                    </div>

                    <div className="brewery-details">
                      {(brewery.address_1 || brewery.street) && (
                        <div className="brewery-detail">
                          <MapPin className="detail-icon" />
                          <span>
                            {brewery.address_1 || brewery.street},{" "}
                            {brewery.city}, {brewery.state}{" "}
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
                        className="remove-favorite-button"
                        onClick={() => removeFavorite(brewery.id)}
                      >
                        <Trash2 className="remove-icon" />
                        <span>Remove</span>
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
            <div className="no-filtered-results">
              <div className="no-results-content">
                <Info className="no-results-icon" />
                <h3>No matching favorites</h3>
                <p>No breweries match your current filters.</p>
                <button onClick={resetFilters} className="reset-button">
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-favorites">
          <div className="empty-favorites-content">
            <div className="empty-icon-container">
              <Star className="empty-icon" />
            </div>
            <h2>No Favorites Yet</h2>
            <p>You haven't added any breweries to your favorites yet.</p>
            <p>
              Explore breweries and click the star icon to add them to your
              favorites.
            </p>
            <Link to="/dashboard" className="explore-button">
              Explore Breweries
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
