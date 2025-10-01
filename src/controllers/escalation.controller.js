// controllers/escalationController.js

const EscalationRulesModel = require("../models/EscalationRules.model");

exports.createRule = async (req, res) => {
  try {
    const rule = await EscalationRulesModel.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRules = async (req, res) => {
  try {
    const rules = await EscalationRulesModel.find({ isActive: true });
    res.json(rules);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rules", error: error.message });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const updated = await EscalationRulesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating rule", error: error.message });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    await EscalationRulesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Rule deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting rule", error: error.message });
  }
};
