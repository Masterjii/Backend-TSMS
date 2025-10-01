// models/EscalationRule.js
const mongoose = require("mongoose");

const conditionSchema = new mongoose.Schema({
  field: {
    type: String,
    enum: ["department", "status", "priority", "timeElapsed"],
    required: true,
  },
  operator: {
    type: String,
    enum: ["equals", "notEquals", "greaterThan", "lessThan"],
    required: true,
  },
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // flexible
});

const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "assignDepartment",
      "changeStatus",
      "updatePriority",
      "escalateToUser",
      "escalateToRole",
      "addReply",
    ],
    required: true,
  },
  value: { type: mongoose.Schema.Types.Mixed }, // departmentId, userId, role, or reply message
});

const escalationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  conditions: [conditionSchema],
  logicOperator: { type: String, enum: ["AND", "OR"], default: "AND" },
  actions: [actionSchema],
  createdBy: { type: String, ref: "User", required: true }, // <-- use String for UUID
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EscalationRule", escalationRuleSchema);
