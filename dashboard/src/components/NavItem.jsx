import { Link } from "react-router-dom";

const NavItem = ({ to, icon, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={`nav-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="nav-icon">{icon}</div>
      <span className="nav-label">{label}</span>
      {isActive && <div className="nav-active-indicator"></div>}
    </Link>
  );
};

export default NavItem;
