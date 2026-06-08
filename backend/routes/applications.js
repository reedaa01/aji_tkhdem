const router = require('express').Router();
const { body } = require('express-validator');
const {
  getApplications,
  getStats,
  applyToJob,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect);

router.get('/', getApplications);
router.get('/stats', getStats);

router.post(
  '/',
  [
    body('job_id').notEmpty().withMessage('Job ID is required.'),
    body('job_title').trim().notEmpty().withMessage('Job title is required.'),
    body('company_name').trim().notEmpty().withMessage('Company name is required.'),
    body('job_url').optional({ checkFalsy: true }).isURL().withMessage('Invalid job URL.'),
    body('notes').optional().trim(),
  ],
  validate,
  applyToJob
);

router.patch(
  '/:id',
  [
    body('status')
      .isIn(['applied', 'interview', 'offer', 'rejected', 'withdrawn'])
      .withMessage('Invalid status value.'),
    body('notes').optional().trim(),
  ],
  validate,
  updateApplicationStatus
);

router.delete('/:id', deleteApplication);

module.exports = router;
