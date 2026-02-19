/* ======================================================
   LOAD ENV VARIABLES
====================================================== */

require("dotenv").config();

/* ======================================================
   PG CONNECTION
====================================================== */

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/* ======================================================
   CONNECT TEST
====================================================== */

pool.connect((err) => {

  if (err) {
    console.log("DB Connection Error ❌", err);
  } else {
    console.log("PostgreSQL Connected ✅");
  }

});

module.exports = pool;
