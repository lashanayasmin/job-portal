const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: String,
      required: [true, 'Resume is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
