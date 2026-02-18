import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [notifications, setNotifications] =
    useState([]);

  const loadNotifications = async () => {
    const res = await axios.get(
      "http://localhost:5000/notifications"
    );
    setNotifications(res.data);
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(
      loadNotifications,
      3000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Admin Notifications</h2>

      {notifications.map(n => (
        <div className="notification" key={n.id}>
          🔔 {n.engineer} completed {n.issue}
          <br />
          🕒 {n.time}

          <button>
            Assign Next Task
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
