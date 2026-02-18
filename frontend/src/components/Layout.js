import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Layout({ children }) {

  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);


  /* ================= LOAD ================= */

  const load = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/notifications"
      );

      setNotes(res.data);

      const c = await axios.get(
        "http://localhost:5000/notifications-count"
      );

      setCount(Number(c.data.count));

    } catch (err) {

      console.log("Load Error:", err);

    }
  };


  useEffect(() => {

    load();

    const i = setInterval(load, 3000);

    return () => clearInterval(i);

  }, []);


  /* ================= MARK ONE ================= */

  const markRead = async id => {

    try {

      await axios.put(
        `http://localhost:5000/notifications-read/${id}`
      );

      load();

    } catch (err) {

      console.log("Mark Error:", err);

    }
  };


  /* ================= MARK ALL ================= */

  const markAll = async () => {

    try {

      await axios.put(
        "http://localhost:5000/notifications-read-all"
      );

      load();

    } catch (err) {

      console.log("Mark All Error:", err);

    }
  };


  /* ================= UI ================= */

  return (

    <div className="d-flex">

      {/* SIDEBAR */}

      <div
        style={{
          width: 220,
          height: "100vh",
          background:
            "linear-gradient(#2c49d8,#1e2fbf)",
          color: "white",
          padding: 20
        }}
      >

        <h4 className="mb-4">
          Jerobyte CRM
        </h4>

        {[
          { name: "Dashboard", path: "/" },
          { name: "Alerts", path: "/alerts" },
          { name: "Calls", path: "/calls" },
          { name: "Engineers", path: "/engineers" }
        ].map(link => (

          <NavLink
            key={link.name}
            to={link.path}
            end
            style={({ isActive }) => ({
              display: "block",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              fontWeight: 500,
              background: isActive
                ? "#ffffff"
                : "transparent",
              color: isActive
                ? "#1e2fbf"
                : "white",
              border: "1px solid white"
            })}
          >
            {link.name}
          </NavLink>

        ))}

      </div>


      {/* MAIN */}

      <div className="flex-grow-1 bg-light">

        {/* HEADER */}

        <div className="d-flex justify-content-between p-3 bg-white shadow-sm">

          <h4 className="m-0">
            Easy Profit CRM
          </h4>

          <div className="d-flex align-items-center gap-3">

            <Link
              to="/assign"
              className="btn btn-primary"
            >
              + Assign Task
            </Link>


            {/* 🔔 BELL */}

            <div
              style={{
                position: "relative",
                 zIndex: 9999
              }}
            >

              <span
                style={{
                  fontSize: 22,
                  cursor: "pointer"
                }}
                onClick={() =>
                  setShow(!show)
                }
              >
                🔔
              </span>


              {/* COUNT */}

              {count > 0 && (

                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -10,
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: 12
                  }}
                >
                  {count}
                </span>

              )}


              {/* DROPDOWN */}

              {show && (

                <div
                  style={{
                    position: "fixed ",
                    right: 20,
                    top: 70,
                    width: 350,
                    background: "white",
                    padding: 12,
                    boxShadow: "0 0 15px #ccc",
                    maxHeight: 420,
                    overflowY: "auto",
                    borderRadius: 8,
                    zIndex: 999999
                  }}
                >

                  <div className="d-flex justify-content-between mb-2">

                    <b>Notifications</b>

                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setShow(false)
                      }
                    >
                      ✖
                    </span>

                  </div>


                  {notes.length > 0 && (

                    <button
                      className="btn btn-sm btn-outline-success w-100 mb-2"
                      onClick={markAll}
                    >
                      Mark All as Read
                    </button>

                  )}


                  {notes.length === 0 &&
                    <p>No Notifications</p>
                  }


                  {notes.map(n => (

                    <div
                      key={n.id}
                      style={{
                        borderBottom: "1px solid #eee",
                        marginBottom: 8,
                        paddingBottom: 8,
                        background:
                          n.is_read
                            ? "#f9f9f9"
                            : "#eef4ff",
                        borderRadius: 4,
                        padding: 8
                      }}
                    >

                      <b>{n.engineer}</b>
                      <br />

                      Completed —
                      {" "}
                      {n.product}
                      {" — "}
                      {n.issue}

                      <br />

                      <small>
                        {new Date(n.time)
                          .toLocaleString()}
                      </small>

                      <br />

                      {!n.is_read && (

                        <button
                          className="btn btn-sm btn-success mt-1"
                          onClick={() =>
                            markRead(n.id)
                          }
                        >
                          Mark as Read
                        </button>

                      )}

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>


        {/* PAGE */}

        <div className="p-4">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;
