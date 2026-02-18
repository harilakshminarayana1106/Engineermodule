import { Link, useLocation } from "react-router-dom";

function Sidebar() {

  const location = useLocation();

  return (

    <div className="sidebar">

      <h2>Jerobyte CRM</h2>

      <ul>

        {/* DASHBOARD */}

        <li
          className={
            location.pathname === "/"
              ? "active"
              : ""
          }
        >
          <Link to="/">Dashboard</Link>
        </li>


        {/* ALERTS */}

        <li
          className={
            location.pathname === "/alerts"
              ? "active"
              : ""
          }
        >
          <Link to="/alerts">Alerts</Link>
        </li>


        {/* CALLS */}

        <li
          className={
            location.pathname === "/calls"
              ? "active"
              : ""
          }
        >
          <Link to="/calls">Calls</Link>
        </li>


        {/* ENGINEERS */}

        <li
          className={
            location.pathname === "/engineers"
              ? "active"
              : ""
          }
        >
          <Link to="/engineers">
            Engineers
          </Link>
        </li>

      </ul>

    </div>

  );
}

export default Sidebar;
