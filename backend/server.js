/* ======================================================
   SERVER SETUP
====================================================== */

const express = require("express");
const cors = require("cors");

const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */

app.use(cors());
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
   SERVER START
====================================================== */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running → http://localhost:${PORT}`
  );
});
