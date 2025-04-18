import React, { useEffect, useState } from "react";
import FruitCard from "../components/FruitCard";
import { supabase } from "../client";
import "./ReadFruits.css";

const ReadFruits = () => {
  const [fruits, setFruits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFruits = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("Fruits").select();
    if (error) {
      console.log("Error fetching fruits: ", error);
    } else {
      setFruits(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    <div className="inventory-wrapper">
      <h1 className="inventory-title">Your Blox Fruit Inventory</h1>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : fruits.length === 0 ? (
        <div className="inventory-empty">
          <h2>Your inventory is empty</h2>
          <p>Start collecting fruits to see them here!</p>
        </div>
      ) : (
        <div className="fruit-grid">
          {fruits.map((fruit) => (
            <FruitCard key={fruit.id} fruit={fruit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadFruits;
