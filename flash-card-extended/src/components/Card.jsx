import { useState } from "react";
import "./Card.css";

const Card = ({ question, answer, isFlipped, onClick, image, difficulty }) => {
  const [maxStreak, setMaxStreak] = useState(0);
  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState("");

  const handleCorrect = (e) => {
    e.preventDefault();
    if (answer.toLowerCase().includes(input.toLowerCase())) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setMaxStreak(Math.max(maxStreak, streak));
      setStreak(0);
    }
    setInput("");
  };

  return (
    <div>
      <div className="card-wrapper" onClick={onClick}>
        <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className={`card-face card-front card-${difficulty}`}>
            <p className="card-text">{question}</p>
            <div className="difficulty-badge">{difficulty}</div>
          </div>

          {/* Back */}
          <div className={`card-face card-back card-${difficulty}`}>
            {image && (
              <div className="card-image-container card-image-small">
                <img
                  src={image || "/placeholder.svg"}
                  alt=""
                  className="card-image"
                />
              </div>
            )}
            <p className="card-text">{answer}</p>
          </div>
        </div>
      </div>
      <div className="streak-info">
        <p>
          Current Streak: {streak}, Longest Streak: {maxStreak}
        </p>
      </div>
      <p>Guess the answer here</p>
      <form onSubmit={handleCorrect}>
        <input
          type="text"
          placeholder="Place your answer here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Submit Guess</button>
      </form>
    </div>
  );
};

export default Card;
