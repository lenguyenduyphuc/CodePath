import React, { useState, useEffect } from "react";
import BanList from "./Components/BanList";
import History from "./Components/History";
import "./App.css";

const App = () => {
  const CAT_API = import.meta.env.VITE_CAT_API_KEY;

  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banList, setBanList] = useState([]);
  const [allCats, setAllCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    const headers = new Headers({
      "Content-Type": "application/json",
      "x-api-key": CAT_API,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    try {
      // Get multiple images with breed information
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search?limit=25&has_breeds=1",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      // Process cats only if they have breed information
      const processedCats = result
        .filter((cat) => cat.breeds && cat.breeds.length > 0)
        .map((cat) => {
          const breed = cat.breeds[0];
          return {
            id: cat.id,
            name: breed.name,
            origin: breed.origin,
            weight: breed.weight?.metric,
            lifeSpan: breed.life_span,
            temperament: breed.temperament.split(", ")[0],
            imageUrl: cat.url,
          };
        });

      if (processedCats.length === 0) {
        setError("No cats with breed information found");
      } else {
        setAllCats(processedCats);
        setFilteredCats(processedCats);

        // Set random initial cat
        const randomIndex = Math.floor(Math.random() * processedCats.length);
        setCat(processedCats[randomIndex]);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching cats:", err);
      setError(`Failed to fetch cats: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter cats when banList changes
  useEffect(() => {
    if (allCats.length > 0) {
      const newFilteredCats = allCats.filter((catItem) => {
        return !banList.some((banned) => {
          const [attribute, value] = banned.split(":");
          return catItem[attribute] === value;
        });
      });

      setFilteredCats(newFilteredCats);

      // If current cat is banned, get a new one
      if (
        cat &&
        banList.some((banned) => {
          const [attribute, value] = banned.split(":");
          return cat[attribute] === value;
        })
      ) {
        getRandomCat();
      }
    }
  }, [banList]);

  // Function to get a random cat
  const getRandomCat = () => {
    if (filteredCats.length === 0) {
      setError("No cats available with current filters");
      setCat(null);
      return;
    }

    setError(null);
    const randomIndex = Math.floor(Math.random() * filteredCats.length);
    const newCat = filteredCats[randomIndex];
    setCat(newCat);

    // Add cat to history
    if (newCat) {
      setHistory((prevHistory) => [newCat, ...prevHistory]);
    }
  };

  // Function to handle clicking on an attribute
  const handleAttributeClick = (attribute, value) => {
    const banItem = `${attribute}:${value}`;

    if (banList.includes(banItem)) {
      setBanList(banList.filter((item) => item !== banItem));
    } else {
      setBanList([...banList, banItem]);
    }
  };

  // Check if an attribute is banned
  const isAttributeBanned = (attribute, value) => {
    return banList.includes(`${attribute}:${value}`);
  };

  // Handle fetch more cats when needed
  const handleDiscoverClick = () => {
    if (filteredCats.length < 5) {
      fetchCats();
    } else {
      getRandomCat();
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="main-content">
          <h1>Veni Vici!</h1>
          <p className="subtitle">Discover cats from your wildest dreams!</p>
          <div className="emoji-row">😺 😸 😹 😻 😼 😽 😾 😿 🙀</div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : cat ? (
            <div className="cat-display">
              <h2>{cat.name}</h2>

              <div className="attributes">
                <div
                  className={`attribute ${
                    isAttributeBanned("name", cat.name) ? "banned" : ""
                  }`}
                  onClick={() => handleAttributeClick("name", cat.name)}
                >
                  {cat.name}
                </div>
                <div
                  className={`attribute ${
                    isAttributeBanned("weight", cat.weight) ? "banned" : ""
                  }`}
                  onClick={() => handleAttributeClick("weight", cat.weight)}
                >
                  {cat.weight} kg
                </div>
                <div
                  className={`attribute ${
                    isAttributeBanned("origin", cat.origin) ? "banned" : ""
                  }`}
                  onClick={() => handleAttributeClick("origin", cat.origin)}
                >
                  {cat.origin}
                </div>
                <div
                  className={`attribute ${
                    isAttributeBanned("lifeSpan", cat.lifeSpan) ? "banned" : ""
                  }`}
                  onClick={() => handleAttributeClick("lifeSpan", cat.lifeSpan)}
                >
                  {cat.lifeSpan} years
                </div>
              </div>

              <div className="cat-image-container">
                <img src={cat.imageUrl} alt={cat.name} className="cat-image" />
              </div>
            </div>
          ) : (
            <div className="no-cats">No cats available</div>
          )}

          <button
            className="discover-button"
            onClick={handleDiscoverClick}
            disabled={
              loading || (filteredCats.length === 0 && banList.length > 0)
            }
          >
            📱 Discover!
          </button>
        </div>

        <BanList
          banList={banList}
          handleAttributeClick={handleAttributeClick}
          filteredCats={filteredCats}
          allCats={allCats}
        />
        <History clearHistory={clearHistory} history={history} />
      </div>
    </div>
  );
};

export default App;
