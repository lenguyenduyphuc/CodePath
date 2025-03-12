import { useState, useEffect } from "react";
import Card from "./components/Card";
import questions from "./data.json";
import "./App.css";

const App = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState("all");
  const [filteredQuestions, setFilteredQuestions] = useState(questions);

  useEffect(() => {
    if (difficulty === "all") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
      setIndex(0);
      setFlipped(false);
      setFilteredQuestions(filtered);
    }
  }, [difficulty]);

  const handleNext = () => {
    setFlipped(false);
    setIndex((index) => (index + 1) % filteredQuestions.length);
  };

  const handleBack = () => {
    setFlipped(false);
    setIndex(
      (index) =>
        (index - 1 + filteredQuestions.length) % filteredQuestions.length
    );
  };

  const handleDifficulty = (difficulty) => {
    setDifficulty(difficulty);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="app-title">The Ultimate LLM Quiz</h1>
        <p className="app-subtitle">
          How well do you know Large Language Models :? Test your knowledge
          here!
        </p>

        <div className="difficulty-filter">
          <button
            className={`difficulty-button all ${
              difficulty === "all" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("all")}
          >
            All
          </button>
          <button
            className={`difficulty-button easy ${
              difficulty === "easy" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("easy")}
          >
            Easy
          </button>
          <button
            className={`difficulty-button medium ${
              difficulty === "medium" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("medium")}
          >
            Medium
          </button>
          <button
            className={`difficulty-button hard ${
              difficulty === "hard" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("hard")}
          >
            Hard
          </button>
        </div>

        <p className="card-counter">
          Card {index + 1} of {filteredQuestions.length}
        </p>

        <div className="card-container">
          <Card
            question={filteredQuestions[index].question}
            answer={filteredQuestions[index].answer}
            difficulty={filteredQuestions[index].difficulty}
            isFlipped={flipped}
            onClick={() => setFlipped(!flipped)}
            image={filteredQuestions[index].image}
          />
        </div>

        <div className="navigation-buttons">
          <button
            onClick={handleBack}
            className="nav-button"
            aria-label="Previous card"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            onClick={handleNext}
            className="nav-button"
            aria-label="Next card"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {filteredQuestions.length > 1 && (
          <div className="progress-indicator">
            {filteredQuestions.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === index ? "active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
