const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const verifyAdmin = require('../middlewares/admin.middleware');

router.get('/tasks', verifyAdmin, adminController.getAllTasks);
router.put('/tasks/:id/approve', verifyAdmin, adminController.approveTask);

module.exports = router;