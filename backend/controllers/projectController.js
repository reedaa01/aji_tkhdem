const ProjectModel = require('../models/Project');

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.findByUserId(req.user.id);
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const project = await ProjectModel.create(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Project added.', data: project });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const updated = await ProjectModel.update(req.params.id, req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.status(200).json({ success: true, message: 'Project updated.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects/:id/image
const uploadProjectImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded.' });
    }
    const project = await ProjectModel.findById(req.params.id, req.user.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    const image_url = `/uploads/projects/${req.file.filename}`;
    await ProjectModel.updateImage(req.params.id, req.user.id, image_url);
    res.status(200).json({ success: true, message: 'Image uploaded.', image_url });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const deleted = await ProjectModel.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject, updateProject, uploadProjectImage, deleteProject };
