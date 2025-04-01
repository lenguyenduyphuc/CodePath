const BanList = ({ banList, handleAttributeClick, filteredCats, allCats }) => {
  return (
    <div className="ban-list-container">
      <h2>Ban List</h2>
      <p className="ban-instruction">
        Select an attribute in your listing to ban it
      </p>

      {banList.length === 0 ? (
        <p className="no-bans">No attributes banned yet</p>
      ) : (
        <div className="ban-items">
          {banList.map((item) => {
            const [attribute, value] = item.split(":");
            return (
              <div
                key={item}
                className="ban-item"
                onClick={() => handleAttributeClick(attribute, value)}
              >
                <span className="attribute-name">{attribute}: </span>
                <span className="attribute-value">{value}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="stats">
        <p>
          Available cats: {filteredCats.length} of {allCats.length}
        </p>
      </div>
    </div>
  );
};

export default BanList;
