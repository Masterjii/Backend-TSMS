const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const statusController = require("../controllers/status.controller");

// Create status
router.post("/", requireAuth, requireAdmin, statusController.createStatus);

// List statuses
router.get("/", requireAuth, requireAdmin, statusController.listStatuses);

// Update status
router.put("/:id", requireAuth, requireAdmin, statusController.updateStatus);
// Delete status
router.delete("/:id", requireAuth, requireAdmin, statusController.deleteStatus);

module.exports = router;
