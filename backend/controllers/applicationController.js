const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Resume (PDF) is required' });
  }

  const existingApplication = await Application.findOne({
    job: req.params.jobId,
    seeker: req.user._id,
  });

  if (existingApplication) {
    return res.status(400).json({ message: 'You have already applied for this job' });
  }

  const application = await Application.create({
    job: req.params.jobId,
    seeker: req.user._id,
    resume: req.file.path,
  });

  res.status(201).json({ application });
};

exports.getMyApplications = async (req, res) => {
  const applications = await Application.find({ seeker: req.user._id })
    .populate({
      path: 'job',
      populate: { path: 'employer', select: 'name email profile.company' },
    })
    .sort('-createdAt');

  res.json({ applications, count: applications.length });
};

exports.getJobApplications = async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to view these applications' });
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('seeker', 'name email profile')
    .sort('-createdAt');

  res.json({ applications, count: applications.length });
};

exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id).populate({
    path: 'job',
    select: 'employer',
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (application.job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this application' });
  }

  application.status = status;
  await application.save();

  res.json({ application });
};
