import { useEffect, useState } from "react";
import axios from "axios";

function Alerts() {

  const [data, setData] = useState({
    warranty_maintenance: 0,
    warranty_expiry: 0,
    stamping_expiry: 0,
    amc_maintenance: 0,
    amc_expiry: 0,
    product_lifetime_expiry: 0
  });

  const baseURL = "http://localhost:5000";

  /* LOAD ALERTS */

  const loadAlerts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/alerts-today"
      );

      console.log("ALERTS:", res.data); // 🔍 debug

      setData(res.data || {});

    } catch (err) {

      console.error(
        "Alerts Load Error:",
        err.message
      );
    }
  };

  useEffect(() => {

    loadAlerts();

  }, []);

  return (

    <div className="container-fluid">

      <h4 className="mb-4">
        Today Alerts
      </h4>

      <div className="row g-3">

        <Card
          title="Warranty Maintenance"
          value={data.warranty_maintenance}
        />

        <Card
          title="Warranty Expiry"
          value={data.warranty_expiry}
        />

        <Card
          title="Stamping Expiry"
          value={data.stamping_expiry}
        />

        <Card
          title="AMC Maintenance"
          value={data.amc_maintenance}
        />

        <Card
          title="AMC Expiry"
          value={data.amc_expiry}
        />

        <Card
          title="Product Lifetime Expiry"
          value={data.product_lifetime_expiry}
        />

      </div>

    </div>
  );
}

/* CARD UI */

function Card({ title, value }) {

  return (

    <div className="col-md-2">

      <div
        className="card text-white"
        style={{
          background:
            "linear-gradient(135deg,#3a7bd5,#00d2ff)",
          borderRadius: 12
        }}
      >

        <div className="card-body text-center">

          <h6>{title}</h6>

          <h2>{value || 0}</h2>

        </div>

      </div>

    </div>
  );
}

export default Alerts;
