
import { useState } from "react";

function Sidebar() {

  const [show, setShow] = useState(false);

  return (

    <>

      {/* ☰ MOBILE MENU BUTTON */}

      <button
        className="btn btn-primary d-md-none m-2"
        onClick={() => setShow(!show)}
      >
        ☰
      </button>

      <div className={`sidebar ${show ? "show" : ""}`}>

        <h2>Jerobyte CRM</h2>

        <ul>
          <li>Dashboard</li>
          <li>Alerts</li>
          <li>Calls</li>
          <li>Engineers</li>
        </ul>

      </div>

    </>
  );
}

export default Sidebar;
