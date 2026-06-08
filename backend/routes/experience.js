const router = require('express').Router();
const { body } = require('express-validator');
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect);

const experienceValidation = [
  body('company').trim().notEmpty().withMessage('Company is required.').isLength({ max: 200 }),
  body('position').trim().notEmpty().withMessage('Position is required.').isLength({ max: 200 }),
  body('start_date').isDate().withMessage('Valid start date required (YYYY-MM-DD).'),
  body('end_date').optional({ nullable: true }).isDate().withMessage('Valid end date required.'),
  body('is_current').optional().isBoolean(),
  body('description').optional().trim(),
];

router.get('/', getExperience);
router.post('/', experienceValidation, validate, createExperience);
router.put('/:id', experienceValidation, validate, updateExperience);
router.delete('/:id', deleteExperience);

module.exports = router;
