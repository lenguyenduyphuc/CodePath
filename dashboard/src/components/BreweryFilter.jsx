import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  MapPin,
  Building,
  Globe,
  X,
  ChevronDown,
  RefreshCw,
  Sliders,
  Check,
  ArrowUpDown,
} from "lucide-react";

const BreweryFilter = ({ onFilterChange }) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [breweryType, setBreweryType] = useState("");
  const [sortBy, setSortBy] = useState("name:asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic data states
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [breweryTypes, setBreweryTypes] = useState([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Use refs to prevent infinite loops
  const isInitialMount = useRef(true);
  const filtersRef = useRef({});
  const onFilterChangeRef = useRef(onFilterChange);

  // Update the onFilterChange ref when the prop changes
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  // Sort options
  const sortOptions = [
    { value: "name:asc", label: "Name (A-Z)" },
    { value: "name:desc", label: "Name (Z-A)" },
    { value: "type:asc", label: "Type (A-Z)" },
    { value: "type:desc", label: "Type (Z-A)" },
    { value: "city:asc", label: "City (A-Z)" },
    { value: "city:desc", label: "City (Z-A)" },
    { value: "state:asc", label: "State (A-Z)" },
    { value: "state:desc", label: "State (Z-A)" },
  ];

  // Per page options
  const perPageOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
  ];

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Fetch metadata on component mount
  useEffect(() => {
    if (isInitialMount.current) {
      fetchMetadata();
      isInitialMount.current = false;
    }
  }, []);

  // Count active filters - memoized to prevent unnecessary recalculations
  useEffect(() => {
    let count = 0;
    if (debouncedSearchQuery) count++;
    if (city) count++;
    if (state) count++;
    if (country) count++;
    if (postalCode) count++;
    if (breweryType) count++;
    setActiveFilters(count);
  }, [debouncedSearchQuery, city, state, country, postalCode, breweryType]);

  // Use a single effect to track filter changes and update the ref
  useEffect(() => {
    // Update the filtersRef with current values
    filtersRef.current = {
      query: debouncedSearchQuery || undefined,
      by_city: city || undefined,
      by_state: state || undefined,
      by_country: country || undefined,
      by_postal: postalCode || undefined,
      by_type: breweryType || undefined,
      sort: sortBy,
      page,
      per_page: perPage,
    };

    // Clean out undefined values
    Object.keys(filtersRef.current).forEach((key) => {
      if (filtersRef.current[key] === undefined) {
        delete filtersRef.current[key];
      }
    });

    // Use a timeout to batch the filter change notification
    // This prevents excessive re-renders from quick filter changes
    const timerId = setTimeout(() => {
      if (onFilterChangeRef.current) {
        onFilterChangeRef.current({ ...filtersRef.current });
      }
    }, 50);

    return () => clearTimeout(timerId);
  }, [
    debouncedSearchQuery,
    city,
    state,
    country,
    postalCode,
    breweryType,
    sortBy,
    page,
    perPage,
  ]);

  // Reset page when filters change (except page and perPage)
  useEffect(() => {
    // Don't reset on initial mount
    if (!isInitialMount.current) {
      setPage(1);
    }
  }, [debouncedSearchQuery, city, state, country, postalCode, breweryType]);

  // Fetch metadata from API with proper error handling
  const fetchMetadata = async () => {
    setIsLoadingMetadata(true);
    setMetadataError(null);

    try {
      // Fetch a sample of breweries to extract metadata
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        "https://api.openbrewerydb.org/v1/breweries?per_page=200",
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        // Extract unique cities, states, countries, and types
        const uniqueCities = [
          ...new Set(data.map((brewery) => brewery.city).filter(Boolean)),
        ].sort();
        const uniqueStates = [
          ...new Set(data.map((brewery) => brewery.state).filter(Boolean)),
        ].sort();
        const uniqueCountries = [
          ...new Set(data.map((brewery) => brewery.country).filter(Boolean)),
        ].sort();
        const uniqueTypes = [
          ...new Set(
            data.map((brewery) => brewery.brewery_type).filter(Boolean)
          ),
        ].sort();

        // Set the metadata
        setCities(uniqueCities.map((city) => ({ value: city, label: city })));
        setStates(
          uniqueStates.map((state) => ({ value: state, label: state }))
        );
        setCountries(
          uniqueCountries.map((country) => ({ value: country, label: country }))
        );
        setBreweryTypes(
          uniqueTypes.map((type) => ({
            value: type,
            label: capitalizeFirstLetter(type),
          }))
        );
      } else {
        throw new Error("No data returned from API");
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setMetadataError(
        error.name === "AbortError"
          ? "Request timed out. Please try again."
          : error.message
      );
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCity("");
    setState("");
    setCountry("");
    setPostalCode("");
    setBreweryType("");
    setSortBy("name:asc");
    setPage(1);
    setPerPage(20);
  }, []);

  return (
    <div className="brewery-filter">
      <div className="filter-header">
        <h3 className="filter-title">
          <Sliders className="filter-title-icon" />
          Filter Breweries
          {activeFilters > 0 && (
            <span className="active-filters-badge">{activeFilters}</span>
          )}
        </h3>

        <div className="filter-actions">
          <button
            className="refresh-button"
            onClick={fetchMetadata}
            disabled={isLoadingMetadata}
            title="Refresh filter options"
            aria-label="Refresh filter options"
          >
            <RefreshCw
              className={`refresh-icon ${isLoadingMetadata ? "spinning" : ""}`}
            />
          </button>

          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="expanded-filters"
          >
            <Filter className="toggle-icon" />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            <ChevronDown
              className={`chevron-icon ${showFilters ? "rotate" : ""}`}
            />
          </button>

          {activeFilters > 0 && (
            <button
              className="reset-button"
              onClick={resetFilters}
              aria-label="Reset all filters"
            >
              <X className="reset-icon" />
              <span>Reset All</span>
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
            placeholder="Search breweries by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search breweries by name"
          />
        </div>
      </div>

      {/* Metadata error message */}
      {metadataError && (
        <div className="metadata-error">
          Error loading filter options: {metadataError}.
          <button onClick={fetchMetadata} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Expanded filters */}
      {showFilters && (
        <div className="filters-grid" id="expanded-filters">
          {/* City filter */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="city-filter">
              <Building className="label-icon" />
              <span>City</span>
            </label>
            <div className="select-wrapper">
              <select
                id="city-filter"
                className="filter-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isLoadingMetadata}
              >
                <option value="">All Cities</option>
                {cities.map((cityOption) => (
                  <option key={cityOption.value} value={cityOption.value}>
                    {cityOption.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          {/* State filter */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="state-filter">
              <MapPin className="label-icon" />
              <span>State</span>
            </label>
            <div className="select-wrapper">
              <select
                id="state-filter"
                className="filter-select"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={isLoadingMetadata}
              >
                <option value="">All States</option>
                {states.map((stateOption) => (
                  <option key={stateOption.value} value={stateOption.value}>
                    {stateOption.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          {/* Country filter */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="country-filter">
              <Globe className="label-icon" />
              <span>Country</span>
            </label>
            <div className="select-wrapper">
              <select
                id="country-filter"
                className="filter-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isLoadingMetadata}
              >
                <option value="">All Countries</option>
                {countries.map((countryOption) => (
                  <option key={countryOption.value} value={countryOption.value}>
                    {countryOption.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          {/* Postal code filter */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="postal-filter">
              <MapPin className="label-icon" />
              <span>Postal Code</span>
            </label>
            <input
              id="postal-filter"
              type="text"
              className="filter-input"
              placeholder="Enter postal code..."
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          {/* Brewery type filter */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="type-filter">
              <Building className="label-icon" />
              <span>Brewery Type</span>
            </label>
            <div className="select-wrapper">
              <select
                id="type-filter"
                className="filter-select"
                value={breweryType}
                onChange={(e) => setBreweryType(e.target.value)}
                disabled={isLoadingMetadata}
              >
                <option value="">All Types</option>
                {breweryTypes.map((typeOption) => (
                  <option key={typeOption.value} value={typeOption.value}>
                    {typeOption.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          {/* Sort by filter */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="sort-filter">
              <ArrowUpDown className="label-icon" />
              <span>Sort By</span>
            </label>
            <div className="select-wrapper">
              <select
                id="sort-filter"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {activeFilters > 0 && (
        <div className="active-filters">
          <div className="active-filters-header">
            <span className="active-filters-title">Active Filters:</span>
            <button
              className="clear-all-filters"
              onClick={resetFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
          <div className="filter-tags">
            {debouncedSearchQuery && (
              <div className="filter-tag">
                <span>Search: {debouncedSearchQuery}</span>
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Remove search filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {city && (
              <div className="filter-tag">
                <span>City: {city}</span>
                <button
                  onClick={() => setCity("")}
                  aria-label="Remove city filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {state && (
              <div className="filter-tag">
                <span>State: {state}</span>
                <button
                  onClick={() => setState("")}
                  aria-label="Remove state filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {country && (
              <div className="filter-tag">
                <span>Country: {country}</span>
                <button
                  onClick={() => setCountry("")}
                  aria-label="Remove country filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {postalCode && (
              <div className="filter-tag">
                <span>Postal Code: {postalCode}</span>
                <button
                  onClick={() => setPostalCode("")}
                  aria-label="Remove postal code filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {breweryType && (
              <div className="filter-tag">
                <span>Type: {capitalizeFirstLetter(breweryType)}</span>
                <button
                  onClick={() => setBreweryType("")}
                  aria-label="Remove brewery type filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="pagination-controls">
        <div className="results-per-page">
          <span>Show:</span>
          <div className="per-page-options">
            {perPageOptions.map((option) => (
              <button
                key={option.value}
                className={`per-page-option ${
                  perPage === option.value ? "active" : ""
                }`}
                onClick={() => setPerPage(option.value)}
                aria-label={`Show ${option.label} results per page`}
                aria-pressed={perPage === option.value}
              >
                {option.label}
                {perPage === option.value && (
                  <Check className="check-icon" size={12} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pagination-buttons">
          <button
            className="pagination-button prev"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="page-display">Page {page}</span>
          <button
            className="pagination-button next"
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreweryFilter;
