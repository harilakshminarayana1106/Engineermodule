import { useEffect, useState } from "react";
import axios from "axios";

function EngineerDashboard() {
  const [calls, setCalls] = useState([]);

  const loadCalls = async () => {
    const res = await axios.get(
      "http://localhost:5000/engineer-calls"
    );
    setCalls(res.data);
  };

  useEffect(() => {
    loadCalls();
  }, []);

  const completeCall = async (id) => {
    await axios.post(
      `http://localhost:5000/complete/${id}`
    );
    loadCalls();
  };

  return (
    <div>
      <h2>Engineer Dashboard</h2>

      {calls.map(call => (
        <div className="card" key={call.id}>
          <b>{call.customer}</b> — {call.issue}

          <button
            onClick={() =>
              completeCall(call.id)
            }
          >
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}

export default EngineerDashboard;
