const router = require('express').Router();
const { getJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/jobs?search=react&category=software-dev&limit=20
router.get('/', getJobs);

module.exports = router;
