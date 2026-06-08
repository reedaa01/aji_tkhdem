const axios = require('axios');

// GET /api/jobs?search=&category=&limit=
const getJobs = async (req, res, next) => {
  try {
    const { search = '', category = '', limit = 20 } = req.query;

    const params = { limit };
    if (search) params.search = search;
    if (category) params.category = category;

    const response = await axios.get(process.env.JOBS_API_URL, {
      params,
      timeout: 10000,
    });

    const jobs = (response.data.jobs || []).map((job) => ({
      id: String(job.id),
      title: job.title,
      company: job.company_name,
      logo: job.company_logo,
      location: job.candidate_required_location || 'Remote',
      type: job.job_type,
      category: job.category,
      tags: job.tags,
      url: job.url,
      description: job.description,
      salary: job.salary,
      published_at: job.publication_date,
    }));

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.response) {
      return res.status(502).json({ success: false, message: 'Failed to fetch jobs from external API.' });
    }
    next(error);
  }
};

module.exports = { getJobs };
