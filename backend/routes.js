const express = require("express");
const router = express.Router();
const pool = require("./db");

/* ===================================================
   1️⃣ ENGINEERS LIST
=================================================== */
router.get("/engineers", async (req, res) => {
  try {

    const data = await pool.query(`
      SELECT name
      FROM engineers
      ORDER BY name
    `);

    res.json(data.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Engineer Fetch Failed"
    });
  }
});

/* TEAM WISE ENGINEERS */
router.get("/engineers-team/:team", async (req, res) => {

  const { team } = req.params;

  const data = await pool.query(
    `SELECT name
     FROM engineers
     WHERE team=$1
     ORDER BY name`,
    [team]
  );

  res.json(data.rows);
});

/* ===================================================
   2️⃣ ATTENDANCE LIST
=================================================== */
router.get("/attendance", async (req, res) => {

  try {

    const data = await pool.query(`
      SELECT
        e.name,
        COALESCE(a.status,'Absent') AS status
      FROM engineers e
      LEFT JOIN attendance a
      ON e.name = a.engineer
      AND a.date = CURRENT_DATE
      ORDER BY e.name
    `);

    res.json(data.rows);

  } catch (err) {

    console.error("Attendance Error:", err);

    res.status(500).json({
      error: "Attendance Fetch Failed"
    });
  }
});


/* ===================================================
   3️⃣ MARK ATTENDANCE
=================================================== */
router.post("/attendance", async (req, res) => {

  const { engineer, status } = req.body;

  const check = await pool.query(
    `SELECT *
     FROM attendance
     WHERE engineer=$1
     AND date=CURRENT_DATE`,
    [engineer]
  );

  if (check.rows.length > 0) {

    await pool.query(
      `UPDATE attendance
       SET status=$1
       WHERE engineer=$2
       AND date=CURRENT_DATE`,
      [status, engineer]
    );

  } else {

    await pool.query(
      `INSERT INTO attendance
       (engineer,status,date)
       VALUES ($1,$2,CURRENT_DATE)`,
      [engineer, status]
    );
  }

  res.json({ success: true });
});

/* ===================================================
   4️⃣ ASSIGN TASK
=================================================== */
router.post("/assign-task", async (req, res) => {

  const {
    engineer,
    customer,
    product,
    issue,
    issue_date,
    available_date
  } = req.body;

  /* Ensure engineer exists */
  await pool.query(
    `INSERT INTO engineers(name)
     VALUES($1)
     ON CONFLICT(name) DO NOTHING`,
    [engineer]
  );

  /* Insert task */
  await pool.query(
    `INSERT INTO tasks
     (engineer,customer,product,
      issue,issue_date,
      available_date,status,auto_assigned)
     VALUES
     ($1,$2,$3,$4,$5,$6,'assigned',FALSE)`,
    [
      engineer,
      customer,
      product,
      issue,
      issue_date,
      available_date
    ]
  );

  res.json({ success: true });
});

/* ===================================================
   5️⃣ ENGINEER TASK LIST
=================================================== */
router.get("/engineer-tasks", async (req, res) => {

  const data = await pool.query(`
    SELECT *
    FROM tasks
    WHERE status='assigned'
    ORDER BY id DESC
  `);

  res.json(data.rows);
});

/* ===================================================
   6️⃣ COMPLETE TASK + AUTO NEXT
=================================================== */
router.post("/complete-task/:id", async (req, res) => {

  const { id } = req.params;

  const taskRes = await pool.query(
    "SELECT * FROM tasks WHERE id=$1",
    [id]
  );

  const task = taskRes.rows[0];

  if (!task)
    return res.json({ error: "Task not found" });

  /* COMPLETE */
  await pool.query(
    `UPDATE tasks
     SET status='completed'
     WHERE id=$1`,
    [id]
  );

  /* NOTIFICATION */
  await pool.query(
    `INSERT INTO notifications
     (engineer,issue,product,is_read,time)
     VALUES ($1,$2,$3,FALSE,NOW())`,
    [
      task.engineer,
      task.issue,
      task.product
    ]
  );

  /* TODAY COUNT */
  const countRes = await pool.query(
    `SELECT COUNT(*)
     FROM tasks
     WHERE engineer=$1
     AND DATE(issue_date)=CURRENT_DATE`,
    [task.engineer]
  );

  if (parseInt(countRes.rows[0].count) >= 3)
    return res.json({
      success: true,
      message: "Duty Over"
    });

  /* TIME CHECK */
  if (new Date().getHours() >= 15)
    return res.json({
      success: true,
      message: "Time Exceeded"
    });

  /* AUTO ASSIGN */
  const cust = await pool.query(`
    SELECT *
    FROM customers
    ORDER BY RANDOM()
    LIMIT 1
  `);

  const c = cust.rows[0];

  await pool.query(
    `INSERT INTO tasks
     (engineer,customer,product,
      issue,issue_date,
      available_date,status,auto_assigned)
     VALUES
     ($1,$2,$3,
      'Maintenance',
      CURRENT_DATE,
      CURRENT_DATE,
      'assigned',TRUE)`,
    [
      task.engineer,
      c.name,
      c.product
    ]
  );

  res.json({
    success: true,
    auto: "Next Task Assigned"
  });
});

