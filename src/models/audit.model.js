const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  ticketId: { type: String, index: true, required: true },
  action: {
    type: String,
    enum: [
      "CREATE",
      "STATUS_CHANGE",
      "ASSIGN",
      "REPLY",
      "MERGE",
      "ESCALATE",
      "CLOSE",
      "UPDATE",
    ],
    required: true,
  },
  performedBy: { type: String, ref: "User", required: true },
  meta: mongoose.Schema.Types.Mixed, // extra details (oldStatus, newStatus, etc.)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Audit", auditSchema);
