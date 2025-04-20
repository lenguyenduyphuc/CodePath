import React, { useState } from "react";
import "./CreateFruit.css";
import { supabase } from "../client";

const CreateFruit = () => {
  const [fruit, setFruit] = useState({
    name: "",
    type: "",
    description: "",
    skills: "",
    cost: "",
  });

  // Text, number, textarea inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFruit((prev) => ({ ...prev, [name]: value }));
  };

  // Radio group (Elemental ‑ Beast ‑ Natural)
  const handleTypeChange = (event) => {
    setFruit((prev) => ({ ...prev, type: event.target.value }));
  };

  const createFruit = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from("Fruits")
      .insert({
        name: fruit.name,
        type: fruit.type,
        description: fruit.description,
        skills: fruit.skills,
        cost: fruit.cost,
      })
      .select();

    if (error) console.log(error);

    window.location = "/";
  };

  return (
    <div className="whole-page-CF">
      <h1 className="create-title">Create a New Fruit</h1>

      {/* hero image */}
      <img
        src="Fruits.jpg"
        alt="Assorted mystical fruits"
        className="create-fruit-image"
      />

      <form className="form-container">
        {/* name */}
        <div className="mini-container">
          <label>
            <h3>Name:</h3>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter fruit name"
            value={fruit.name}
            onChange={handleChange}
          />
        </div>

        {/* description */}
        <div className="mini-container">
          <label>
            <h3>Description:</h3>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="What makes this fruit special?"
            value={fruit.description}
            onChange={handleChange}
          />
        </div>

        {/* skills */}
        <div className="mini-container">
          <label>
            <h3>Skills (comma‑separated):</h3>
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            placeholder="e.g. Healing, Speed Boost"
            value={fruit.skills}
            onChange={handleChange}
          />
        </div>

        {/* cost */}
        <div className="mini-container">
          <label>
            <h3>Cost(₲):</h3>
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            placeholder="Enter cost"
            value={fruit.cost}
            onChange={handleChange}
          />
        </div>

        {/* type radio buttons */}
        <div className="mini-container">
          <label>
            <h3>Type:</h3>
          </label>
          <ul>
            {["Elemental", "Beast", "Natural"].map((t) => (
              <li key={t}>
                <input
                  id={t}
                  name="type"
                  type="radio"
                  value={t}
                  onChange={handleTypeChange}
                  checked={fruit.type === t}
                />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" onClick={createFruit}>
          Create Fruit
        </button>
      </form>
    </div>
  );
};

export default CreateFruit;
