/* ======================================================
   LOAD ENV VARIABLES
====================================================== */

require("dotenv").config();

/* ======================================================
   PG CONNECTION (NEON CLOUD)
====================================================== */

const { Pool } = require("pg");

const pool = new Pool({

  connectionString:
    process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

});

/* ======================================================
   CONNECT TEST
====================================================== */

pool.connect((err) => {

  if (err) {
    console.log("Neon DB Connection Error ❌", err);
  } else {
    console.log("Neon PostgreSQL Connected ✅");
  }

});

module.exports = pool;
