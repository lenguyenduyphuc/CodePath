import React from "react";
import "./HomePage.css";

const MainPage = () => (
  <main className="main-page">
    <section className="hero">
      <h1 className="hero__title">Welcome to Blox Fruits</h1>
      <p className="hero__subtitle">Begin your journey across the open sea</p>

      <picture className="hero__banner">
        <img src="/Banner.png" alt="Blox Fruits banner" />
      </picture>

      <picture className="hero__fruits">
        <img src="/fruit.jpg" alt="Assorted Devil Fruits" />
      </picture>
    </section>
  </main>
);

export default MainPage;
