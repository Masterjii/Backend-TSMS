// utils/auditLogger.js
const Audit = require('../models/audit.model');

exports.logAudit = async (ticketId, action, performedBy, meta = {}) => {
  await Audit.create({ ticketId, action, performedBy, meta });
};
