// routes/escalation.routes.js
const express = require("express");
const {
  createRule,
  getRules,
  updateRule,
  deleteRule,
} = require("../controllers/escalation.controller.js");
const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.js");

const router = express.Router();

router.post("/", requireAuth, requireAdmin, createRule);
router.get("/", requireAuth, requireAdmin, getRules);
router.put("/:id", requireAuth, requireAdmin, updateRule);
router.delete("/:id", requireAuth, requireAdmin, deleteRule);

module.exports = router;
