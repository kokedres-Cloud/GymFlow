const express = require('express');
const router = express.Router();
const gymbroController = require('../controllers/gymbroController');

// POST /api/gymbro
router.post('/gymbro', gymbroController.ask);

module.exports = router;

