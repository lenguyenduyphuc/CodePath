"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { Home, BarChart2, Search, Star, Map, Menu, X } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="logo-svg"
              >
                <path
                  d="M17 11H7V4C7 3.45 7.45 3 8 3H16C16.55 3 17 3.45 17 4V11Z"
                  fill="currentColor"
                />
                <path
                  d="M18 21H6C5.45 21 5 20.55 5 20V12C5 11.45 5.45 11 6 11H18C18.55 11 19 11.45 19 12V20C19 20.55 18.55 21 18 21Z"
                  fill="currentColor"
                />
                <path d="M8 16H10V18H8V16Z" fill="#fff" />
                <path d="M11 14H13V16H11V14Z" fill="#fff" />
                <path d="M14 16H16V18H14V16Z" fill="#fff" />
              </svg>
            </div>
            <span className="logo-text">BrewFinder</span>
          </div>

          <div className="navbar-links desktop-nav">
            <NavItem
              to="/"
              icon={<Home size={20} />}
              label="Home"
              isActive={location.pathname === "/"}
            />
            <NavItem
              to="/dashboard"
              icon={<BarChart2 size={20} />}
              label="Dashboard"
              isActive={location.pathname === "/dashboard"}
            />
            <NavItem
              to="/search"
              icon={<Search size={20} />}
              label="Search"
              isActive={location.pathname === "/search"}
            />
            <NavItem
              to="/favorites"
              icon={<Star size={20} />}
              label="Favorites"
              isActive={location.pathname === "/favorites"}
            />
            <NavItem
              to="/map"
              icon={<Map size={20} />}
              label="Map View"
              isActive={location.pathname === "/map"}
            />
          </div>

          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      Mobile menu
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <NavItem
            to="/"
            icon={<Home size={24} />}
            label="Home"
            isActive={location.pathname === "/"}
            onClick={closeMobileMenu}
          />
          <NavItem
            to="/dashboard"
            icon={<BarChart2 size={24} />}
            label="Dashboard"
            isActive={location.pathname === "/dashboard"}
            onClick={closeMobileMenu}
          />
          <NavItem
            to="/search"
            icon={<Search size={24} />}
            label="Search"
            isActive={location.pathname === "/search"}
            onClick={closeMobileMenu}
          />
          <NavItem
            to="/favorites"
            icon={<Star size={24} />}
            label="Favorites"
            isActive={location.pathname === "/favorites"}
            onClick={closeMobileMenu}
          />
          <NavItem
            to="/map"
            icon={<Map size={24} />}
            label="Map View"
            isActive={location.pathname === "/map"}
            onClick={closeMobileMenu}
          />
        </div>
      </div>
    </>
  );
};

export default NavBar;
