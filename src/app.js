// backend/src/app.js
const express = require("express");
// require('express-async-errors');
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

require("./utils/passport-google")(); // initialize Google strategy

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(passport.initialize());

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/api/department", require("./routes/departments.routes"));
app.use("/api/tickets", require("./routes/tickets.routes"));
app.use("/api/escalation", require("./routes/escalation.routes"));
app.use("/api/statuses", require("./routes/status.routes"));

// Error handler
app.use(require("./utils/error-handler"));

module.exports = app;
