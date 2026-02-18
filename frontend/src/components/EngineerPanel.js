import { useEffect, useState } from "react";
import axios from "axios";

function EngineerPanel() {

  const engineerName = "Murugan";

  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const res = await axios.get(
      `http://localhost:5000/engineer-tasks/${engineerName}`
    );
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const completeTask = (id) => {

    navigator.geolocation.getCurrentPosition(
      async pos => {

        const location =
          pos.coords.latitude +
          "," +
          pos.coords.longitude;

        await axios.post(
          `http://localhost:5000/complete-task/${id}`,
          { location }
        );

        loadTasks();
      },
      async () => {

        await axios.post(
          `http://localhost:5000/complete-task/${id}`,
          { location: "Location Denied" }
        );

        loadTasks();
      }
    );
  };

  return (
    <div className="card">

      <h3>Engineer Open Calls</h3>

      {tasks.map(t => (
        <div
          key={t.id}
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >

          <span>
            {t.customer} — {t.issue}
          </span>

          <button
            onClick={() =>
              completeTask(t.id)
            }
          >
            Complete
          </button>

        </div>
      ))}

    </div>
  );
}

export default EngineerPanel;
