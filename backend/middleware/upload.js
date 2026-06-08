const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const createStorage = (destination) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, `uploads/${destination}/`),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

// Avatar upload: images only, max 2MB
const uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
}).single('avatar');

// CV upload: PDF only, max 5MB
const uploadCV = multer({
  storage: createStorage('cvs'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(['application/pdf']),
}).single('cv');

// Project image: images only, max 3MB
const uploadProjectImage = multer({
  storage: createStorage('projects'),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: fileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
}).single('image');

// Multer error wrapper
const handleMulterError = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = {
  uploadAvatar: handleMulterError(uploadAvatar),
  uploadCV: handleMulterError(uploadCV),
  uploadProjectImage: handleMulterError(uploadProjectImage),
};
