const ExperienceModel = require('../models/Experience');

// GET /api/experience
const getExperience = async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByUserId(req.user.id);
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

// POST /api/experience
const createExperience = async (req, res, next) => {
  try {
    const exp = await ExperienceModel.create(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Experience added.', data: exp });
  } catch (error) {
    next(error);
  }
};

// PUT /api/experience/:id
const updateExperience = async (req, res, next) => {
  try {
    const updated = await ExperienceModel.update(req.params.id, req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Experience not found.' });
    }
    res.status(200).json({ success: true, message: 'Experience updated.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/experience/:id
const deleteExperience = async (req, res, next) => {
  try {
    const deleted = await ExperienceModel.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Experience not found.' });
    }
    res.status(200).json({ success: true, message: 'Experience deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExperience, createExperience, updateExperience, deleteExperience };
