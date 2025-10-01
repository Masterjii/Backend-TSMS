const express = require("express");
const router = express.Router();

router.use("/tickets", require("./tickets.routes"));
router.use("/admin", require("./admin.routes")); // departments, statuses, rules
// router.use('/me', require('./me.routes'));

module.exports = router;
