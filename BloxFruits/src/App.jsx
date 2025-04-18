import { useEffect, useState } from "react";
import { supabase } from "./client";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import CreateFruit from "./components/CreateFruit";
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
    <div className="app">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateFruit />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
