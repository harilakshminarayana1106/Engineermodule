const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "demo",
  password: "12345",   
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.log("DB Connection Error ❌", err);
  } else {
    console.log("PostgreSQL Connected ✅");
  }
});

module.exports = pool;
