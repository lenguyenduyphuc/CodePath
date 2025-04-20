import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";
import "./EditFruit.css";

export default function EditFruit() {
  const { id } = useParams();

  const [fruit, setFruit] = useState(null);
  const [fruitData, setFruitData] = useState({
    name: "",
    type: "",
    description: "",
    skills: "",
    cost: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFruit = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("Fruits")
        .select()
        .eq("id", Number(id))
        .single();

      if (!error) {
        setFruit(data);
        setFruitData({
          name: data.name,
          type: data.type,
          description: data.description,
          skills: data.skills,
          cost: data.cost,
        });
      } else {
        console.error("Supabase fetch error →", error);
      }
      setIsLoading(false);
    };

    fetchFruit();
  }, [id]);

  const handleChange = ({ target: { name, value } }) =>
    setFruitData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from("Fruits")
      .update(fruitData)
      .eq("id", Number(id));

    if (!error) {
      setFruit(fruitData);
      setTimeout(() => {
        window.alert("Fruit updated successfully!");
        setIsSaving(false);
      }, 500);
    } else {
      console.error("Error updating fruit: ", error);
      setIsSaving(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure you want to delete this fruit?")) {
      const { error } = await supabase
        .from("Fruits")
        .delete()
        .eq("id", Number(id));

      if (!error) {
        window.alert("Fruit deleted successfully!");
        window.location.href = "/inventory";
      } else {
        console.error("Error deleting fruit: ", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="edit-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading fruit data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-header">
        <img src="/Banner.png" alt="Blox Fruits banner" className="banner" />
        <h1>Update Fruit</h1>
      </div>

      <div className="edit-content">
        <div className="current-fruit-card">
          <div className="card-header">
            <h2>Current Information</h2>
            <div className="fruit-badge">{fruit.type}</div>
          </div>

          <div className="fruit-info">
            <div className="fruit-name">{fruit.name}</div>
            <div className="fruit-price">B$ {fruit.cost}</div>
          </div>

          <div className="info-divider"></div>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Description</span>
              <p className="info-value">{fruit.description}</p>
            </div>

            <div className="info-item">
              <span className="info-label">Skills</span>
              <p className="info-value">{fruit.skills}</p>
            </div>
          </div>
        </div>

        <form className="edit-form" onSubmit={handleSubmit}>
          <h2>Update Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <span className="label-text">Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={fruitData.name}
                onChange={handleChange}
                required
                placeholder="Fruit name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">
                <span className="label-text">Type</span>
              </label>
              <input
                id="type"
                name="type"
                type="text"
                value={fruitData.type}
                onChange={handleChange}
                required
                placeholder="Fruit type"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">
                <span className="label-text">Description</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={fruitData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the fruit's abilities and effects"
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">
                <span className="label-text">Skills</span>
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={fruitData.skills}
                onChange={handleChange}
                placeholder="Comma-separated skills"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cost">
                <span className="label-text">Cost (B$)</span>
              </label>
              <input
                id="cost"
                name="cost"
                type="number"
                value={fruitData.cost}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="update-button" disabled={isSaving}>
              {isSaving ? "Updating..." : "Update Fruit"}
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete Fruit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
