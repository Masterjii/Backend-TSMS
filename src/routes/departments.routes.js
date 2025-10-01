const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const departmentController = require('../controllers/department.controller');

// Department routes
router.post('/', requireAuth, requireAdmin, departmentController.createDepartment);
router.get('/', requireAuth, requireAdmin, departmentController.listDepartments);
router.put('/:id', requireAuth, requireAdmin, departmentController.updateDepartment);
router.delete('/:id', requireAuth, requireAdmin, departmentController.deleteDepartment);

module.exports = router;
