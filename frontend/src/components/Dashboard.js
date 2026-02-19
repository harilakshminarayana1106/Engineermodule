import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  /* ================= STATES ================= */

  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    completed: 0
  });

  /* 🆕 TEAM STATS */

  const [teamStats, setTeamStats] = useState({
    LAN: 0,
    UPS: 0,
    CCTV: 0
  });

  const baseURL = "https://engineermodule.onrender.com";

  /* =====================================================
     LOAD TASK LIST
  ===================================================== */

  const loadTasks = async () => {

    try {

      const res = await axios.get(
        `${baseURL}/engineer-tasks`
      );

      setTasks(res.data || []);

    } catch (err) {

      console.error(
        "Task Load Error:",
        err.message
      );
    }
  };

  /* =====================================================
     LOAD DASHBOARD STATS
  ===================================================== */

  const loadStats = async () => {

    try {

      const res = await axios.get(
        `${baseURL}/tasks`
      );

      setStats(res.data);

    } catch (err) {

      console.error(
        "Stats Load Error:",
        err.message
      );
    }
  };

  /* =====================================================
     🆕 LOAD TEAM STATS
  ===================================================== */

  const loadTeamStats = async () => {

    try {

      const res = await axios.get(
        `${baseURL}/team-stats`
      );

      setTeamStats(res.data);

    } catch (err) {

      console.error(
        "Team Stats Error:",
        err.message
      );
    }
  };

  /* =====================================================
     COMPLETE TASK
  ===================================================== */

  const completeTask = async id => {

    try {

      await axios.post(
        `${baseURL}/complete-task/${id}`
      );

      loadTasks();
      loadStats();
      loadTeamStats();

    } catch (err) {

      console.error(
        "Complete Error:",
        err.message
      );
    }
  };

  /* =====================================================
     AUTO REFRESH
  ===================================================== */

  useEffect(() => {

    loadTasks();
    loadStats();
    loadTeamStats();

    const interval = setInterval(() => {

      loadTasks();
      loadStats();
      loadTeamStats();

    }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="container-fluid">

      {/* ================= TOP STAT CARDS ================= */}

      <div className="row">

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card text-white bg-primary p-3">
            <h5>Total Calls</h5>
            <h2>{stats.total}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card text-white bg-info p-3">
            <h5>Open Calls</h5>
            <h2>{stats.open}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card text-white bg-success p-3">
            <h5>Closed</h5>
            <h2>{stats.completed}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-light p-3">
            <h5>Assigned Tasks</h5>
            <h2>{tasks.length}</h2>
          </div>
        </div>

      </div>

      {/* ================= 🆕 TEAM CARDS ================= */}

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-dark p-3">
            <h5>LAN Team</h5>
            <h2>{teamStats.LAN}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning p-3">
            <h5>UPS / Inverter</h5>
            <h2>{teamStats.UPS}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-secondary p-3">
            <h5>CCTV / Camera</h5>
            <h2>{teamStats.CCTV}</h2>
          </div>
        </div>

      </div>

      {/* ================= TASK LIST ================= */}

      <div className="card p-3 mb-4">

        <h5>Engineer Assigned Tasks ▼</h5>

        {tasks.length === 0 && (
          <p>No Tasks</p>
        )}

        {tasks.map(t => (

          <div
            key={t.id}
            className="border rounded p-2 mb-2"
          >

            <b>{t.engineer}</b><br />

            {t.customer}<br />

            {t.product} — {t.issue}

            <br />

            <button
              className="btn btn-success btn-sm mt-2"
              onClick={() =>
                completeTask(t.id)
              }
            >
              Complete
            </button>

          </div>

        ))}

      </div>

      {/* ================= EXTRA CARDS ================= */}

      <div className="row">

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Daily Sales</h5>
            <p>Chart integrate pannalaam later</p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <h5>Completed Tasks</h5>
            <p>Auto updated from system</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