/* ===================================================
   📞 BOOK COMPLAINT
=================================================== */
router.post("/book-complaint", async (req, res) => {

  try {

    const {
      invoice_no,
      invoice_date,
      customer_name,
      mobile,
      address,
      district,
      email,
      product_name,
      product_type,
      component_type,
      make,
      capacity,
      serial_number,
      issue
    } = req.body;

    /* 1️⃣ Save Complaint */

    await pool.query(`
      INSERT INTO complaints (
        invoice_no, invoice_date,
        customer_name, mobile,
        address, district, email,
        product_name, product_type,
        component_type, make,
        capacity, serial_number,
        issue
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,$14
      )
    `, [
      invoice_no,
      invoice_date,
      customer_name,
      mobile,
      address,
      district,
      email,
      product_name,
      product_type,
      component_type,
      make,
      capacity,
      serial_number,
      issue
    ]);

    /* 2️⃣ AUTO ASSIGN ENGINEER */

    const eng = await pool.query(`
      SELECT name
      FROM engineers
      ORDER BY RANDOM()
      LIMIT 1
    `);

    const engineer = eng.rows[0].name;

    /* 3️⃣ CREATE TASK */

    await pool.query(`
      INSERT INTO tasks (
        engineer,
        customer,
        product,
        issue,
        issue_date,
        available_date,
        status
      )
      VALUES (
        $1,$2,$3,$4,
        CURRENT_DATE,
        CURRENT_DATE,
        'assigned'
      )
    `, [
      engineer,
      customer_name,
      product_name,
      issue
    ]);

    res.json({
      success: true,
      message: "Complaint Booked + Task Assigned"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Complaint Failed"
    });
  }
});

/* ===================================================
   7️⃣ PERFORMANCE
=================================================== */
router.get("/performance", async (req, res) => {

  const data = await pool.query(`
    SELECT
      engineer,
      COUNT(*)::int AS assigned,
      SUM(
        CASE
          WHEN status='completed'
          THEN 1 ELSE 0
        END
      )::int AS completed
    FROM tasks
    GROUP BY engineer
    ORDER BY engineer
  `);

  res.json(data.rows);
});

/* ===================================================
   8️⃣ LIVE LOCATION
=================================================== */
router.get("/engineer-live/:name", (req, res) => {

  const { name } = req.params;

  const latitude =
    13.0827 + (Math.random() - 0.5) * 0.05;

  const longitude =
    80.2707 + (Math.random() - 0.5) * 0.05;

  res.json({
    engineer: name,
    latitude,
    longitude
  });
});

/* ===================================================
   9️⃣ NEARBY CUSTOMERS
=================================================== */
router.get(
  "/nearby-customers/:engineer",
  async (req, res) => {

    const { engineer } = req.params;

    const engineerLocation = {
      name: engineer,
      latitude: 13.0827,
      longitude: 80.2707
    };

    const data = await pool.query(`
      SELECT
        name AS customer,
        product,
        latitude,
        longitude
      FROM customers
      LIMIT 5
    `);

    res.json({
      engineerLocation,
      customers: data.rows
    });
});

/* ===================================================
   🔔 NOTIFICATIONS
=================================================== */

/* LIST */
router.get("/notifications", async (req, res) => {

  const data = await pool.query(
    "SELECT * FROM notifications ORDER BY id DESC"
  );

  res.json(data.rows);
});

/* COUNT */
router.get("/notifications-count", async (req, res) => {

  const data = await pool.query(
    "SELECT COUNT(*) FROM notifications WHERE is_read=FALSE"
  );

  res.json({
    count: parseInt(data.rows[0].count)
  });
});

