// backend/src/models/user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const roles = ["user", "agent", "admin"];

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => require("uuid").v4(), // synchronous import
    },
    email: { type: String, required: true, unique: true, index: true },
    name: String,
    passwordHash: String,
    providers: {
      google: { id: String },
      saml: { id: String },
    },
    role: { type: String, enum: roles, default: "user" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastSeenAt: Date,
  },
  { versionKey: "__v" }
);

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.validatePassword = function (password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.roles = roles;

module.exports = mongoose.model("User", userSchema);
