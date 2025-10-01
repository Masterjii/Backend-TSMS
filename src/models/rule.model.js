const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ruleSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: String,
  conditions: [
    { field: String, operator: String, value: mongoose.Schema.Types.Mixed },
  ],
  logic: { type: String, enum: ["AND", "OR"], default: "AND" },
  actions: [{ type: { type: String }, payload: mongoose.Schema.Types.Mixed }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EscalationRule", ruleSchema);