/* MARK SINGLE READ */
router.put(
  "/notifications-read/:id",
  async (req, res) => {

    await pool.query(
      `UPDATE notifications
       SET is_read=TRUE
       WHERE id=$1`,
      [req.params.id]
    );

    res.json({ success: true });
});

/* MARK ALL READ */
router.put(
  "/notifications-read-all",
  async (req, res) => {

    await pool.query(
      `UPDATE notifications
       SET is_read=TRUE`
    );

    res.json({ success: true });
});

/* ===================================================
   📊 DASHBOARD STATS
=================================================== */
router.get("/tasks", async (req, res) => {

  const total = await pool.query(
    "SELECT COUNT(*) FROM tasks"
  );

  const open = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE status='assigned'"
  );

  const completed = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE status='completed'"
  );

  res.json({
    total: parseInt(total.rows[0].count),
    open: parseInt(open.rows[0].count),
    completed: parseInt(completed.rows[0].count)
  });
});

/* ===================================================
   🚨 ALERTS TODAY
=================================================== */
router.get("/alerts-today", (req, res) => {

  const random = () =>
    Math.floor(Math.random() * 10);

  res.json({
    warranty_maintenance: random(),
    warranty_expiry: random(),
    stamping_expiry: random(),
    amc_maintenance: random(),
    amc_expiry: random(),
    product_lifetime_expiry: random()
  });
});

/* ===================================================
   ENGINEERS BY DEPARTMENT
=================================================== */

router.get("/engineers-dept/:dept", async (req, res) => {

  const { dept } = req.params;

  try {

    const data = await pool.query(
      `SELECT name
       FROM engineers
       WHERE team = $1
       ORDER BY name`,
      [dept]
    );

    res.json(data.rows);

  } catch (err) {

    console.error(err);
    res.status(500).send("Engineer Fetch Failed");

  }
});


/* ===================================================
   DEPARTMENTS LIST
=================================================== */
router.get("/departments", (req, res) => {

  res.json([
    { name: "LAN" },
    { name: "UPS" },
    { name: "CAMERA" }
  ]);

});

/* ================= CALLS LIST ================= */

router.get("/calls", async (req, res) => {

  try {

    const data = await pool.query(`
      SELECT *
      FROM tasks
      ORDER BY id DESC
    `);

    res.json(data.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Calls Fetch Failed"
    });
  }

});

/* ===================================================
   📞 BOOK COMPLAINT
=================================================== */

router.post("/book-complaint", async (req, res) => {

  try {

    const {
      customer,
      mobile,
      product,
      complaint,
      address
    } = req.body;

    console.log("Complaint Data:", req.body);

    /* Insert complaint */

    await pool.query(
      `INSERT INTO complaints
       (customer,mobile,product,
        complaint,address)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        customer,
        mobile,
        product,
        complaint,
        address
      ]
    );

    /* Auto assign engineer */

    const eng = await pool.query(`
      SELECT name
      FROM engineers
      ORDER BY RANDOM()
      LIMIT 1
    `);

    const engineer =
      eng.rows[0]?.name || "Unassigned";

    /* Insert task */

    await pool.query(
      `INSERT INTO tasks
       (engineer,customer,product,
        issue,issue_date,
        available_date,status)
       VALUES
       ($1,$2,$3,$4,
        CURRENT_DATE,
        CURRENT_DATE,
        'assigned')`,
      [
        engineer,
        customer,
        product,
        complaint
      ]
    );

    res.json({ success: true });

  } catch (err) {

    console.error(
      "Complaint Error:",
      err.message
    );

    res.status(500).json({
      error: err.message
    });
  }

});

/* TEAM STATS */

router.get("/team-stats", async (req, res) => {

  const lan = await pool.query(`
    SELECT COUNT(*)
    FROM tasks t
    JOIN engineers e
    ON t.engineer = e.name
    WHERE e.team='LAN'
  `);

  const ups = await pool.query(`
    SELECT COUNT(*)
    FROM tasks t
    JOIN engineers e
    ON t.engineer = e.name
    WHERE e.team='UPS'
  `);

  const cctv = await pool.query(`
    SELECT COUNT(*)
    FROM tasks t
    JOIN engineers e
    ON t.engineer = e.name
    WHERE e.team='CCTV'
  `);

  res.json({
    LAN: parseInt(lan.rows[0].count),
    UPS: parseInt(ups.rows[0].count),
    CCTV: parseInt(cctv.rows[0].count)
  });

});



/* =================================================== */
module.exports = router;
