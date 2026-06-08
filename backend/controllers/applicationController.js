const JobApplicationModel = require('../models/JobApplication');

// GET /api/applications
const getApplications = async (req, res, next) => {
  try {
    const applications = await JobApplicationModel.findByUserId(req.user.id);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/stats
const getStats = async (req, res, next) => {
  try {
    const stats = await JobApplicationModel.getStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications
const applyToJob = async (req, res, next) => {
  try {
    const { job_id } = req.body;

    const existing = await JobApplicationModel.findByJobAndUser(job_id, req.user.id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'You already applied to this job.' });
    }

    const application = await JobApplicationModel.create(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Application submitted.', data: application });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const updated = await JobApplicationModel.updateStatus(req.params.id, req.user.id, status, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    res.status(200).json({ success: true, message: 'Application status updated.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const deleted = await JobApplicationModel.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    res.status(200).json({ success: true, message: 'Application removed.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getApplications, getStats, applyToJob, updateApplicationStatus, deleteApplication };
