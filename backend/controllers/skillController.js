const SkillModel = require('../models/Skill');

// GET /api/skills
const getSkills = async (req, res, next) => {
  try {
    const skills = await SkillModel.findByUserId(req.user.id);
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

// POST /api/skills
const createSkill = async (req, res, next) => {
  try {
    const skill = await SkillModel.create(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Skill added.', data: skill });
  } catch (error) {
    next(error);
  }
};

// PUT /api/skills/:id
const updateSkill = async (req, res, next) => {
  try {
    const updated = await SkillModel.update(req.params.id, req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }
    res.status(200).json({ success: true, message: 'Skill updated.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/skills/:id
const deleteSkill = async (req, res, next) => {
  try {
    const deleted = await SkillModel.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }
    res.status(200).json({ success: true, message: 'Skill deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
