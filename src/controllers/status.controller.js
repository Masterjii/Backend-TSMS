const Status = require("../models/status.model");

// Create a new status
exports.createStatus = async (req, res) => {
  try {
    const { title, color, isActiveTicket, autoClose, autoCloseHours } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const status = await Status.create({
      title,
      color,
      isActiveTicket,
      autoClose,
      autoCloseHours,
      createdBy: req.user._id
    });

    res.status(201).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all statuses
exports.listStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ title: 1 });
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status by ID
exports.updateStatus = async (req, res) => {
  try {
    const update = (({ title, color, isActiveTicket, autoClose, autoCloseHours }) => 
      ({ title, color, isActiveTicket, autoClose, autoCloseHours }))(req.body);

    const status = await Status.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!status) return res.status(404).json({ message: "Status not found" });

    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete status by ID
exports.deleteStatus = async (req, res) => {
  try {
    await Status.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
