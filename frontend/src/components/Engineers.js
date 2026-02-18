import { useEffect, useState } from "react";
import axios from "axios";
import LiveMap from "./LiveMap";
import NearbyMap from "./NearbyMap";

function Engineers() {

  /* ================= STATES ================= */

  const [tab, setTab] = useState("attendance");

  const [attendance, setAttendance] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [selectedEngineer, setSelectedEngineer] =
    useState("");

  const [mapData, setMapData] = useState(null);

  const [search, setSearch] = useState("");
  const [team, setTeam] = useState("");

  const baseURL = "http://localhost:5000";

  /* =====================================================
     🧠 TEAM MAPPING (EDIT NAMES IF NEEDED)
  ===================================================== */

  const LAN_TEAM = [
    "Ashwin",
    "Hari",
    "Murugan",
    "Ramesh"
  ];

  const UPS_TEAM = [
    "Ravi",
    "Sandeep",
    "Karthik",
    "Vignesh"
  ];

  /* =====================================================
     LOAD ENGINEERS
  ===================================================== */

  const loadEngineers = async () => {

    const res = await axios.get(
      `${baseURL}/engineers`
    );

    setEngineers(res.data || []);
  };

  /* =====================================================
     LOAD ATTENDANCE
  ===================================================== */

  const loadAttendance = async () => {

    const res = await axios.get(
      `${baseURL}/attendance`
    );

    setAttendance(res.data || []);
  };

  /* =====================================================
     MARK ATTENDANCE
  ===================================================== */

  const markAttendance =
    async (name, status) => {

      await axios.post(
        `${baseURL}/attendance`,
        { engineer: name, status }
      );

      loadAttendance();
    };

  /* =====================================================
     LOAD PERFORMANCE
  ===================================================== */

  const loadPerformance =
    async () => {

      const res = await axios.get(
        `${baseURL}/performance`
      );

      setPerformance(res.data || []);
    };

  /* =====================================================
     LOAD NEARBY CUSTOMERS
  ===================================================== */

  const loadNearbyCustomers =
    async engineer => {

      if (!engineer) return;

      const res = await axios.get(
        `${baseURL}/nearby-customers/${engineer}`
      );

      if (Array.isArray(res.data)) {

        setCustomers(res.data);

        setMapData({
          engineerLocation: {
            name: engineer,
            latitude: 13.0827,
            longitude: 80.2707
          },
          customers: res.data
        });

      } else {

        setCustomers(
          res.data.customers || []
        );

        setMapData(res.data);
      }
    };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadEngineers();
    loadAttendance();

  }, []);

  useEffect(() => {

    if (tab === "performance")
      loadPerformance();

  }, [tab]);

  /* =====================================================
     🔍 FILTER LOGIC (SEARCH + TEAM)
  ===================================================== */

  const filteredAttendance = attendance
    .filter(e =>
      e.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter(e => {

      if (team === "LAN")
        return LAN_TEAM.includes(e.name);

      if (team === "UPS")
        return UPS_TEAM.includes(e.name);

      return true;
    });

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="container-fluid">

      {/* ================= TABS ================= */}

      <div className="d-flex gap-2 mb-4">

        {[
          {
            key: "attendance",
            label: "Engineers Attendance"
          },
          {
            key: "performance",
            label: "Performance Reports"
          },
          {
            key: "location",
            label: "Live Location"
          },
          {
            key: "customers",
            label: "Nearby Customers"
          }
        ].map(t => (

          <button
            key={t.key}
            className={`btn ${
              tab === t.key
                ? "btn-primary"
                : "btn-light"
            }`}
            onClick={() =>
              setTab(t.key)
            }
          >
            {t.label}
          </button>

        ))}

      </div>

      {/* =====================================================
         1️⃣ ATTENDANCE + FILTER UI
      ===================================================== */}

      {tab === "attendance" && (

        <div className="card p-3">

          {/* HEADER */}

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h5 className="mb-0">
              Daily Attendance
            </h5>

            <div className="d-flex gap-2">

              {/* TEAM DROPDOWN */}

              <select
                className="form-control"
                style={{ width: 180 }}
                value={team}
                onChange={e =>
                  setTeam(e.target.value)
                }
              >
                <option value="">
                  All Teams
                </option>

                <option value="LAN">
                  LAN Team
                </option>

                <option value="UPS">
                  UPS / Inverter Team
                </option>
              </select>

              {/* SEARCH */}

              <input
                type="text"
                placeholder="Search Engineer..."
                className="form-control"
                style={{ width: 220 }}
                value={search}
                onChange={e =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          {/* TABLE */}

          <table className="table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Engineer</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredAttendance.length === 0 && (

                <tr>
                  <td colSpan="4"
                    className="text-center">
                    No Engineers Found
                  </td>
                </tr>

              )}

              {filteredAttendance.map(
                (e, i) => (

                  <tr key={i}>

                    <td>{i + 1}</td>

                    <td>{e.name}</td>

                    <td style={{
                      color:
                        e.status === "Present"
                          ? "green"
                          : "red"
                    }}>
                      {e.status}
                    </td>

                    <td>

                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          markAttendance(
                            e.name,
                            "Present"
                          )
                        }>
                        Present
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          markAttendance(
                            e.name,
                            "Absent"
                          )
                        }>
                        Absent
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* =====================================================
         2️⃣ PERFORMANCE
      ===================================================== */}

      {tab === "performance" && (

        <div className="card p-3">

          <h5>Performance Report</h5>

          <table className="table">

            <thead>
              <tr>
                <th>Engineer</th>
                <th>Total</th>
                <th>Completed</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>

              {performance.map((p, i) => {

                const percent =
                  p.assigned > 0
                    ? Math.round(
                        (p.completed /
                          p.assigned) * 100
                      )
                    : 0;

                return (

                  <tr key={i}>
                    <td>{p.engineer}</td>
                    <td>{p.assigned}</td>
                    <td>{p.completed}</td>
                    <td>{percent}%</td>
                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>
      )}

      {/* =====================================================
         3️⃣ LIVE LOCATION
      ===================================================== */}

      {tab === "location" && (

        <div className="card p-3">

          <h5>Engineer Live GPS</h5>

          <LiveMap engineers={engineers} />

        </div>
      )}

      {/* =====================================================
         4️⃣ NEARBY CUSTOMERS
      ===================================================== */}

      {tab === "customers" && (

        <div className="card p-3">

          <h5>Nearby Customers</h5>

          <select
            className="form-control mb-3"
            value={selectedEngineer}
            onChange={e => {

              setSelectedEngineer(
                e.target.value
              );

              loadNearbyCustomers(
                e.target.value
              );
            }}>

            <option value="">
              Select Engineer
            </option>

            {engineers.map(e => (

              <option
                key={e.name}
                value={e.name}>
                {e.name}
              </option>

            ))}

          </select>

          {mapData && (

            <NearbyMap
              engineerLocation={
                mapData.engineerLocation
              }
              customers={
                mapData.customers ||
                customers
              }
            />

          )}

        </div>
      )}

    </div>
  );
}

export default Engineers;
