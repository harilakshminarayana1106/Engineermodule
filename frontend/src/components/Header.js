import { useEffect, useState } from "react";
import axios from "axios";

function Header() {

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
        "Header Notification Error:",
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

  /* ================= UNREAD COUNT ================= */

  const unreadCount =
    data.filter(n => !n.is_read).length;

  /* ================= UI ================= */

  return (

    <div className="header d-flex justify-content-between align-items-center p-3">

      <h3>Easy Profit CRM</h3>

      {/* 🔔 BELL */}

      <div style={{ position: "relative" }}>

        <span
          style={{
            cursor: "pointer",
            fontSize: 20
          }}
          onClick={() =>
            setShow(!show)
          }
        >
          🔔 {unreadCount}
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

            {data.length === 0 && (
              <p>No Notifications</p>
            )}

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

                🕒 {n.time}

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

    </div>
  );
}

export default Header;
