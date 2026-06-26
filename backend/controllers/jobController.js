const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  req.body.employer = req.user._id;

  const job = await Job.create(req.body);

  res.status(201).json({ job });
};

exports.getJobs = async (req, res) => {
  const { search, type, location } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  if (type) {
    query.type = type;
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  const jobs = await Job.find(query)
    .populate('employer', 'name email profile.company')
    .sort('-createdAt');

  res.json({ jobs, count: jobs.length });
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    'employer',
    'name email profile.company'
  );

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  res.json({ job });
};

exports.updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this job' });
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ job: updatedJob });
};

exports.deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this job' });
  }

  await job.deleteOne();

  res.json({ message: 'Job removed' });
};

exports.getEmployerJobs = async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort('-createdAt');

  res.json({ jobs, count: jobs.length });
};
