const PortfolioModel = require('../models/Portfolio');
const SkillModel = require('../models/Skill');
const ExperienceModel = require('../models/Experience');
const ProjectModel = require('../models/Project');

// GET /api/portfolio  — full portfolio of logged-in user
const getMyPortfolio = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const [portfolio, skills, experience, projects] = await Promise.all([
      PortfolioModel.findByUserId(user_id),
      SkillModel.findByUserId(user_id),
      ExperienceModel.findByUserId(user_id),
      ProjectModel.findByUserId(user_id),
    ]);

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        portfolio: portfolio || {},
        skills,
        experience,
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/portfolio  — create or update profile info
const upsertPortfolio = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const portfolio = await PortfolioModel.upsert(user_id, req.body);
    res.status(200).json({ success: true, message: 'Portfolio updated.', data: portfolio });
  } catch (error) {
    next(error);
  }
};

// POST /api/portfolio/avatar
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const user_id = req.user.id;
    await PortfolioModel.ensureExists(user_id);
    const avatar_url = `/uploads/avatars/${req.file.filename}`;
    await PortfolioModel.updateAvatar(user_id, avatar_url);
    res.status(200).json({ success: true, message: 'Avatar uploaded.', avatar_url });
  } catch (error) {
    next(error);
  }
};

// POST /api/portfolio/cv
const uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const user_id = req.user.id;
    await PortfolioModel.ensureExists(user_id);
    const cv_url = `/uploads/cvs/${req.file.filename}`;
    await PortfolioModel.updateCV(user_id, cv_url);
    res.status(200).json({ success: true, message: 'CV uploaded.', cv_url });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyPortfolio, upsertPortfolio, uploadAvatar, uploadCV };
