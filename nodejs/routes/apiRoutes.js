const express = require('express');
const router = express.Router();
const { getStates, getDateRangeByState, dashboardData } = require('../controllers/apiController');

// API 1: Get Unique States
router.get('/states', getStates);

// API 2: Get Min & Max Dates by State
router.get('/date-range/:state', getDateRangeByState);

// API 3: Dashboard Data
router.get('/dashboard', dashboardData);

module.exports = router;