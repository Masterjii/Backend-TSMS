const mongoose = require("mongoose");
let uuidv4;
(async () => {
  const { v4 } = await import("uuid");
  uuidv4 = v4;
})();

const departmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () =>
      uuidv4 && typeof uuidv4 === "function" ? uuidv4() : undefined,
  },
  name: { type: String, required: true, unique: true },
  description: String,
  email: String,
  assignedAdmins: [{ type: String, ref: "User" }], // refs by user id
  hidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Department", departmentSchema);
