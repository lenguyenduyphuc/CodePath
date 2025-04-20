import { useEffect, useState } from "react";
import { supabase } from "./client";
import { Routes, Route } from "react-router-dom";
import CreateFruit from "./pages/CreateFruit";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import ReadFruits from "./pages/ReadFruits";
import FruitDetails from "./pages/FruitDetails";

const App = () => {
  const [fruitData, setFruitData] = useState([]);

  const fetchFruits = async () => {
    const { data, error } = await supabase.from("Fruits").select();
    if (error) {
      console.log("Error fetching the data: ", error.message);
    } else {
      setFruitData(data);
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    // Update later
    <div className="app">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateFruit />} />
          <Route path="/inventory" element={<ReadFruits />} />
          <Route path="/details/:id" element={<FruitDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
