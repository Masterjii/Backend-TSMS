const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const priorities = ["Low", "Medium", "High", "Critical"];
const statuses = ["Open", "In Progress", "Escalated", "Merged", "Closed"];

const ticketSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: priorities, default: "Low" },
  department: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: statuses, default: "Open" },
  assignedTo: { type: String, ref: "User" }, // agent _id
  createdBy: { type: String, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  mergedTickets: [{ type: String, ref: "Ticket" }],

  // Dependency Management
  dependencies: [{ type: String, ref: "Ticket" }], // tickets this depends on
  blockedBy: [{ type: String, ref: "Ticket" }], // tickets depending on this one

  updates: [
    {
      message: String,
      user: { type: String, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Ticket", ticketSchema);
