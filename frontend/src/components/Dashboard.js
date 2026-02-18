import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  /* ================= STATES ================= */

  const [tasks, setTasks] =
    useState([]);

  const [stats, setStats] =
    useState({
      total: 0,
      open: 0,
      completed: 0
    });

  const baseURL =
    "http://localhost:5000";

  /* =====================================================
     LOAD ASSIGNED TASKS
  ===================================================== */

  const loadTasks = async () => {

    try {

      const res =
        await axios.get(
          `${baseURL}/engineer-tasks`
        );

      /* No filter remove */
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

      const res =
        await axios.get(
          "http://localhost:5000/tasks"
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
     COMPLETE TASK
  ===================================================== */

  const completeTask =
    async id => {

      try {

        await axios.post(
          `${baseURL}/complete-task/${id}`
        );

        loadTasks();
        loadStats();

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

    const interval =
      setInterval(() => {

        loadTasks();
        loadStats();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="container-fluid">

      {/* ================= ROW 1 ================= */}

      <div className="row">

        {/* TOTAL */}

        <div className="col-md-3">

          <div className="card text-white bg-primary mb-3">

            <div className="card-body">

              <h5>Total Calls</h5>

              <h2>{stats.total}</h2>

            </div>

          </div>

        </div>

        {/* OPEN */}

        <div className="col-md-3">

          <div className="card text-white bg-info mb-3">

            <div className="card-body">

              <h5>Open Calls</h5>

              <h2>{stats.open}</h2>

            </div>

          </div>

        </div>

        {/* ASSIGNED */}

        <div className="col-md-3">

          <div className="card mb-3">

            <div className="card-body">

              <h5>
                Engineer Assigned Tasks ▼
              </h5>

              <p>
                {tasks.length} Tasks
              </p>

              {tasks.length === 0 && (
                <p>No Tasks</p>
              )}

              {tasks.map(t => (

                <div
                  key={t.id}
                  className="border p-2 mb-2"
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

          </div>

        </div>

        {/* CLOSED */}

        <div className="col-md-3">

          <div className="card text-white bg-success mb-3">

            <div className="card-body">

              <h5>Closed</h5>

              <h2>
                {stats.completed}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ROW 2 ================= */}

      <div className="row">

        <div className="col-md-6">

          <div className="card">

            <div className="card-body">

              <h5>Daily Sales</h5>

              <p>
                Chart integrate pannalaam later
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-6">

          <div className="card">

            <div className="card-body">

              <h5>Completed Tasks</h5>

              <p>
                Auto updated from system
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
