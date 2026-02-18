import { useEffect, useState } from "react";
import axios from "axios";

function EngineerApp() {

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

  /* Capture Location + Complete */

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
      }
    );
  };

  return (
    <div className="card">

      <h3>My Tasks</h3>

      {tasks.map(t => (
        <div key={t.id}>

          <b>{t.customer}</b> — {t.issue}

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

export default EngineerApp;
