import gamesData from "./links.json";
import GameCard from "./Components/GameCard";
import "./App.css";

const App = () => {
  const games = gamesData.iconic_games;

  return (
    <div className="container">
      <h1>Most iconic games in History</h1>
      <div className="game-container">
        {games.map((game, index) => (
          <GameCard key={index} game={game} />
        ))}
      </div>
    </div>
  );
};

export default App;
