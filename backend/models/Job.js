const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'],
      default: 'Full-time',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      default: 'Not disclosed',
    },
    vacancies: {
      type: Number,
      default: 1,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
