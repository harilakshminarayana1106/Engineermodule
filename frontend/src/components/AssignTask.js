import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AssignTask() {

  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [form, setForm] = useState({
    department: "",
    engineer: "",
    customer: "",
    product: "",
    issue: "",
    issue_date: "",
    available_date: ""
  });

  const baseURL = "http://localhost:5000";

  /* LOAD DEPARTMENTS */

  useEffect(() => {
    axios.get(`${baseURL}/departments`)
      .then(res => setDepartments(res.data || []))
      .catch(err =>
        console.error("Dept Load Error:", err.message)
      );
  }, []);

  /* LOAD ENGINEERS */

  const loadEngineers = async dept => {

    if (!dept) return;

    const res = await axios.get(
      `${baseURL}/engineers-dept/${dept}`
    );

    setEngineers(res.data || []);
  };

  /* CHANGE */

  const handleChange = e => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "department") {

      setForm(prev => ({
        ...prev,
        department: value,
        engineer: ""
      }));

      loadEngineers(value);
    }
  };

  /* SUBMIT */

  const handleSubmit = async e => {

    e.preventDefault();

    try {

      await axios.post(
        `${baseURL}/assign-task`,
        form
      );

      alert("Task Assigned ✅");
      navigate("/");

    } catch {

      alert("Assign Failed ❌");
    }
  };

  return (

    <div className="container mt-3">

      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card p-4">

        <h4>Assign New Task</h4>

        <form onSubmit={handleSubmit}>

          <div className="row">

            {/* DEPARTMENT */}

            <div className="col-md-6 mb-3">
              <label>Department</label>
              <select
                name="department"
                className="form-control"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Department
                </option>

                {departments.map(d => (
                  <option key={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ENGINEER */}

            <div className="col-md-6 mb-3">
              <label>Engineer</label>
              <select
                name="engineer"
                className="form-control"
                value={form.engineer}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Engineer
                </option>

                {engineers.map(e => (
                  <option key={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CUSTOMER */}

            <div className="col-md-6 mb-3">
              <input
                name="customer"
                placeholder="Customer"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            {/* PRODUCT */}

            <div className="col-md-6 mb-3">
              <input
                name="product"
                placeholder="Product"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            {/* ISSUE */}

            <div className="col-md-6 mb-3">
              <select
                name="issue"
                className="form-control"
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Issue
                </option>
                <option>Not Working</option>
                <option>Battery Problem</option>
                <option>Installation</option>
                <option>Maintenance</option>
              </select>
            </div>

            {/* DATES */}

            <div className="col-md-3 mb-3">
              <label>Issue Date</label>
              <input
                type="date"
                name="issue_date"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label>Available Date</label>
              <input
                type="date"
                name="available_date"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button className="btn btn-primary w-100">
            Assign Task
          </button>

        </form>

      </div>

    </div>
  );
}

export default AssignTask;
