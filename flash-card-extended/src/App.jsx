"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  CheckCircle,
  Award,
  Sparkles,
} from "lucide-react";
import Card from "./components/Card";
import questions from "./data.json";
import "./App.css";

const App = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState("all");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [masteredCards, setMasteredCards] = useState([]);
  const [showMastered, setShowMastered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  console.log(filteredQuestions);
  useEffect(() => {
    setFilteredQuestions(questions);
    setActiveQuestions(questions);
  }, []);

  useEffect(() => {
    if (difficulty === "all") {
      setFilteredQuestions(showMastered ? masteredCards : activeQuestions);
    } else {
      const questionsToFilter = showMastered ? masteredCards : activeQuestions;
      const filtered = questionsToFilter.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
      setIndex(0);
      setFlipped(false);
      setFilteredQuestions(filtered);
    }
  }, [difficulty, activeQuestions, masteredCards, showMastered]);

  const handleNext = () => {
    if (isAnimating || filteredQuestions.length <= 1) return;

    setIsAnimating(true);
    setFlipped(false);

    setTimeout(() => {
      setIndex((index) => (index + 1) % filteredQuestions.length);
      setIsAnimating(false);
    }, 100);
  };

  const handleBack = () => {
    if (isAnimating || filteredQuestions.length <= 1) return;

    setIsAnimating(true);
    setFlipped(false);

    setTimeout(() => {
      setIndex(
        (index) =>
          (index - 1 + filteredQuestions.length) % filteredQuestions.length
      );
      setIsAnimating(false);
    }, 100);
  };

  const handleShuffle = () => {
    if (isAnimating || filteredQuestions.length <= 1) return;

    setIsAnimating(true);
    setFlipped(false);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      setIndex(randomIndex);
      setIsAnimating(false);
    }, 100);
  };

  const handleDifficulty = (newDifficulty) => {
    if (difficulty === newDifficulty) return;

    setIsAnimating(true);
    setFlipped(false);

    setTimeout(() => {
      setDifficulty(newDifficulty);
      setIsAnimating(false);
    }, 100);
  };

  const handleMarkAsMastered = () => {
    if (filteredQuestions.length === 0 || isAnimating) return;

    setIsAnimating(true);
    const currentCard = filteredQuestions[index];
    setTimeout(() => {
      setMasteredCards([...masteredCards, currentCard]);
      const updatedActiveQuestions = activeQuestions.filter(
        (q) => q !== currentCard
      );
      setActiveQuestions(updatedActiveQuestions);

      const updatedFilteredQuestions = filteredQuestions.filter(
        (q) => q !== currentCard
      );
      setFilteredQuestions(updatedFilteredQuestions);

      if (updatedFilteredQuestions.length === 0) {
        setIndex(0);
      } else if (index >= updatedFilteredQuestions.length) {
        setIndex(updatedFilteredQuestions.length - 1);
      }

      setIsAnimating(false);
    }, 500);
  };

  const toggleMasteredView = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setFlipped(false);

    setTimeout(() => {
      setShowMastered(!showMastered);
      setIndex(0);
      setIsAnimating(false);
    }, 100);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="app-title">
          <Sparkles className="inline-block mr-2" size={32} />
          The Ultimate LLM Quiz
        </h1>
        <p className="app-subtitle">
          How well do you know Large Language Models? Let me Test your knowledge
          here!
        </p>

        <div className="difficulty-filter">
          <button
            className={`difficulty-button all ${
              difficulty === "all" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("all")}
            disabled={showMastered || isAnimating}
          >
            All
          </button>
          <button
            className={`difficulty-button easy ${
              difficulty === "easy" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("easy")}
            disabled={showMastered || isAnimating}
          >
            Easy
          </button>
          <button
            className={`difficulty-button medium ${
              difficulty === "medium" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("medium")}
            disabled={showMastered || isAnimating}
          >
            Medium
          </button>
          <button
            className={`difficulty-button hard ${
              difficulty === "hard" ? "active" : ""
            }`}
            onClick={() => handleDifficulty("hard")}
            disabled={showMastered || isAnimating}
          >
            Hard
          </button>
        </div>

        <div className="mastered-toggle">
          <button
            className={`toggle-button ${showMastered ? "mastered" : "active"}`}
            onClick={toggleMasteredView}
            disabled={isAnimating}
          >
            {showMastered ? (
              <>
                <span className="mr-2">Show Active Cards</span>
              </>
            ) : (
              <>
                <Award className="inline-block mr-2" size={16} />
                <span>Show Mastered Cards</span>
              </>
            )}
          </button>
          <span className="mastered-count">
            Mastered: {masteredCards.length} | Active: {activeQuestions.length}
          </span>
        </div>

        {filteredQuestions.length > 0 ? (
          <>
            <p className="card-counter">
              Card {index + 1} of {filteredQuestions.length}
            </p>

            <div className={`card-container ${isAnimating ? "animating" : ""}`}>
              <Card
                question={filteredQuestions[index].question}
                answer={filteredQuestions[index].answer}
                difficulty={filteredQuestions[index].difficulty}
                flipped={flipped}
                setFlipped={setFlipped}
                onClick={() => !isAnimating && setFlipped(!flipped)}
                image={filteredQuestions[index].image}
                index={index}
                setIndex={setIndex}
              />
            </div>

            <div className="navigation-buttons">
              <button
                onClick={handleBack}
                className="nav-button"
                aria-label="Previous card"
                disabled={filteredQuestions.length <= 1 || isAnimating}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="nav-button"
                aria-label="Next card"
                disabled={filteredQuestions.length <= 1 || isAnimating}
              >
                <ArrowRight size={20} />
              </button>
              <button
                onClick={handleShuffle}
                className="nav-button"
                aria-label="Shuffle"
                disabled={filteredQuestions.length <= 1 || isAnimating}
              >
                <Shuffle size={20} />
              </button>
              {!showMastered && (
                <button
                  onClick={handleMarkAsMastered}
                  className="mastered-button"
                  aria-label="Mark as Mastered"
                  disabled={isAnimating}
                >
                  <CheckCircle className="mr-2" size={16} />
                  <span>Mastered</span>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            {showMastered && masteredCards.length === 0 ? (
              <p>You haven't mastered any cards yet!</p>
            ) : (
              <p>No cards match the current filter criteria.</p>
            )}
          </div>
        )}

        {filteredQuestions.length > 1 && (
          <div className="progress-indicator">
            {filteredQuestions.map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i === index ? "active" : ""}`}
                onClick={() => {
                  if (!isAnimating) {
                    setFlipped(false);
                    setIndex(i);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
