"use client";
import GuessForm from "./Guess";
import "./Card.css";

const Card = ({
  question,
  answer,
  flipped,
  setFlipped,
  onClick,
  image,
  difficulty,
  index,
  setIndex,
}) => {
  return (
    <div className="card-container">
      <div className="card-wrapper" onClick={onClick}>
        <div className={`card-inner ${flipped ? "flipped" : ""}`}>
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
      <GuessForm
        index={index}
        setIndex={setIndex}
        answer={answer}
        onClick={onClick}
        setFlipped={setFlipped}
      />
    </div>
  );
};

export default Card;
