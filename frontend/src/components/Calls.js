import { useState } from "react";
import axios from "axios";

function Calls() {

  const baseURL = "https://engineermodule.onrender.com";

  const [form, setForm] = useState({
    customer: "",
    mobile: "",
    product: "",
    complaint: "",
    address: ""
  });

  /* HANDLE CHANGE */

  const handleChange = e => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  /* SUBMIT */

  const handleSubmit = async e => {

    e.preventDefault();

    try {

      await axios.post(
        `${baseURL}/book-complaint`,
        form
      );

      alert("Complaint Booked ✅");

      setForm({
        customer: "",
        mobile: "",
        product: "",
        complaint: "",
        address: ""
      });

    } catch (err) {

      console.error(err);
      alert("Failed ❌");

    }

  };

  /* UI */

  return (

    <div className="container mt-3">

      <div className="card p-4">

        <h4 className="mb-3">
          Add Call / Book Complaint
        </h4>

        <form onSubmit={handleSubmit}>

          <input
            name="customer"
            placeholder="Customer Name"
            className="form-control mb-3"
            value={form.customer}
            onChange={handleChange}
            required
          />

          <input
            name="mobile"
            placeholder="Mobile Number"
            className="form-control mb-3"
            value={form.mobile}
            onChange={handleChange}
            required
          />

          <select
            name="product"
            className="form-control mb-3"
            value={form.product}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Product
            </option>
            <option>UPS</option>
            <option>Inverter</option>
            <option>Battery</option>
            <option>LAN</option>
            <option>Camera</option>
          </select>

          <input
            name="complaint"
            placeholder="Complaint Issue"
            className="form-control mb-3"
            value={form.complaint}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            className="form-control mb-3"
            value={form.address}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary w-100">
            Book Complaint
          </button>

        </form>

      </div>

    </div>

  );
}

export default Calls;
