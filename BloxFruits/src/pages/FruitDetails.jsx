import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client";
import "./FruitDetails.css";

export default function FruitDetails() {
  const { id } = useParams();
  const [fruit, setFruit] = useState(null);

  const art = {
    Elemental: "/elemental.webp",
    Natural: "/natural.webp",
    Beast: "/beast.webp",
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("Fruits")
        .select()
        .eq("id", Number(id))
        .single();

      if (!error) setFruit(data);
      else console.error("Supabase fetch error →", error);
    })();
  }, [id]);

  console.log(fruit);

  if (!fruit) return <section className="details‑card">Loading…</section>;

  return (
    <section className="details‑card">
      <header>
        <h1>{fruit.name}</h1>
        <span className="pill">{fruit.type}</span>
        {fruit.rarity && <span className="pill rare">{fruit.rarity}</span>}
      </header>

      <img src={art[fruit.type] || "/placeholder.svg"} alt={fruit.name} />

      <p className="desc">{fruit.description}</p>

      <ul className="stats">
        {fruit.skills && (
          <li>
            <strong>Skills:</strong> {fruit.skills}
          </li>
        )}
        {fruit.cost && (
          <li>
            <strong>Cost(B$):</strong> {fruit.cost}
          </li>
        )}
        {fruit.created_at && (
          <li>
            <strong>Added:</strong>{" "}
            {new Date(fruit.created_at).toLocaleString()}
          </li>
        )}
      </ul>
    </section>
  );
}
