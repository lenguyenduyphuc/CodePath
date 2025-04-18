import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => (
  <nav className="sidebar">
    <ul className="sidebar__links">
      <li>
        <NavLink exact="true" to="/" className="sidebar__link">
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/create" className="sidebar__link">
          Create a Fruit !!
        </NavLink>
      </li>

      <li>
        <NavLink to="/inventory" className="sidebar__link">
          Your inventory
        </NavLink>
      </li>
    </ul>

    <figure className="sidebar__logo">
      <img src="/logo.webp" alt="Site logo" />
    </figure>
  </nav>
);

export default NavBar;
