const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const statusSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  color: { type: String, default: "#ccc" },
  includeInActive: { type: Boolean, default: true },
  autoCloseAfterHours: { type: Number, default: 0 }, // 0 means no auto close
});

module.exports = mongoose.model("Status", statusSchema);
