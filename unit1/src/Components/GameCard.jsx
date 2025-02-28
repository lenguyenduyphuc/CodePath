import "./GameCard.css";

const GameCard = ({ game }) => {
  return (
    <div className="card">
      <div className="image-container">
        <img src={game.image_url} alt={game.title} />
      </div>
      <div className="info-container">
        <h2 className="title">{game.title}</h2>
        <p className="develoh3er">{game.developer}</p>
        <p className="year">{game.release_year}</p>
        <p className="platform">{game.platform}</p>
        <p className="significance">{game.significance}</p>
      </div>
      <a
        href={game.download_link}
        className="view-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Game
      </a>
    </div>
  );
};

export default GameCard;
