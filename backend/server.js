/* ======================================================
   LOAD ENV
====================================================== */

require("dotenv").config();

/* ======================================================
   SERVER SETUP
====================================================== */

const express = require("express");
const cors = require("cors");

const app = express();

/* ======================================================
   DB CONNECTION
====================================================== */

const pool = require("./db");

/* ======================================================
   MIDDLEWARE
====================================================== */

app.use(cors({
  origin: "*",   // Later restrict to frontend domain
}));

app.use(express.json());

/* ======================================================
   ROUTES CONNECT
====================================================== */

const routes = require("./routes");
app.use("/", routes);

/* ======================================================
   ROOT CHECK
====================================================== */

app.get("/", (req, res) => {
  res.send("🚀 CRM Backend Running Successfully");
});

/* ======================================================
   DB TEST ROUTE (NEON CHECK)
====================================================== */

app.get("/db-test", async (req, res) => {

  try {

    const result =
      await pool.query("SELECT NOW()");

    res.json(result.rows);

  } catch (err) {

    console.error("DB Test Error:", err.message);
    res.status(500).send("Database Error");

  }

});

/* ======================================================
   TEAM STATS API
====================================================== */

app.get("/team-stats", async (req, res) => {

  try {

    const lan = await pool.query(`
      SELECT COUNT(*) 
      FROM tasks t
      JOIN engineers e
      ON t.engineer = e.name
      WHERE e.team = 'LAN'
    `);

    const ups = await pool.query(`
      SELECT COUNT(*) 
      FROM tasks t
      JOIN engineers e
      ON t.engineer = e.name
      WHERE e.team = 'UPS'
    `);

    const cctv = await pool.query(`
      SELECT COUNT(*) 
      FROM tasks t
      JOIN engineers e
      ON t.engineer = e.name
      WHERE e.team = 'CCTV'
    `);

    res.json({
      LAN: parseInt(lan.rows[0].count),
      UPS: parseInt(ups.rows[0].count),
      CCTV: parseInt(cctv.rows[0].count)
    });

  } catch (err) {

    console.error("Team Stats Error:", err.message);
    res.status(500).send("Server Error");

  }

});

/* ======================================================
   SERVER START
====================================================== */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running → http://localhost:${PORT}`
  );

});
