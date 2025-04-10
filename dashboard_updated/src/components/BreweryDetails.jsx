import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Globe,
  ArrowLeft,
  Star,
  Share2,
  Clock,
  Map,
  Info,
  Loader,
} from "lucide-react";
import DetailsChart from "./DetailsChart";

const BreweryDetails = () => {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const fetchBrewery = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openbrewerydb.org/v1/breweries/${id}`
        );

        const data = await response.json();
        setBrewery(data);

        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          setIsFavorite(favorites.some((fav) => fav.id === data.id));
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching brewery:", error);
        setError("Failed to load brewery details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrewery();
  }, [id]);

  const formatPhone = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(
        3,
        6
      )}-${cleaned.substring(6, 10)}`;
    }
    return phone;
  };

  const toggleFavorite = () => {
    if (!brewery) return;

    const savedFavorites = localStorage.getItem("favorites");
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (isFavorite) {
      favorites = favorites.filter((fav) => fav.id !== brewery.id);
    } else {
      favorites.push(brewery);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const shareBrewery = () => {
    if (navigator.share && brewery) {
      navigator
        .share({
          title: brewery.name,
          text: `Check out ${brewery.name}, a ${brewery.brewery_type} brewery in ${brewery.city}, ${brewery.state}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Error copying to clipboard:", err));
    }
  };

  const capitalizeBreweryType = (type) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (brewery && brewery.latitude && brewery.longitude) {
      const loadMap = () => {
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${brewery.latitude},${brewery.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:purple%7C${brewery.latitude},${brewery.longitude}&key=YOUR_API_KEY`;
        setMapLoaded(true);
        return mapUrl;
      };
      loadMap();
    }
  }, [brewery]);

  if (loading) {
    return (
      <div className="brewery-details-loading">
        <div className="loading-spinner">
          <div className="spinner-beer">
            <div className="beer-foam"></div>
            <div className="beer-liquid"></div>
          </div>
        </div>
        <p>Loading brewery details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brewery-details-error">
        <Info size={48} className="error-icon" />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={16} />
          <span>Back to Breweries</span>
        </Link>
      </div>
    );
  }

  if (!brewery) {
    return (
      <div className="brewery-details-error">
        <Info size={48} className="error-icon" />
        <h2>Brewery Not Found</h2>
        <p>The brewery you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={16} />
          <span>Back to Breweries</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="brewery-details-page">
      <DetailsChart brewery={brewery} />
      <div className="brewery-details-header">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={16} />
          <span>Back to Breweries</span>
        </Link>
        <div className="brewery-actions">
          <button
            className={`action-button favorite-button ${
              isFavorite ? "favorited" : ""
            }`}
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Star size={18} />
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </button>
          <button
            className="action-button share-button"
            onClick={shareBrewery}
            aria-label="Share brewery"
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="brewery-details-content">
        <div className="brewery-main-info">
          <div className="brewery-title-section">
            <h1 className="brewery-name">{brewery.name}</h1>
            <span className="brewery-type">
              {capitalizeBreweryType(brewery.brewery_type)}
            </span>
          </div>

          <div className="brewery-address">
            <MapPin className="address-icon" />
            <div className="address-text">
              <p>{brewery.address_1}</p>
              {brewery.address_2 && <p>{brewery.address_2}</p>}
              <p>
                {brewery.city}, {brewery.state} {brewery.postal_code}
              </p>
              <p>{brewery.country}</p>
            </div>
          </div>

          <div className="brewery-contact">
            {brewery.phone && (
              <div className="contact-item">
                <Phone className="contact-icon" />
                <a href={`tel:${brewery.phone}`} className="contact-text">
                  {formatPhone(brewery.phone)}
                </a>
              </div>
            )}

            {brewery.website_url && (
              <div className="contact-item">
                <Globe className="contact-icon" />
                <a
                  href={brewery.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-text website-link"
                >
                  {brewery.website_url.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="brewery-details-sections">
          <div className="brewery-map-section">
            <h2 className="section-title">
              <Map className="section-icon" />
              <span>Location</span>
            </h2>

            <div className="map-container">
              {brewery.latitude && brewery.longitude ? (
                mapLoaded ? (
                  <div className="map-wrapper">
                    <div className="map-overlay">
                      <p>Interactive map available in production version</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${brewery.latitude},${brewery.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="directions-button"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="map-loading">
                    <Loader className="map-loading-icon" />
                    <span>Loading map...</span>
                  </div>
                )
              ) : (
                <div className="no-map-data">
                  <Info className="no-data-icon" />
                  <p>No location data available for this brewery</p>
                </div>
              )}
            </div>
          </div>

          <div className="brewery-info-section">
            <h2 className="section-title">
              <Info className="section-icon" />
              <span>Brewery Information</span>
            </h2>

            <div className="info-grid">
              <div className="info-item">
                <h3>Type</h3>
                <p>{capitalizeBreweryType(brewery.brewery_type)}</p>
              </div>

              <div className="info-item">
                <h3>City</h3>
                <p>{brewery.city}</p>
              </div>

              <div className="info-item">
                <h3>State</h3>
                <p>{brewery.state}</p>
              </div>

              <div className="info-item">
                <h3>Country</h3>
                <p>{brewery.country}</p>
              </div>
            </div>
          </div>

          <div className="brewery-hours-section">
            <h2 className="section-title">
              <Clock className="section-icon" />
              <span>Hours of Operation</span>
            </h2>

            <div className="hours-disclaimer">
              <p>
                Hours information is not provided by the Open Brewery DB API.
              </p>
              <p>Please visit the brewery's website for accurate hours.</p>

              {brewery.website_url && (
                <a
                  href={brewery.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-button"
                >
                  <Globe size={16} />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreweryDetails;
