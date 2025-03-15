"use client";

import { useState, useEffect } from "react";
import "./Guess.css";

const GuessForm = ({ index, setIndex, answer, setFlipped }) => {
  const [maxStreak, setMaxStreak] = useState(0);
  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState("");
  const [guessStatus, setGuessStatus] = useState(""); // "" | "correct" | "incorrect"

  // Reset the guess status after a delay
  useEffect(() => {
    if (guessStatus) {
      const timer = setTimeout(() => {
        setGuessStatus("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [guessStatus]);

  const handleCorrect = (e) => {
    e.preventDefault();
    if (answer === input) {
      setGuessStatus("correct");
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Delay moving to the next question to show the green feedback first
      setTimeout(() => {
        setIndex(index + 1);
        setFlipped(0);
        setInput("");
      }, 800);

      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setGuessStatus("incorrect");
      setMaxStreak(Math.max(maxStreak, streak));
      setStreak(0);
      // Don't clear input immediately so user can see what they typed
      setTimeout(() => {
        setInput("");
      }, 800);
    }
  };

  return (
    <div className="guess-form-container">
      <div className="streak-info">
        <p>
          Current Streak: {streak}, Longest Streak: {maxStreak}
        </p>
      </div>
      <form onSubmit={handleCorrect}>
        <input
          type="text"
          placeholder="Place your answer here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={guessStatus ? `input-${guessStatus}` : ""}
        />
        <button type="submit">Submit Guess</button>
      </form>
    </div>
  );
};

export default GuessForm;
