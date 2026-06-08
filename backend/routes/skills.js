const router = require('express').Router();
const { body } = require('express-validator');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(protect);

router.get('/', getSkills);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Skill name is required.').isLength({ max: 100 }),
    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Invalid skill level.'),
  ],
  validate,
  createSkill
);

router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Skill name is required.').isLength({ max: 100 }),
    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Invalid skill level.'),
  ],
  validate,
  updateSkill
);

router.delete('/:id', deleteSkill);

module.exports = router;
