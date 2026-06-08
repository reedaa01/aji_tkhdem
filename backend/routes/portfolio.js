const router = require('express').Router();
const { body } = require('express-validator');
const {
  getMyPortfolio,
  upsertPortfolio,
  uploadAvatar,
  uploadCV,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { uploadAvatar: avatarUpload, uploadCV: cvUpload } = require('../middleware/upload');

router.use(protect);

router.get('/', getMyPortfolio);

router.put(
  '/',
  [
    body('headline').optional().trim().isLength({ max: 255 }),
    body('bio').optional().trim(),
    body('phone').optional().trim().isLength({ max: 30 }),
    body('location').optional().trim().isLength({ max: 150 }),
    body('website').optional().trim().isURL().withMessage('Invalid website URL.'),
    body('github').optional().trim().isURL().withMessage('Invalid GitHub URL.'),
    body('linkedin').optional().trim().isURL().withMessage('Invalid LinkedIn URL.'),
  ],
  validate,
  upsertPortfolio
);

router.post('/avatar', avatarUpload, uploadAvatar);
router.post('/cv', cvUpload, uploadCV);

module.exports = router;
