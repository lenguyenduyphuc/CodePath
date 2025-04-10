import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import DashBoard from "./pages/DashBoard";
import BreweryDetails from "./components/BreweryDetails";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="stars-bg"></div>
        <div className="app-content">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/breweries/:id" element={<BreweryDetails />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
