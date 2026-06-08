const router = require('express').Router();
const { body } = require('express-validator');
const {
  getProjects,
  createProject,
  updateProject,
  uploadProjectImage,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { uploadProjectImage: projectImageUpload } = require('../middleware/upload');

router.use(protect);

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required.').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('tech_stack').optional().trim().isLength({ max: 500 }),
  body('project_url').optional({ checkFalsy: true }).isURL().withMessage('Invalid project URL.'),
  body('github_url').optional({ checkFalsy: true }).isURL().withMessage('Invalid GitHub URL.'),
];

router.get('/', getProjects);
router.post('/', projectValidation, validate, createProject);
router.put('/:id', projectValidation, validate, updateProject);
router.post('/:id/image', projectImageUpload, uploadProjectImage);
router.delete('/:id', deleteProject);

module.exports = router;
