import React from "react";
import "./FruitCard.css";
import { Link } from "react-router-dom";

const FruitCard = ({ fruit }) => {
  const art = {
    Elemental: "./elemental.webp",
    Natural: "./natural.webp",
    Beast: "./beast.webp",
  };

  // Get a color based on fruit type
  const getTypeColor = (type) => {
    switch (type) {
      case "Elemental":
        return "#4cc9f0";
      case "Natural":
        return "#4ade80";
      case "Beast":
        return "#f87171";
      default:
        return "#a78bfa";
    }
  };

  return (
    <div className="card" style={{ "--type-color": getTypeColor(fruit.type) }}>
      <div className="card-image-container">
        <img src={art[fruit.type] || "/placeholder.svg"} alt={fruit.name} />
        <div className="card-type">{fruit.type}</div>
      </div>

      <div className="card-content">
        <h2 className="card-title">{fruit.name}</h2>

        <div className="card-info">
          <div className="info-item">
            <h3>Description</h3>
            <p>{fruit.description}</p>
          </div>

          <div className="info-item">
            <h3>Skills</h3>
            <p>{fruit.skills}</p>
          </div>

          <div className="info-item cost">
            <h3>Cost</h3>
            <p>{fruit.cost}</p>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/details/${fruit.id}`} className="view-button">
          View Details
        </Link>
        <Link to={`/edit/${fruit.id}`} className="edit-button">
          Edit Fruit
        </Link>
      </div>
    </div>
  );
};

export default FruitCard;
