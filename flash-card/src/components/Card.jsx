import "./Card.css";

const Card = ({ question, answer, isFlipped, onClick, image, difficulty }) => {
  return (
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
  );
};

export default Card;
