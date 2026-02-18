import { useEffect, useState } from "react";
import axios from "axios";

function NotificationBell() {

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const baseURL = "http://localhost:5000";

  /* ================= LOAD ================= */

  const load = async () => {

    try {

      const res = await axios.get(
        `${baseURL}/notifications`
      );

      setData(res.data || []);

    } catch (err) {

      console.error(
        "Notification Load Error:",
        err.message
      );
    }
  };

  useEffect(() => {

    load();

    const interval =
      setInterval(load, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  /* ================= MARK ONE ================= */

  const markRead = async id => {

    await axios.put(
      `${baseURL}/notifications-read/${id}`
    );

    load();
  };

  /* ================= MARK ALL ================= */

  const markAll = async () => {

    await axios.put(
      `${baseURL}/notifications-read-all`
    );

    load();
  };

  /* ================= UI ================= */

  return (

    <div style={{ position: "relative" }}>

      {/* 🔔 BELL */}

      <span
        style={{
          cursor: "pointer",
          fontSize: 18
        }}
        onClick={() => setShow(!show)}
      >
        🔔 {data.filter(n => !n.is_read).length}
      </span>

      {/* DROPDOWN */}

      {show && (

        <div
          style={{
            position: "absolute",
            right: 0,
            top: 40,
            width: 300,
            background: "white",
            padding: 12,
            boxShadow:
              "0 0 15px rgba(0,0,0,0.2)",
            maxHeight: 320,
            overflowY: "auto",
            borderRadius: 8,
            zIndex: 9999
          }}
        >

          {/* MARK ALL */}

          <button
            className="btn btn-success btn-sm mb-2"
            onClick={markAll}
          >
            Mark All as Read
          </button>

          {data.length === 0 &&
            <p>No Alerts</p>
          }

          {data.map(n => (

            <div
              key={n.id}
              style={{
                borderBottom:
                  "1px solid #eee",
                padding: 8,
                background:
                  n.is_read
                    ? "#f5f5f5"
                    : "#fff"
              }}
            >

              <b>{n.engineer}</b><br />

              Completed:
              {" "}
              {n.product}
              {" — "}
              {n.issue}
              <br />

              🕒 {n.time}<br />

              {/* MARK BTN */}

              {!n.is_read && (

                <button
                  className="btn btn-primary btn-sm mt-2"
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
  );
}

export default NotificationBell;
