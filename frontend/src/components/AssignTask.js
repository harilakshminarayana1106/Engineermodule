import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AssignTask() {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [departments, setDepartments] =
    useState([]);

  const [engineers, setEngineers] =
    useState([]);

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

  /* =====================================================
     LOAD DEPARTMENTS
  ===================================================== */

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {

    try {

      const res = await axios.get(
        `${baseURL}/departments`
      );

      setDepartments(res.data || []);

    } catch (err) {

      console.error(
        "Department Load Error:",
        err.message
      );
    }
  };

  /* =====================================================
     LOAD ENGINEERS BY DEPARTMENT
  ===================================================== */

  const loadEngineers = async dept => {

    if (!dept) return;

    try {

      const res = await axios.get(
        `${baseURL}/engineers-dept/${dept}`
      );

      setEngineers(res.data || []);

    } catch (err) {

      console.error(
        "Engineer Load Error:",
        err.message
      );
    }
  };

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = e => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    /* Department select → load engineers */

    if (name === "department") {

      setForm(prev => ({
        ...prev,
        department: value,
        engineer: ""
      }));

      loadEngineers(value);
    }
  };

  /* =====================================================
     SUBMIT TASK
  ===================================================== */

  const handleSubmit = async e => {

    e.preventDefault();

    try {

      await axios.post(
        `${baseURL}/assign-task`,
        form
      );

      alert("Task Assigned ✅");

      navigate("/");

    } catch (err) {

      console.error(
        "Assign Error:",
        err.message
      );

      alert("Assign Failed ❌");
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="container mt-3">

      {/* 🔙 BACK BUTTON */}

      <button
        className="btn btn-sm btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card p-4">

        <h4 className="mb-3">
          Assign New Task
        </h4>

        <form onSubmit={handleSubmit}>

          {/* ================= DEPARTMENT ================= */}

          <label>Department</label>

          <select
            name="department"
            className="form-control mb-3"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Department
            </option>

            {departments.map(d => (

              <option
                key={d.name}
                value={d.name}
              >
                {d.name}
              </option>

            ))}

          </select>

          {/* ================= ENGINEER ================= */}

          <label>Engineer</label>

          <select
            name="engineer"
            className="form-control mb-3"
            value={form.engineer}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Engineer
            </option>

            {engineers.map(e => (

              <option
                key={e.id}
                value={e.name}
              >
                {e.name}
              </option>

            ))}

          </select>

          {/* ================= CUSTOMER ================= */}

          <input
            type="text"
            name="customer"
            placeholder="Customer Name"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          {/* ================= PRODUCT ================= */}

          <input
            type="text"
            name="product"
            placeholder="Product"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          {/* ================= ISSUE ================= */}

          <select
            name="issue"
            className="form-control mb-3"
            onChange={handleChange}
            required
          >
            <option value="">
              Select Issue
            </option>

            <option>Not Working</option>
            <option>Battery Problem</option>
            <option>UPS Failure</option>
            <option>Installation</option>
            <option>Maintenance</option>
            <option>Cleaning</option>

          </select>

          {/* ================= ISSUE DATE ================= */}

          <label>Date of Issue</label>

          <input
            type="date"
            name="issue_date"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          {/* ================= AVAILABLE DATE ================= */}

          <label>Available Date</label>

          <input
            type="date"
            name="available_date"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          {/* ================= SUBMIT ================= */}

          <button className="btn btn-primary w-100">
            Assign Task
          </button>

        </form>

      </div>

    </div>
  );
}

export default AssignTask;
