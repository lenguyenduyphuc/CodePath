"use client";

import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import DetailsPage from "./pages/DetailsPage";
import ThemeToggle from "./components/ThemeToggle";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          <header className="app-header">
            <div className="container">
              <div className="header-content">
                <Link to="/" className="logo">
                  ForumApp
                </Link>

                <div className="header-controls">
                  {location.pathname === "/" && (
                    <div
                      className={`search-container ${
                        isSearchVisible ? "active" : ""
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                      />
                      <button className="search-toggle" onClick={toggleSearch}>
                        {isSearchVisible ? "✕" : "🔍"}
                      </button>
                    </div>
                  )}
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          <main className="app-main">
            <div className="container">
              <Routes>
                <Route
                  path="/"
                  element={<MainPage searchTerm={searchTerm} />}
                />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/edit/:id" element={<EditPage />} />
                <Route path="/details/:id" element={<DetailsPage />} />
              </Routes>
            </div>
          </main>

          <footer className="app-footer">
            <div className="container">
              <p>© {new Date().getFullYear()} ForumApp. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
