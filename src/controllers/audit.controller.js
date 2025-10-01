const Audit = require('../models/audit.model');

exports.getTicketAuditHistory = async (req, res) => {
  try {
    const ticketId = req.params.id; // <-- take it directly
    const history = await Audit.find({ ticketId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
