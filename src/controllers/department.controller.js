const Department = require('../models/department.model');

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, email, assignedAdmins = [], hidden = false } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const department = await Department.create({ name, description, email, assignedAdmins, hidden });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all departments
exports.listDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const update = (({ name, description, email, assignedAdmins, hidden }) =>
      ({ name, description, email, assignedAdmins, hidden }))(req.body);

    const department = await Department.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });

    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
