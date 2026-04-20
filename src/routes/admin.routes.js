const express = require('express');
const router = express.Router();
const { getAllTasks, approveTask } = require('../controllers/admin.controller');
const verifyAdmin = require('../middlewares/admin.middleware');

router.get('/tasks', verifyAdmin, getAllTasks);
router.put('/tasks/:id/approve', verifyAdmin, approveTask);

module.exports = router;