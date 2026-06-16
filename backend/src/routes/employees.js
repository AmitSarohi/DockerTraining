const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeesController');

router.get('/', controller.getEmployees);
router.post('/', controller.createEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
