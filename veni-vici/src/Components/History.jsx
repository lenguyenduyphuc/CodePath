const History = ({ clearHistory, history }) => {
  return (
    <div className="history-container">
      <div className="history-header">
        <h2>History</h2>
        {history.length > 0 && (
          <button className="clear-history-btn" onClick={clearHistory}>
            Clear
          </button>
        )}
      </div>
      <p className="history-instruction">Your previously discovered cats</p>

      {history.length === 0 ? (
        <p className="no-history">No history yet</p>
      ) : (
        <div className="history-items">
          {history.map((historyCat) => (
            <div
              key={`${historyCat.id}-${Math.random()}`}
              className="history-item"
            >
              <div className="history-image-container">
                <img
                  src={historyCat.imageUrl}
                  alt={historyCat.name}
                  className="history-image"
                />
              </div>
              <div className="history-details">
                <h3>{historyCat.name}</h3>
                <div className="history-attributes">
                  <span>{historyCat.origin}</span>
                  <span>{historyCat.weight} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
